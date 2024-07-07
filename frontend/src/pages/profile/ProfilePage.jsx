import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import EditProfileModal from "../profile/EditProfileModal";
import Statistics from "../../components/profile/Statistics";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileAvatar from "./UserProfileAvatar";
import UserProfileDetails from "./UserProfileDetails";
import ImageModal from "./ImageModal";
import DeactivateModal from "./DeactivateModal";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  const profileImgRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const editorRef = useRef(null);
  const { username } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const { data: user, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Algo fue mal");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/users/update`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Algo fue mal");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Perfil editado correctamente");
      queryClient.invalidateQueries(['authUser']);
      queryClient.invalidateQueries(['userProfile', username]);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Algo fue mal");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Has salido correctamente");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate('/'); // Redirigir a la página de inicio después del logout
    },
    onError: () => {
      toast.error("Hubo un error");
    }
  });

  const { mutate: deactivateMutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/deactivate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: user._id }),
        });
        if (!res.ok) throw new Error("Algo salió mal");
        return res.json();
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Cuenta desactivada con éxito", { duration: 6000 });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      logoutMutate(); // Realizar logout después de desactivar la cuenta
    },
    onError: (error) => {
      toast.error(error.message, { duration: 6000 });
    }
  });

  const handleDeactivate = () => {
    deactivateMutate();
  };

  const isMyProfile = authUser?._id === user?._id;
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      setSelectedImage(URL.createObjectURL(file));
      reader.readAsDataURL(file);
      setIsImageModalOpen(true);
    }
  };

  const handleProfileUpdate = async (formData) => {
    if (selectedImage) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'profile.png', { type: 'image/png' });
        formData.append('profileImg', file);
        updateProfile(formData);
        setProfileImg(formData.profileImg);
      });
    } else {
      updateProfile(formData);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className='flex flex-col w-full lg:w-1/2 min-h-screen'>
        {(isLoading || isRefetching || isUpdatingProfile) && <LoadingSpinner />}
        {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}

        <UserProfileHeader
          isMyProfile={isMyProfile}
          onOptionsClick={(e) => {
            e.preventDefault();
            setIsOptionsOpen(!isOptionsOpen);
          }}
          isOptionsOpen={isOptionsOpen}
          setIsDeactivateModalOpen={setIsDeactivateModalOpen}
          logoutMutate={logoutMutate}
          setIsOptionsOpen={setIsOptionsOpen}
        />

        <UserProfileAvatar
          profileImg={profileImg}
          user={user}
          isMyProfile={isMyProfile}
          profileImgRef={profileImgRef}
          handleImgChange={handleImgChange}
        />

        <div className='flex justify-end px-4'>
          {isMyProfile && (
            <EditProfileModal
              authUser={authUser}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </div>

        <UserProfileDetails user={user} />

        <div className='flex flex-wrap'>
          <div className='w-full items-center py-4 px-4'>
            {user?._id ? <Statistics userId={user?._id} /> : <LoadingSpinner />}
          </div>
        </div>
      </div>

      {isImageModalOpen && (
        <ImageModal
          editorRef={editorRef}
          selectedImage={selectedImage}
          handleProfileUpdate={handleProfileUpdate}
          setIsImageModalOpen={setIsImageModalOpen}
          setSelectedImage={setSelectedImage}
        />
      )}

      {isDeactivateModalOpen && (
        <DeactivateModal
          handleDeactivate={handleDeactivate}
          setIsDeactivateModalOpen={setIsDeactivateModalOpen}
        />
      )}
    </>
  );
};

export default ProfilePage;
