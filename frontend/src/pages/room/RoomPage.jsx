import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams, useNavigate } from 'react-router-dom';
import ScoresTable from '../../components/score/ScoresTable';

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
    const userInRoom = roomData.users.find(user => user._id === userId._id);
    const maxUsersReached = roomData.users.length >= roomData.room.maxUsers;
    return !userScoreData.hasScore || userInRoom || !userInRoom;
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

  if (!roomData || !roomData.room || !roomData.users || !userScoreData) {
    return <p>Loading room data...</p>;
  }

  const maxUsersReached = roomData.users.length >= roomData.room.maxUsers;

  return (
    <div className="flex flex-col items-center sm:min-w-full lg:min-w-min">
      <h1 className="text-3xl font-bold my-8 text-cyan-300">
        {roomData && roomData.room ? roomData.room.roomName : 'Loading...'}
      </h1>
      {isLoading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-lg text-red-500">Error: {error.message}</p>}
      <ScoresTable currentUser={userId._id} />

      {roomData && (
        <div className="card w-full  bg-base-100 shadow-xl my-6">
          <div className="card-body">
            <h2 className="card-title">Participantes:</h2>
            <ul className="list-disc list-inside">
              {roomData.users.map((user) => (
                <li key={user._id} className="text-lg">{user.username}</li>
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
      maxUsersReached ? (
        <p className="text-red-500 mt-4">Se han alcanzado el número máximo de participantes en la sala</p>
      ) : (
        <p className="text-red-500 mt-4">Sala cerrada.</p>
      )
    )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
