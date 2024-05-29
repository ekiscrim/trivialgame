import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScoresTable from '../../components/score/ScoresTable';
import SkeletonCard from "../../components/common/SkeletonCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
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
    return <LoadingSpinner />
  }


  return (
    <div className=" min-w-full h-full">
      <div className="w-full bg-purple-700 pb-1 -mt-12 rounded-lg top-0">
        <h1 className="text-2xl font-bold my-4 text-cyan-300 text-center pt-7">
          {roomData && roomData.room ? roomData.room.roomName : <LoadingSpinner />}
        </h1>
      </div>
      {isLoading && <SkeletonCard />}
      {error && <p className="text-lg text-red-500">Error: {error.message}</p>}
      <div className="lg:w-1/2 p-4 mx-auto text-center">
        {roomData.room.status === 'finished' ? (
                <p className="text-red-500 mt-4">La sala ha terminado.</p>
              ) : (
                <>
                {canStartGame() ? (
                  <button
                    onClick={handleStart}
                    className="btn btn-primary mt-4 w-full lg:w-96"
                  >
                    {isPending ? "Cargando..." : <HiArrowRightStartOnRectangle />} Comenzar Partida</button>
                ) : (
                  <div role="alert" className="alert alert-success text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Ya has participado!</span>
                  </div>
                )}
                </>
              )}
      </div>

      <ScoresTable currentUser={userId._id} />
      {roomData && (
        <div className="card lg:card sm:w-1/4 lg:w-1/5 lg:p-4 mx-auto text-center bg-base-100 shadow-xl my-6 sticky top-0 left-0 right-0">
          <div className="card-body">
            <h2 className="card-title">Se han unido a la sala:</h2>
            <ul className="list-disc list-inside">
              {roomData.users.map((user) => (
                <Link key={user._id} to={`/profile/${user.username}`}>
                <div key={user._id} className='avatar bg-purple-500 rounded-lg p-1 flex grid-flow-row space-x-1 items-center mb-2  hover:bg-cyan-600'>
                <div className='w-8 rounded-full relative ml-2 mr-1 '>
                  <img src={user?.profileImg || "/avatar-placeholder.png"} alt="Profile" />                  
                </div>
                <li key={user._id} className="text-sm list-none text-cyan-50 font-semibold">@{user.username}</li>
              </div>
              </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
