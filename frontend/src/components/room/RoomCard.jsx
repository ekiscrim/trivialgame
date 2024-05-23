import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";


const fetchUserScore = async (roomId, userId) => {
    const res = await fetch(`/api/scores/${roomId}/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch score for room ${roomId}`);
    return res.json()
  };

const RoomCard = ({ room, userId }) => {
    const { data: userScore, isLoading: isScoreLoading, error: scoreError } = useQuery({
      queryKey: ["userScore", room._id, userId],
      queryFn: () => fetchUserScore(room._id, userId),
      enabled: !!userId,
    });
  
    if (isScoreLoading) return <LoadingSpinner />;
    if (scoreError) return <p>Error al cargar los datos de puntuación.</p>;
  
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-2">{room.roomName}</h2>
        <p className="text-gray-600 mb-2">{`Máximo de Usuarios: ${room.maxUsers}`}</p>
        <p className="text-gray-600 mb-4">{`Descripción: ${room.description}`}</p>
        <div className="flex items-center">
          <Link to={`rooms/${room._id}`}>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"> {userScore.hasScore ? "Ver resultados" : "Unirse"}</button>
          </Link>
          {userScore.hasScore && (
            <div className="mt-4 ml-auto badge badge-success gap-1 bg-green-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="ml-2 w-6 h-6 text-white-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
        
            Hecho
            </div>
          )}
        </div>
      </div>
    );
  };

  export default RoomCard;