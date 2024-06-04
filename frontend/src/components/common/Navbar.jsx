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
<nav className={`w-full bg-purple-700 p-3  bottom-0 z-50 ${device === 'Mobile' ? 'fixed z-50 ' : 'fixed top-0 max-h-16 z-50'}`}>

      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link to='/' className='flex items-center'>
            <Logo />
            <span className='text-white text-3xl font-bold hidden sm:flex ml-2'>TRIVIALITE</span>
          </Link>
          <ul className='flex items-center gap-4'>
            <li>
              <Link
                to='/'
                className='flex items-center gap-2 text-white hover:text-violet-200 transition-all'
              >
                <MdHomeFilled className='w-6 h-6' />
                <span className='hidden md:block'>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to='/rankings'
                className='flex items-center gap-2 text-white hover:text-violet-200 transition-all'
              >
                <HiMiniTrophy  className='w-6 h-6' />
                <span className='hidden md:block'>Ranking</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${authUserData?.username}`}
                className='flex items-center gap-2 text-white hover:text-violet-200 transition-all'
              >
                <FaUser className='w-6 h-6' />
                <span className='hidden md:block'>Profile</span>
              </Link>
            </li>
            <li>
            {authUserData.role === 'admin' && (
            <Link to="/admin" className='flex items-center gap-2 text-white hover:text-violet-200 transition-all'>
              <HiMiniMinusCircle className='w-6 h-6' />
              <span className="hidden md:block">Admin</span>
            </Link>
          )}
            </li>
          </ul>
        </div>
        {authUserData && (
          <div className="flex">
          <Link to={`/profile/${authUserData.username}`} className='mt-auto  flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'>
            <div className='flex items-center gap-4'>
              <div className='avatar'>
                <div className='w-8 rounded-full'>
                  <img src={authUserData?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                </div>
              </div>
              <div className='hidden md:block'>
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
