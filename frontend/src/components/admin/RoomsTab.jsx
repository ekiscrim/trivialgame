import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import RoomsList from '../../components/admin/RoomsList';
import EditRoomModal from './EditRoomModal';

const RoomsTab = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/admin/rooms');
        if (!response.ok) {
          throw new Error('Error fetching rooms');
        }
        const data = await response.json();
        setRooms(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };

  const handleUpdateRoom = async (roomId, newRoomName, newStatus) => {
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName: newRoomName, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Error updating room');
      }
      const updatedRoom = await response.json();
      setRooms(rooms.map((room) => (room._id === updatedRoom._id ? updatedRoom : room)));
      toast.success('Room updated successfully');
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-4">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rooms</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <li key={room._id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900">{room.roomName}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditRoom(room)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </div>
                </li>
              ))}
            </ul>
            <EditRoomModal isOpen={isModalOpen} room={selectedRoom} onClose={handleCloseModal} onUpdateRoom={handleUpdateRoom} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsTab;
