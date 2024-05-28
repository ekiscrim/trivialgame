import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import EmojiGrid from "../categories/EmojiGrid";
import { UserIcon } from '@heroicons/react/solid';
import { HiMiniTableCells } from "react-icons/hi2";
import { HiMiniUserGroup } from "react-icons/hi2";
import { HiClock } from "react-icons/hi2";
import { HiEye } from "react-icons/hi2";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";

import SkeletonCard from "../common/SkeletonCard";
import useCountdown from '../../hooks/useCountdown';

const fetchUserScore = async (roomId, userId) => {
  const res = await fetch(`/api/scores/${roomId}/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch score for room ${roomId}`);
  return res.json();
};

const fetchCategories = async (roomId) => {
  const res = await fetch(`/api/rooms/${roomId}/categories`);
  if (!res.ok) throw new Error(`Failed to fetch categories for room ${roomId}`);
  const data = await res.json();
  return data.categories || [];
};

const fetchRoomCreator = async (roomId) => {
  const response = await fetch(`/api/rooms/${roomId}/creator`);
  if (!response.ok) throw new Error('Failed to fetch room creator');
  return response.json();
};


const RoomCard = ({ room, userId }) => {
  const { data: userScore, isLoading: isScoreLoading, error: scoreError } = useQuery({
    queryKey: ["userScore", room._id, userId],
    queryFn: () => fetchUserScore(room._id, userId),
    enabled: !!userId,
  });

  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories", room._id],
    queryFn: () => fetchCategories(room._id),
  });

  const { data: creatorData, isLoading: isCreatorLoading, error: creatorError } = useQuery({
    queryKey: ["roomCreator", room._id],
    queryFn: () => fetchRoomCreator(room._id),
  });

  const timeLeft = useCountdown(new Date(room.startTime).getTime() + room.duration);

  if (isScoreLoading || isCategoriesLoading || isCreatorLoading) return <SkeletonCard />;
  if (scoreError) return <p>Error al cargar los datos de puntuación.</p>;
  if (categoriesError) return <p>Error al cargar las categorías.</p>;
  if (creatorError) return <p>Error al cargar el creador de la sala.</p>;

  const formatTimeLeft = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    
<Link to={`rooms/${room._id}`} className="card-link">
  <div className="card w-96 bg-base-100 shadow-xl" style={{ maxWidth: "100%" }}>
    
    <figure><img className="hue-rotate-90" src="https://static.vecteezy.com/system/resources/previews/006/691/884/non_2x/blue-question-mark-background-with-text-space-quiz-symbol-vector.jpg" alt="Questions" />
      <EmojiGrid categories={categories} />
    </figure>
    <div className="card-body">
      <h1 className="card-title uppercase font-black">
        {room.roomName}
      </h1>
        {userScore?.hasScore && (
          <>
          <div className="badge badge-success bg-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-400 text-xs">Ya has participado</span>
          </>
        )}
      
      <div className="flex items-center mb-2">
        <HiClock className="w-5 h-5 mr-1 text-gray-500"/> <span className="mr-2">Tiempo restante: <strong>{formatTimeLeft(timeLeft)}</strong></span>
      </div>
      <div className="flex items-center mb-2">
        <UserIcon className="w-5 h-5 mr-1 text-gray-500" /> <span className="mr-2">Creador de la sala:</span> <strong>{creatorData.creatorUsername}</strong>
      </div>
      <div className="flex items-center mb-2">
        <HiMiniTableCells className="w-5 h-5 mr-1 text-gray-500" /> <span className="mr-2">Número de preguntas:</span> <strong>{room.questions.length}</strong>
      </div>
      <div className="flex items-center mb-2">
        <HiMiniUserGroup className="w-5 h-5 mr-1 text-gray-500" /> <span className="mr-2">Participantes:</span> <strong>{room.users.length}</strong>
      </div>
      <div className="mb-2">
        {categories.map((category, index) => (
          <div key={index} className="badge badge-ghost mr-2 mb-2 w-full">{category}</div>
        ))}
      </div>
      <div className="flex justify-end absolute -mt-14">
        <div className="card-actions">
          {userScore?.hasScore && (
            <button className="btn btn-primary min-w-full"><HiEye /> Ver resultados</button>
          )}
          {!userScore?.hasScore && (
            <button className="btn btn-primary"> <HiArrowRightStartOnRectangle />Unirse a la sala</button>
          )}
        </div>
      </div>
    </div>           
  </div>
</Link>

  );
};

export default RoomCard;
