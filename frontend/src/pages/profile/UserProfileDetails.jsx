import { IoCalendarOutline } from "react-icons/io5";
import { formatMemberSinceDate } from "../../utils/date";

const UserProfileDetails = ({ user }) => (
  <div className='flex flex-col items-center px-4 pb-4'>
    <div className='flex flex-col items-center'>
      <div className='flex flex-col'>
        <p className='font-bold text-2xl text-primary'>{user?.username}</p>
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
);

export default UserProfileDetails;
