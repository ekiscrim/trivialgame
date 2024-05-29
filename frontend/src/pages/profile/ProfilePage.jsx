import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import toast from 'react-hot-toast';
//import Posts from "../../components/common/Posts";
//import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import SkeletonCard from "../../components/common/SkeletonCard"; //cambiar a otro skeleton en el futuro
import EditProfileModal from "../profile/EditProfileModal";

//import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/date";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const profileImgRef = useRef(null);

	const {username} = useParams();

	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({queryKey: ['authUser']});

	const {data: user, isLoading, refetch, isRefetching} = useQuery({
		queryKey:["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error ||"Algo fue mal");
			}
			return data;
			} catch (error) {
				throw new Error(error);
			}
		}
	})

	const {mutate: updateProfile, isPending: isUpdatingProfile} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/users/update`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						profileImg,
					}),
				})
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
			Promise.all([
				queryClient.invalidateQueries({queryKey: ["authUser"]}),
				queryClient.invalidateQueries({queryKey: ["userProfile"]}),
			])
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})


	const isMyProfile = authUser._id === user?._id

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		refetch()
	}, [username, refetch])

	return (
		<>
			<div className='flex-[4_4_0] min-h-screen w-96 bg-base-100 shadow-xl'>
				{(isLoading ||isRefetching) && <SkeletonCard /> }
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
								</div>
							</div>
							<div className='relative'>		
								{isMyProfile && (
								<input
									type='file'
									hidden
									name='profileImg'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								)}
								{/* USER AVATAR */}
								<div className='avatar left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 '>
							{isMyProfile && <EditProfileModal authUser={authUser} />}
								{(profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={() => updateProfile()}
									>
										{isUpdatingProfile ? "Actualizando perfil..." : "Actualizado"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.username}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{formatMemberSinceDate(user?.createdAt)} </span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'>
									Estadisticas
									<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
								</div>
							</div>
							<div className='flex justify-center flex-1 p-3'>
									
								</div>
						</>
					)}

					
				</div>
			</div>
		</>
	);
};
export default ProfilePage;