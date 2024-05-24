import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = ({authUser}) => {
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
    <nav className='w-full bg-purple-700 p-3 fixed top-0 z-50'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link to='/' className='flex items-center'>
            {/* Puedes agregar un logo aquí si tienes uno */}
            <span className='text-white text-2xl font-bold'>TRIVIAL QUIZ</span>
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
                to='/notifications'
                className='flex items-center gap-2 text-white hover:text-violet-200 transition-all'
              >
                <IoNotifications className='w-6 h-6' />
                <span className='hidden md:block'>Notifications</span>
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
            <Link to="/admin">
              <button className="admin-button flex items-center gap-2 text-white hover:text-violet-200 transition-all">Admin</button>
            </Link>
          )}
            </li>
          </ul>
        </div>
        {authUserData && (
          <div className='flex items-center gap-4'>
            <div className='avatar'>
              <div className='w-8 rounded-full'>
                <img src={authUserData?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
              </div>
            </div>
            <div className='hidden md:block'>
              <p className='text-white font-bold text-sm w-20 truncate'>{authUserData?.fullName}</p>
              <p className='text-white text-sm'>@{authUserData?.username}</p>
            </div>
            <BiLogOut
              className='w-6 h-6 text-white cursor-pointer hover:text-violet-200 transition-all'
              onClick={(e) => {
                e.preventDefault();
                logoutMutate();
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
