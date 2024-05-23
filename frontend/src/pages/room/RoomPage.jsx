import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams, useNavigate } from 'react-router-dom';
import ScoreTable from '../../components/score/ScoresTable';

const RoomPage = () => {
  const { id } = useParams();
  const { data: userId } = useQuery({ queryKey: ["authUser"] });
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

  // Nueva consulta para obtener el score del usuario para la sala específica
  const { data: userScoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["userScoreData", id, userId],
    queryFn: async () => {
      try {
        if (!id || !userId._id) {
          throw new Error('Room ID or User ID is undefined');
        }

        const res = await fetch(`/api/scores/${id}/${userId._id}`);
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!userId, // Ejecutar la consulta sólo si userId está definido
  });

  // Función para determinar si se puede iniciar el juego
  const canStartGame = () => {
    if (!userScoreData.hasScore) return true;

    const userInRoom = roomData.users.find(user => user._id === userId._id);
    const maxUsersReached = roomData.users.length >= roomData.room.maxUsers;

    return userInRoom !== 'undefined' && !userScoreData.hasScore  && !maxUsersReached;
  };

  const { mutate, isError, isPending, someError } = useMutation({
    mutationFn: async ({ userId, roomId }) => {
      try {
        const res = await fetch(`/api/rooms/${roomId}/joinRoom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Algo fue mal");
        return data;

      } catch (someError) {
        console.log(someError);
        throw someError;
      }

    },
    onSuccess: () => {
      toast.success("Te has unido a la sala");
    }
  });

  const handleStart = () => {
    if (roomData && roomData.room && roomData.room.categories) {
      if (userScoreData && userScoreData.length > 0) {
        alert("You have already completed this room.");
        return;
      }

      mutate({ userId: userId._id, roomId: roomData.room._id });

      const shuffledCategories = shuffleArray(roomData.room.categories);
      navigate(`/room/${id}/questions/${shuffledCategories.join(',')}`);
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
      <ScoreTable />
      
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
            {canStartGame() ? (
              <button
                onClick={handleStart}
                className="btn btn-primary mt-4"
              >
                {isPending ? "Loading..." : "Start"}
              </button>
            ) : (
              <p className="text-red-500 mt-4">Cannot start the game at the moment.</p>
            )}
            {roomData.users.length >= roomData.room.maxUsers && (
              <p className="text-red-500 mt-4">Maximum number of users reached.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
