import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { BiDotsVerticalRounded } from "react-icons/bi";

const UserProfileHeader = ({ isMyProfile, onOptionsClick, isOptionsOpen, setIsDeactivateModalOpen, logoutMutate, setIsOptionsOpen }) => (
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
              onClick={onOptionsClick}
            />
            {isOptionsOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                <div
                  className="cursor-pointer rounded-lg flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsOptionsOpen(false);
                    setIsDeactivateModalOpen(true);
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
  </div>
);

export default UserProfileHeader;
