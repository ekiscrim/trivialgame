import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams, useNavigate } from 'react-router-dom';
import ScoresTable from '../../components/score/ScoresTable';
import SkeletonCard from "../../components/common/SkeletonCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const RoomPage = () => {
  const { id } = useParams();
  const { data: userId } = useQuery({ queryKey: ["authUser"] });
  const navigate = useNavigate();

  const { data: roomData, isLoading, error } = useQuery({
    queryKey: ["roomData", id],
    queryFn: async () => {
      if (!id) throw new Error('Room ID is undefined');
      const res = await fetch(`/api/rooms/${id}`);
      if (!res.ok) throw new Error('Error fetching room data');
      return res.json();
    },
  });

  const { data: userScoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["userScoreData", id, userId],
    queryFn: async () => {
      if (!id || !userId._id) throw new Error('Room ID or User ID is undefined');
      const res = await fetch(`/api/scores/${id}/${userId._id}`);
      if (!res.ok) throw new Error('Error fetching user score data');
      return res.json();
    },
    enabled: !!userId,
  });

  const canStartGame = () => {
    if (!roomData || !roomData.users || !roomData.room) return false;
    
    const userInRoom = roomData.users.find(user => user._id === userId._id);
    const currentTime = Date.now();
    const timeElapsed = currentTime - new Date(roomData.room.startTime).getTime();
    const timeRemaining = roomData.room.duration - timeElapsed;
    return (!userInRoom || !userScoreData.hasScore) && (roomData.room.status === 'waiting' && timeRemaining > 0);
  };




  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ userId, roomId }) => {
      const res = await fetch(`/api/rooms/${roomId}/joinRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Error joining room');
      return res.json();
    },
    onSuccess: () => {
      toast.success("Te has unido a la sala");
    }
  });

  const handleStart = () => {
    if (roomData && roomData.room && roomData.room.categories) {
      if (userScoreData && userScoreData.length > 0) {
        alert("Ya has participado en esta sala");
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

  if (!roomData || !roomData.room || !roomData.users || !userScoreData) {
    return <SkeletonCard />
  }


  return (
    <div className="flex flex-col items-center sm:min-w-full lg:min-w-min">
      <div className="grid col-span- mb-4 -mt-8 relative bg-purple-700 rounded-lg p-3">
      <h1 className="text-2xl font-bold my-8 text-cyan-300">
        {roomData && roomData.room ? roomData.room.roomName : <LoadingSpinner />}
      </h1>
      </div>
      {isLoading && <SkeletonCard />}
      {error && <p className="text-lg text-red-500">Error: {error.message}</p>}
      <ScoresTable currentUser={userId._id} />
      {roomData && (
        <div className="card w-full  bg-base-100 shadow-xl my-6">
          <div className="card-body">
            <h2 className="card-title">Se han unido a la sala:</h2>
            <ul className="list-disc list-inside">
              {roomData.users.map((user) => (
                <li key={user._id} className="text-lg">{user.username}</li>
              ))}
            </ul>
            {roomData.room.status === 'finished' ? (
              <p className="text-red-500 mt-4">La sala ha terminado.</p>
            ) : (
              <>
              {canStartGame() ? (
                <button
                  onClick={handleStart}
                  className="btn btn-primary mt-4"
                >
                  {isPending ? "Cargando..." : "Comenzar partida"}
                </button>
              ) : (
                <p className="text-red-500 mt-4">Ya has participado.</p>
              )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
