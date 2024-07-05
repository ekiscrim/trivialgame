import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import AvatarEditor from "react-avatar-editor";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/date";
import EditProfileModal from "../profile/EditProfileModal";
import Statistics from "../../components/profile/Statistics";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { BiLogOut, BiDotsVerticalRounded } from "react-icons/bi";

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
            <div className='flex flex-col w-full lg:w-1/2 min-h-screen '>
                {(isLoading || isRefetching) && <LoadingSpinner />}
                {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
    
                <div className='w-full text-primary'>
                    <div className='flex px-4 py-2 items-center'>
                        <Link onClick={() => history.go(-1)}>
                            <FaArrowLeft className='w-7 h-7 text-white' />
                        </Link>
                        {isMyProfile && (
                            <div className="relative ml-auto ">
                                <div className="relative">
                                    <BiDotsVerticalRounded
                                        className='w-8 h-8 text-white cursor-pointer hover:text-gray-200 transition-all'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsOptionsOpen(!isOptionsOpen);
                                        }}
                                    />
                                    {isOptionsOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                                            <div
                                                className="cursor-pointer rounded-lg flex items-center px-4 py-2 hover:bg-gray-100"
                                                onClick={() => {
                                                    
                                                    setIsOptionsOpen(false);
                                                    setIsDeactivateModalOpen(true)
                                                }}
                                            >
                                                Desactivar Cuenta
                                            </div>
                                            <div
                                                className="cursor-pointer rounded-lg flex items-center px-4 py-2 hover:bg-gray-100"
                                                onClick={() => {
                                                    logoutMutate();
                                                    setIsOptionsOpen(false);
                                                }}
                                            >
                                                Salir
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='relative flex flex-col items-center px-4  pb-4'>
                        <div className='avatar '>
                        <div className='w-32 h-32 rounded-full relative group/avatar'>
                                <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} alt="User avatar" />
                                {isMyProfile && (
                                    <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                        <MdEdit
                                            className='w-4 h-4 text-white'
                                            onClick={() => profileImgRef.current.click()}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {isMyProfile && (
                            <input
                                type='file'
                                hidden
                                name='profileImg'
                                ref={profileImgRef}
                                onChange={handleImgChange}
                            />
                        )}
                    </div>
                    <div className='flex justify-end px-4 '>
                        {isMyProfile && (
                            <EditProfileModal
                                authUser={authUser}
                                onProfileUpdate={handleProfileUpdate}
                            />
                        )}
                    </div>
                    <div className='flex flex-col items-center px-4  pb-4'>
                        <div className='flex flex-col'>
                            <div className='flex flex-col'>
                                <p className='font-bold text-2xl '>{user?.username}</p>
                            </div>
                            <span className='text-sm text-primary'>@{user?.username}</span>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            <div className='flex gap-2 items-center mb-2'>
                                <IoCalendarOutline className='w-4 h-4 text-primary' />
                                <span className='text-sm text-primary'>{formatMemberSinceDate(user?.createdAt)} </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap'>
                    <div className='w-full items-center py-4 px-4'>
                        {user?._id ? <Statistics userId={user?._id} /> : <LoadingSpinner />}
                    </div>
                </div>
            </div>
            {isImageModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg">
                        <AvatarEditor
                            ref={editorRef}
                            image={selectedImage}
                            width={250}
                            height={250}
                            border={50}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={1.2}
                            rotate={0}
                            borderRadius={200}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setIsImageModalOpen(false);
                                    setSelectedImage(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    const formData = new FormData();
                                    setIsImageModalOpen(false);
                                    handleProfileUpdate(formData);
                                }}
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Modal para desactivar cuenta */}
            {isDeactivateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas desactivar tu cuenta?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    handleDeactivate();
                                    setIsDeactivateModalOpen(false);
                                }}
                                className='btn btn-danger mr-2'
                            >
                                Sí, desactivar cuenta
                            </button>
                            <button
                                onClick={() => setIsDeactivateModalOpen(false)}
                                className='btn btn-secondary'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
    
    
};

export default ProfilePage;

