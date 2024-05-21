import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from 'react-router-dom';

const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: roomData, isLoading, error } = useQuery({
    queryKey: ["roomData", id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error('Room ID is undefined');
        }
        
        const res = await fetch(`/api/rooms/${id}`);
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const handleStart = () => {
    if (roomData && roomData.room && roomData.room.categories) {
      const shuffledCategories = shuffleArray(roomData.room.categories); // Mezclar las categorías seleccionadas
      navigate(`/room/${id}/questions/${shuffledCategories.join(',')}`); // Navegar a la primera pregunta con las categorías mezcladas
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold my-8">Room {id}</h1>
      {isLoading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-lg text-red-500">Error: {error.message}</p>}
      {roomData && (
        <div className="card w-full md:w-1/2 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Users in the Room</h2>
            <ul className="list-disc list-inside">
              {roomData.users.map((user) => (
                <li key={user._id} className="text-lg">
                  {user.username}
                </li>
              ))}
            </ul>
            <button onClick={handleStart} className="btn btn-primary mt-4">
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
