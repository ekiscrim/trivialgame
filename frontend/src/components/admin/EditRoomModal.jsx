import { useState, useEffect } from 'react';

const EditRoomModal = ({ isOpen, room, onClose, onUpdateRoom }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (room) {
      setNewRoomName(room.roomName);
      setNewStatus(room.status);
    }
  }, [room]);

  const handleChangeRoomName = (e) => {
    setNewRoomName(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = () => {
    onUpdateRoom(room._id, newRoomName, newStatus);
    onClose();
  };

  if (!isOpen || !room) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="relative bg-white rounded-lg p-8">
          <div className="absolute top-0 right-0">
            <button onClick={onClose}>&times;</button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Edit Room</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Room Name</label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                value={newRoomName}
                onChange={handleChangeRoomName}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={newStatus}
                onChange={handleChangeStatus}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              <ul>
                {room.questions.map((question, index) => (
                  <li key={question._id}>{question.question}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;
