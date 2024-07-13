import { useState, useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { HiCheckCircle, HiMiniQueueList } from 'react-icons/hi2';
import { HiOutlineViewList } from 'react-icons/hi';
import { HiSortDescending } from 'react-icons/hi';
import LoadingSpinner from "../common/LoadingSpinner";
import CreateRoom from "./CreateRoom";
import RoomCard from "./RoomCard";
import Logo from "../common/Logo";
import SuperRoomCard from "./SuperRoomCard";
import toast from 'react-hot-toast';

const fetchUserScore = async (roomId, userId) => {
  const res = await fetch(`/api/scores/${roomId}/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch score for room ${roomId}`);
  return res.json();
};

const AvailableRooms = () => {
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [allRooms, setAllRooms] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('waiting');
  const [simplifyDesign, setSimplifyDesign] = useState(false);

  const saveDesignPreference = (simplifyDesign) => {
    localStorage.setItem('simplifyDesign', JSON.stringify(simplifyDesign));
  };

  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`/api/auth/me`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });

  const userId = user?._id;

  const fetchRooms = async (page) => {
    setLoading(page === 1);
    setIsLoadingMore(page > 1);
    try {
      const res = await fetch(`/api/rooms/list?page=${page}&pageSize=${pageSize}&status=${status}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Algo fue mal");
      setHasMore(data.hasMore);
      return data.rooms;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const { isLoading: isRoomsLoading, error: roomsError, data: listRoomsQuery } = useQuery({
    queryKey: ["listRooms", page, pageSize, status],
    queryFn: () => fetchRooms(page),
    keepPreviousData: true,
  });

  const userScoreQueries = useQueries({
    queries: (allRooms ?? []).map((room) => ({
      queryKey: ["userScore", room._id, userId],
      queryFn: () => fetchUserScore(room._id, userId),
      enabled: !!userId,
    })),
  });

  useEffect(() => {
    if (listRoomsQuery) {
      setAllRooms(prevRooms => (page === 1 ? listRoomsQuery : [...prevRooms, ...listRoomsQuery]));
    }
  }, [listRoomsQuery]);

  useEffect(() => {
    const savedPreference = localStorage.getItem('simplifyDesign');
    if (savedPreference !== null) {
      setSimplifyDesign(JSON.parse(savedPreference));
    }
  }, []);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleLoadMoreClick = () => {
    loadMore();
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
    setAllRooms([]);
  };

  const toggleSimplifyDesign = () => {
    const newSimplifyDesign = !simplifyDesign;
    setSimplifyDesign(newSimplifyDesign);
    saveDesignPreference(newSimplifyDesign);
  };

  const loadAllPages = async (currentPage = 1, accumulatedRooms = []) => {
    try {
      const res = await fetch(`/api/rooms/list?page=${currentPage}&pageSize=${pageSize}&status=${status}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Algo fue mal");
  
      const newRooms = accumulatedRooms.concat(data.rooms);
      if (data.hasMore) {
        return loadAllPages(currentPage + 1, newRooms);
      } else {
        return newRooms;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };


  const sortRoomsWithoutScore = async () => {
    //setLoading(true); // Mostrar un spinner de carga mientras se ejecuta la función
    try {
      const allLoadedRooms = await loadAllPages(); // Cargar todas las páginas de salas
  
      const roomsWithScores = (allLoadedRooms ?? []).map((room, index) => {
        const userScoreQuery = userScoreQueries[index];
        return {
          ...room,
          userScore: userScoreQuery?.data,
          scoreLoading: userScoreQuery?.isLoading,
          closeTime: new Date(room.startTime).getTime() + room.duration, // Calcular closeTime
        };
      });
  
      // Filtrar las salas sin score (donde userScore es undefined, null, o el score es 0)
      const roomsWithoutScore = roomsWithScores
        .filter(room => !room.userScore || !room.userScore.hasScore || room.userScore.score === 0)
        .sort((room1, room2) => room1.closeTime - room2.closeTime);
  
      // Filtrar las salas con score (donde el score es mayor que 0)
      const roomsWithScore = roomsWithScores.filter(room => room.userScore && room.userScore.hasScore && room.userScore.score > 0);
  
      if (roomsWithoutScore.length === 0) {
        toast.success('Todas las salas están hechas');
      }
  
      // Combinar las salas sin score primero y luego las con score
      setAllRooms([...roomsWithoutScore, ...roomsWithScore]);
    } catch (error) {
      toast.error('Error al cargar todas las salas');
    } finally {
      //setLoading(false); // Ocultar el spinner de carga
    }
  };
  
  // En el JSX:
  <div className="flex flex-col items-center justify-center ml-4">
    <button onClick={sortRoomsWithoutScore} className="btn btn-primary">
      <HiSortDescending className=" w-6 h-6" />
    </button>
  </div>
  

  return (
    <>
      {loading || isUserLoading ? (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center -ml-2 mt-2">
              <Logo className='w-12 sm:hidden fill-white mr-2' />
              <div className="flex flex-col items-center justify-center text-center">
                <span className={`text-white text-3xl font-bold sm:hidden`}>VioQUIZ</span>
                <span className={`text-white text-xs font-bold text-end italic sm:hidden`}>Desafía tu mente, <br />conquista lo trivial.</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="ml-4">
                <select onChange={handleStatusChange} value={status} className="select select-bordered">
                  <option value="waiting">Salas abiertas</option>
                  <option value="finished">Salas cerradas</option>
                </select>
              </div>
              <div className="flex flex-col items-center justify-center ml-4">
                <button onClick={sortRoomsWithoutScore} className="btn btn-primary">
                  <HiSortDescending className=" w-6 h-6" />
                  </button>
                </div>
              <div className="ml-4">
                <button onClick={toggleSimplifyDesign} className="btn btn-primary">
                  {simplifyDesign ? (
                    <>
                      <HiMiniQueueList className="w-6 h-6" />
                      <span className="sr-only">Mostrar diseño completo</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineViewList className="w-6 h-6" />
                      <span className="sr-only">Simplificar diseño</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {roomsError || (!allRooms || allRooms.length === 0) ? (
            <div className="mt-6 ml-4 grid sm:grid-flow-row md:grid-flow-row md:grid-cols-2 gap-y-5 content-stretch">
              <div role="alert" className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{roomsError ? roomsError.message : <LoadingSpinner />}</span>
              </div>
            </div>
          ) : (
            <>


              <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-3xl font-bold text-center mb-8 uppercase text-cyan-300 shadow-violet-800 shadow-lg">
                  {status === 'waiting' ? 'Salas abiertas' : 'Salas cerradas'}
                </h1>
                <div className="flex flex-wrap justify-center gap-6 animate-scale-in">
                  {allRooms.map((room, index) => (
                    <div key={index} className="w-80 relative overflow-hidden rounded-lg transition-transform duration-300 transform hover:scale-105">
                      {room.roomType === 'super' 
                      ? 
                      <SuperRoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                      : 
                      <RoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                      }
                    </div>
                  ))}
                </div>
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10 mb-40">
                  <button onClick={handleLoadMoreClick} className="btn btn-primary" disabled={isLoadingMore}>
                    {isLoadingMore ? 'Cargando más...' : 'Cargar más'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AvailableRooms;
