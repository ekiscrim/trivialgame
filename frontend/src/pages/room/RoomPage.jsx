import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScoresTable from '../../components/score/ScoresTable';
import SkeletonCard from "../../components/common/SkeletonCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import ShareComponent from "../../components/room/ShareComponent";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

const RoomPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { data: userId } = useQuery({ queryKey: ["authUser"] });

  const navigate = useNavigate();
  const urlDeLaSala = String(window.location);


  
  const { data: roomData, isLoading, error } = useQuery({
    queryKey: ["roomData", id],
    queryFn: async () => {
      if (!id) throw new Error('Room ID is undefined');
      const res = await fetch(`/api/rooms/${id}`);
      if (!res.ok) throw new Error('Error fetching room data');
      return res.json();
    },
  });

  const { data: creatorData, isLoading: isCreatorLoading, error: creatorError } = useQuery({
    queryKey: ["roomCreator", id],
    queryFn: () => fetchRoomCreator(id),
  });


  const fetchRoomCreator = async (roomId) => {
    const response = await fetch(`/api/rooms/${roomId}/creator`);
    if (!response.ok) throw new Error('Failed to fetch room creator');
    return response.json();
  };
  

  const fetchCategories = async (roomId) => {
    const res = await fetch(`/api/rooms/${roomId}/categories`);
    if (!res.ok) throw new Error(`Failed to fetch categories for room ${roomId}`);
    const data = await res.json();
    return data.categories || [];
  };

  const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategories(id),
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

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!roomData || !roomData.room) {
          return;
        }
        const response = await fetch(`/api/participant/${roomData.room._id}/${userId._id}`);
        if (!response.ok) {
          throw new Error("Error fetching progress");
        }
        const data = await response.json();
        setProgress(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress", error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [roomData, userId]);

  const handleUpdateProgress = (newProgressData) => {
    setProgress(newProgressData);
  };



  if (!roomData || !roomData.room || !roomData.users || !userScoreData || isLoadingScore || loading) {
    return <LoadingSpinner />
  }


  return (
<div className="min-w-full h-full mb-20">
  <div className="bg-purple-700 pb-4 rounded-lg">
    <h1 className="text-2xl font-bold my-4 text-cyan-300 text-center pt-16">
      Sala: {roomData && roomData.room ? roomData.room.roomName : <LoadingSpinner />}
    </h1>
    <div className="flex items-center justify-center -mt-5">
    <span className=" font-self my-4 text-cyan-300">
      Creada por: {creatorData ? (
        <Link to={`/profile/${creatorData.creatorUsername}`} className="text-cyan-300 hover:text-cyan-400">
          {creatorData.creatorUsername}
        </Link>
      ) : (
        <LoadingSpinner />
      )}
    </span>
    <div className='avatar ml-2'>
    <div className='w-8 h-8 rounded-full'>
      <img src={creatorData ? creatorData.profileImg || '/avatar-placeholder.png' : <LoadingSpinner />} alt="Avatar de Usuario" />
    </div>
    </div>
  </div>
      <div className="flex flex-wrap justify-center gap-2 px-4">
      {categories && categories.map((category, index) => (
        <div key={index} className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full px-3 py-1 text-sm text-white">{category}</div>
      ))}
    </div>
  </div>

      {isLoading && <LoadingSpinner />}
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
                        <ShareComponent score={userScoreData.score.score} roomUrl={urlDeLaSala} progress={progress} />
                    </div>

                )}

                </>
              )}
      </div>

      <ScoresTable currentUser={userId._id} onUpdateProgress={handleUpdateProgress} />
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
