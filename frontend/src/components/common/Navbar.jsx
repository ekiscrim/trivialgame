import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { HiMiniTrophy } from "react-icons/hi2";
import { HiMiniMinusCircle } from "react-icons/hi2";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Logo from "../common/Logo"
const Navbar = ({authUser, device}) => {
  const queryClient = useQueryClient();

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
    },
    onError: () => {
      toast.success("Hubo un error");
    }
  });

  const { data: authUserData } = useQuery({ queryKey: ["authUser"] });

  return (
<nav className={`w-full bg-purple-700 p-3 bottom-0 z-50 ${device === 'Mobile' ? 'fixed z-50' : 'fixed top-0 max-h-16 z-50'}`}>
  <div className='max-w-6xl mx-auto flex justify-between items-center'>
    <div className={`flex items-center gap-4 ${device === 'Mobile' ? 'sm:gap-2' : ''}`}>
      <Link to='/' className='flex items-center'>
        <Logo />
        <span className={`text-white text-3xl font-bold hidden ${device === 'Mobile' ? '' : 'sm:flex'} ml-2`}>TRIVIALITE</span>
      </Link>
      <ul className={`flex items-center gap-4 ${device === 'Mobile' ? 'sm:gap-2' : ''}`}>
        <li>
          <div>
            <Link to='/' className={`${device === 'Mobile' ? 'sm:flex sm:flex-col sm:text-center sm:items-center gap-2' : 'sm:flex sm:flex-col sm:text-center sm:items-center gap-2'} text-white hover:text-violet-200 transition-all`}>
              <div className="flex items-center justify-center">
                <MdHomeFilled className={`${device === 'Mobile' ? 'w-8 h-8' : 'w-7 h-7'}`} />
                <span className='hidden md:block ml-2'>Inicio</span>
              </div>
              <span className='block md:hidden text-xs ml-1'>Inicio</span>
            </Link>
          </div>
        </li>
        <li>
          <div>
            <Link to='/rankings' className={`${device === 'Mobile' ? '' : 'sm:flex sm:flex-col sm:text-center sm:items-center gap-2'} text-white hover:text-violet-200 transition-all`}>
              <div className="flex items-center justify-center ${device === 'Mobile' ? 'mt-1' : ''}" >
                <HiMiniTrophy className={`${device === 'Mobile' ? 'w-8 h-8' : 'w-6 h-6'}`} />
                <span className='hidden md:block ml-2'>Ranking</span>
              </div>
              <span className='block md:hidden text-xs'>Ranking</span>
            </Link>
          </div>
        </li>
        <li>
          <div>
            <Link to={`/profile/${authUserData?.username}`} className={`${device === 'Mobile' ? '' : 'sm:flex sm:flex-col sm:text-center sm:items-center gap-2'} text-white hover:text-violet-200 transition-all`}>
              <div className="flex items-center justify-center">
                <FaUser className={`${device === 'Mobile' ? 'w-8 h-8' : 'w-6 h-6'}`} />
                <span className='hidden md:block ml-2'>Perfil</span>
              </div>
              <span className='block md:hidden text-xs'>Perfil</span>
            </Link>
          </div>
        </li>
        <li>
          <div>
            {authUserData.role === 'admin' && (
              <Link to="/admin" className={`${device === 'Mobile' ? '' : 'sm:flex sm:flex-col sm:text-center sm:items-center gap-2'} text-white hover:text-violet-200 transition-all`}>
                <div className="flex items-center justify-center">
                  <HiMiniMinusCircle className={`${device === 'Mobile' ? 'w-8 h-8' : 'w-6 h-6'}`} />
                  <span className="hidden md:block ml-2">Admin</span>
                </div>
                <span className='block md:hidden text-xs'>Admin</span>
              </Link>
            )}
          </div>
        </li>
      </ul>
    </div>
    {authUserData && (
      <div className="flex">
        <Link to={`/profile/${authUserData.username}`} className='mt-auto flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'>
          <div className='flex items-center gap-2'>
            <div className='avatar'>
              <div className='w-8 rounded-full'>
                <img src={authUserData?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
              </div>
            </div>
            <div className={`${device === 'Mobile' ? '' : 'hidden sm:block'}`}>
              <p className='text-white text-sm'>@{authUserData?.username}</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <BiLogOut
            className='w-6 h-6 text-white cursor-pointer hover:text-violet-200 transition-all'
            onClick={(e) => {
              e.preventDefault();
              logoutMutate();
            }}
          />
        </div>
      </div>
    )}
  </div>
</nav>
  );
};

export default Navbar;
