import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineLightBulb } from 'react-icons/hi2';
import LoadingSpinner from "../common/LoadingSpinner";
import CreateRoom from "./CreateRoom";
import RoomCard from "./RoomCard";
import Logo from "../common/Logo";
import SuperRoomCard from "./SuperRoomCard";
import { HiOutlineViewList } from "react-icons/hi";

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
    queryFn: () => fetchRooms(page, status),
    keepPreviousData: true,
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

  return (
    <>
      {loading || isUserLoading ? (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center -ml-2">
              <Logo className='w-12 sm:hidden fill-white' />
              <div className="flex flex-col items-center justify-center text-center">
                <span className={`text-white text-3xl font-bold sm:hidden`}>VioQUIZ</span>
                <span className={`text-white text-xs font-bold text-end italic sm:hidden`}>Desafía tu mente, <br />conquista lo trivial.</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <CreateRoom />
              <div className="ml-4">
                <select onChange={handleStatusChange} value={status} className="select select-bordered">
                  <option value="waiting">Salas abiertas</option>
                  <option value="finished">Salas cerradas</option>
                </select>
              </div>
              <div className="ml-4">
                <button onClick={toggleSimplifyDesign} className="btn btn-secondary">
                {simplifyDesign ? (
                  <>
                    <HiOutlineViewList className="w-6 h-6" />
                    <span className="sr-only">Mostrar diseño completo</span>
                  </>
                ) : (
                  <>
                    <HiOutlineLightBulb className="w-6 h-6" />
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
              <div className="flex flex-col items-center justify-center">
                {allRooms.some(room => room.roomType === 'super') && (
                  <h1 className="text-3xl font-bold text-center mb-8 uppercase text-cyan-300 shadow-violet-800 shadow-lg">SALAS BOMBA</h1>
                )}
                <div className="flex flex-wrap justify-center gap-6 animate-scale-in">
                  {allRooms.filter(room => room.roomType === 'super').map((room, index) => (
                    <div key={index} className="w-80 relative overflow-hidden rounded-lg transition-transform duration-300 transform hover:scale-105">
                      <SuperRoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-3xl font-bold text-center mb-8 uppercase text-cyan-300 shadow-violet-800 shadow-lg">
                  {status === 'waiting' ? 'Salas abiertas' : 'Salas cerradas'}
                </h1>
                <div className="flex flex-wrap justify-center gap-6 animate-scale-in">
                  {allRooms.filter(room => room.roomType === 'normal').map((room, index) => (
                    <div key={index} className="w-80 relative overflow-hidden rounded-lg transition-transform duration-300 transform hover:scale-105">
                      <RoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                    </div>
                  ))}
                </div>
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10 mb-40">
                  <button onClick={handleLoadMoreClick} className="btn btn-primary">
                    Cargar más
                  </button>
                </div>
              )}
              {isLoadingMore && (
                <div className="flex justify-center mt-4">
                  <LoadingSpinner />
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
