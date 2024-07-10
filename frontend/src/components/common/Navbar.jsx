import { MdHomeFilled } from "react-icons/md";
import { HiBell } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { HiMiniTrophy } from "react-icons/hi2";
import { HiMiniMinusCircle } from "react-icons/hi2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Logo from "../common/Logo";
import LoadingSpinner from "./LoadingSpinner";
import { HiOutlinePencilAlt, HiPencilAlt } from "react-icons/hi";
import CreateRoom from "../room/CreateRoom";

const Navbar = ({ authUser, device }) => {
  const queryClient = useQueryClient();


  const { data: notificationsData, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('No se pudo obtener las notificaciones');
      }
      const data = await response.json();
      return data;
    },
  });


  const unreadCount = notificationsData?.unreadCount || 0;

  if (isLoading) {
    <LoadingSpinner />
  }
  
  if (isError) {
    toast.error('Hubo un error al obtener las notificaciones');
  }

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    },
  });

  const { data: authUserData } = useQuery({
    queryKey: ["authUser"],
  });

  return (
    <nav
      className={`w-full p-3 bottom-0 z-40 ${device === "Mobile" ? "fixed bg-purple-700 bg-opacity-60 backdrop-blur-md" : "fixed bg-purple-700 top-0 max-h-16"}`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className={`flex items-center ${device === "Mobile" ? "" : ""}`}>
          <Link to="/" className="flex items-center">
            
            <span className={`text-white text-3xl font-bold hidden ${device === "Mobile" ? "" : "sm:flex"} ml-2`}>
              
            </span>
          </Link>
          <ul className={`flex items-center ${device === "Mobile" ? (authUserData && authUserData.role === "admin" ? "gap-6" : "gap-7") : "gap-4"}`}>

            <li>
              <div>
                <Link
                  to="/"
                  className={`${device === "Mobile" ? "sm:flex sm:flex-col sm:text-center sm:items-center gap-2" : "sm:flex sm:flex-col sm:text-center sm:items-center gap-2"} text-white hover:text-violet-200 transition-all`}
                >
                  <div className="flex items-center justify-center">
                    <Logo className={`${device === "Mobile" ? "w-12 h-12" : "w-10 h-10"}`} />
                    <span className="hidden md:block ml-2"></span>
                  </div>
                  <span className="block md:hidden text-xs ml-1"></span>
                </Link>
              </div>
            </li>
            <li>
              <div>
                <Link
                  to="/rankings"
                  className={`${device === "Mobile" ? "" : "sm:flex sm:flex-col sm:text-center sm:items-center gap-2"} text-white hover:text-violet-200 transition-all`}
                >
                  <div className="flex items-center justify-center ${device === 'Mobile' ? 'mt-1' : ''}">
                    <HiMiniTrophy className={`${device === "Mobile" ? "w-8 h-8" : "w-6 h-6"}`} />
                    <span className="hidden md:block ml-2">Ranking</span>
                  </div>
                  <span className="block md:hidden text-xs">Ranking</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="relative">
                <Link to={`/notifications`} className={`text-white hover:text-violet-200 transition-all ${device === "Mobile" ? "sm:flex sm:flex-col sm:text-center sm:items-center gap-2" : "sm:flex sm:flex-col sm:text-center sm:items-center gap-2"}`}>
                  <div className="flex items-center justify-center">
                    <HiBell className={`${device === "Mobile" ? "w-8 h-8" : "w-7 h-7"}`} />
                    <span className="hidden md:block ml-2">Notificaciones</span>
                  </div>
                  <span className="block md:hidden text-xs">Notif.</span>
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 left-1 mt-0 ml-4 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                      {unreadCount}
                    </div>
                  )}
                </Link>
              </div>
            </li>

            <li>
                  <CreateRoom device />
            </li>

            <li>
              <div>
                {authUserData && authUserData.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`${device === "Mobile" ? "sm:flex sm:flex-col sm:text-center sm:items-center gap-2" : "sm:flex sm:flex-col sm:text-center sm:items-center gap-2"} text-white hover:text-violet-200 transition-all`}
                  >
                    <div className="flex items-center justify-center">
                      <HiMiniMinusCircle className={`${device === "Mobile" ? "w-8 h-8" : "w-6 h-6"}`} />
                      <span className="hidden md:block ml-2">Admin</span>
                    </div>
                    <span className="block md:hidden text-xs">Admin</span>
                  </Link>
                )}
              </div>
            </li>
          </ul>
        </div>
        {authUserData && (
          <div className="flex">
            <Link
              to={`/profile/${authUserData.username}`}
              className="mt-auto flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
            >
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={authUserData?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                  </div>
                </div>
                <div className={`${device === "Mobile" ? "hidden" : "block"}`}>
                  <p className="text-white text-sm">@{authUserData?.username}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center">
              <BiLogOut
                className={`${device === "Mobile" ? "hidden" : "w-6 h-6 text-white cursor-pointer hover:text-violet-200 transition-all"}`}
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
