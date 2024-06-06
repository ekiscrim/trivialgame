const RoomsList = ({rooms}) => {
    return (
      <ul className="divide-y divide-gray-200">
        {rooms.map((room) => (
          <li key={room._id} className="py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{room.roomName}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  export default RoomsList;
  