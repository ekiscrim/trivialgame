import { MdEdit } from "react-icons/md";

const UserProfileAvatar = ({ profileImg, user, isMyProfile, profileImgRef, handleImgChange }) => (
  <div className='relative flex flex-col items-center px-4 pb-4'>
    <div className='avatar'>
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
);

export default UserProfileAvatar;
