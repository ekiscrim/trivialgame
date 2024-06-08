import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import useCountdown from '../../hooks/useCountdown';
import { useQuery } from '@tanstack/react-query';

const fetchUserScore = async (roomId, userId) => {
  const res = await fetch(`/api/scores/${roomId}/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch score for room ${roomId}`);
  return res.json();
};

const SuperRoomCard = ({ room, userId }) => {
  const { data: userScore, isLoading: isScoreLoading, error: scoreError } = useQuery({
    queryKey: ["userScore", room._id, userId],
    queryFn: () => fetchUserScore(room._id, userId),
    enabled: !!userId,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const timeLeft = useCountdown(new Date(room.startTime).getTime() + room.duration);

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

  useEffect(() => {
    // Simulando la carga de datos de categorías
    fetch(`/api/rooms/${room._id}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setIsLoading(false);
      });

  }, [room]);

  useEffect(() => {
    // Verificar el estado de la sala cuando el tiempo restante llega a cero
    if (timeLeft <= 0) {
      updateRoomStatus(room._id, 'finished')
        .then(response => console.log('Room status updated:', response))
        .catch(error => console.error('Error updating room status:', error));
    }
  }, [timeLeft, room._id]);

  const formatTimeLeft = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isScoreLoading) return 'Cargando...';

  return (
    <div className="hero" style={{ backgroundImage: `url(https://i.ytimg.com/vi/Bweua7AVZSY/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AHUBoAC4AOKAgwIABABGH8gOSgUMA8=&rs=AOn4CLDHk9DnQ6qXRL-Jx87swSb7KZbQfA)` }}>
      <div className="hero-overlay bg-opacity-60 "></div>
      <div className="hero-content text-center text-neutral-content ">
        <div className="max-w-md bg-white bg-opacity-80 p-1 rounded-lg shadow-lg">
          <h1 className=" text-5xl font-bold text-black">{room.roomName}</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="mb-3 mt-2 text-black">Número de preguntas: {room.questions.length}</p>
              <p className="mb-3 text-black">Participantes: {room.users.length}</p>
              <p className="mb-3 text-black">Categorías: {categories.join(", ")}</p>
            </>
          )}
          <p className="mb-5 text-black">{timeLeft > 0 ? `Tiempo restante: ${formatTimeLeft(timeLeft)}` : "Sala cerrada"}</p>
          <div className="flex justify-center">
            {userScore.hasScore ? (
              <Link to={`rooms/${room._id}`}>
                <button className="btn btn-primary">Ver resultados</button>
              </Link>
            ) : (
              <Link to={`rooms/${room._id}`}>
                <button className="btn btn-primary">Unirse</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperRoomCard;
