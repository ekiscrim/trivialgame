import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import SkeletonCard from "../common/SkeletonCard";
import useCountdown from '../../hooks/useCountdown';
import { HiClock, HiEye, HiOutlineQuestionMarkCircle, HiOutlineTag, HiOutlineUser, HiOutlineUsers } from "react-icons/hi";
import { HiArrowRightStartOnRectangle, HiMiniTableCells, HiMiniUserGroup } from "react-icons/hi2";
import { UserIcon } from "@heroicons/react/solid";
import EmojiGrid from "../categories/EmojiGrid"
import { HiLockClosed } from "react-icons/hi2";

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

const updateRoomStatus = async (roomId, status) => {
  try {
    const res = await fetch(`/api/rooms/${roomId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error('Error actualizando el estado de la sala');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



const getBackgroundColor = (categories) => {
  if (!categories || categories.length === 0) {
    return ''; // No categories, return empty string
  }

  const categoryColors = [];

  categories.forEach((category) => {
    if (category.includes('Geografía')) {
      categoryColors.push('#00b4db'); // Azul
    }
    if (category.includes('Historia')) {
      categoryColors.push('#f6d365'); // Amarillo
    }
    if (category.includes('Deportes')) {
      categoryColors.push('#ff7e5f'); // Naranja
    }
    if (category.includes('Ciencias')) {
      categoryColors.push('#3ee1a9'); // Verde
    }
    if (category.includes('Entretenimiento')) {
      categoryColors.push('#ff9a9e'); // Rosa
    }
    if (category.includes('Arte')) {
      categoryColors.push('#9d50bb'); // Morado
    }
  });

  if (categoryColors.length === 1) {
    return categoryColors[0]; // Single color
  } else if (categoryColors.length > 1) {
    const gradientColors = categoryColors.join(', ');
    return `linear-gradient(135deg, ${gradientColors})`; // Multiple colors
  }

  return ''; // Default case
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        updateRoomStatus(room._id, 'finished')
          .then(response => console.log('Room status updated:', response))
          .catch(error => console.error('Error updating room status:', error));
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [timeLeft, room._id]);


  if (isScoreLoading || isCategoriesLoading || isCreatorLoading) return <SkeletonCard />;
  if (scoreError) return <p>Error al cargar los datos de puntuación.</p>;
  if (categoriesError) return <p>Error al cargar las categorías.</p>;
  if (creatorError) return <p>Error al cargar el creador de la sala.</p>;

  const backgroundColor = getBackgroundColor(categories);

  const formatTimeLeft = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Link to={`rooms/${room._id}`} className="card-link">
      <div className="card w-96 bg-base-100 shadow-xl" style={{ maxWidth: "100%" }}>
        <figure className={`items-center relative flex`} style={{ background: backgroundColor }}>
          <img
            className="w-full object-cover"
            src="/question.png"
            alt="Questions"
          />
          <div className="absolute inset-0 flex justify-start items-end">
            <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-white">
              <h1 className="text-lg uppercase font-black">{room.roomName}</h1>
            </div>
          </div>
          <div className="absolute inset-0 bg-white bg-opacity-20 flex">
            <EmojiGrid categories={categories} />
          </div>
        </figure>
        <div className="card-body flex flex-col justify-between h-full">
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
  
          <div className="items-center text-center mb-2">
            
            <span className="items-center text-center w-full">
              {timeLeft > 0 && <HiClock className="w-5 h-5 mr-1 text-gray-500" /> && `Tiempo restante: `}
              {timeLeft > 0 &&  <strong>{formatTimeLeft(timeLeft)}</strong>}
              {timeLeft < 0 && <HiLockClosed /> && <strong>Sala cerrada</strong>}
            </span>
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
          <div className="card-actions">
            {userScore?.hasScore ? (
              <button className="btn btn-primary min-w-full"><HiEye /> Ver resultados</button>
            ) : (
              <button className="btn btn-primary w-full"> <HiArrowRightStartOnRectangle />Unirse a la sala</button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
  
};
export default RoomCard;
