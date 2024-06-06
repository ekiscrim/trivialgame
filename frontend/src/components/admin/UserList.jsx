const UserList = ({ users, onEdit, onDelete }) => {
    return (
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user._id} className="py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img className="w-12 h-12 rounded-full" src={`${user?.profileImg || "/avatar-placeholder.png"}`} alt="user avatar" />
              <div className="flex flex-col">
                <p className={`"text-sm font-medium text-gray-900 ${user.deleted ? 'line-through' : ''}`}>{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
                <p className="text-sm text-red-500">{user.deleted ? 'Borrado' : ''}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(user._id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  export default UserList;
  