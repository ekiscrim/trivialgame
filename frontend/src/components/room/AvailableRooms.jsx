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
import Tabs from "./Tabs";
import TabContent from "./TabContent";

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
  const [simplifyDesign, setSimplifyDesign] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('waiting'); // Estado para la pestaña activa

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

  const fetchRooms = async (page, status) => {
    setLoading(page === 1);
    setIsLoadingMore(page > 1);
    try {
      const res = await fetch(`/api/rooms/list?page=${page}&pageSize=${pageSize}&status=${status}&userId=${userId}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Algo fue mal");
      
      if (data.rooms.length === 0) {
        setHasMore(false);
        return [];
      }
      
      setHasMore(data.hasMore);
      return data.rooms;
    } catch (error) {
      setHasMore(false);
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
    enabled: hasMore,
  });

  const userScoreQueries = useQueries({
    queries: (allRooms ?? []).map((room) => ({
      queryKey: ["userScore", room._id, userId],
      queryFn: () => fetchUserScore(room._id, userId),
      enabled: !!userId,
    })),
  });

  useEffect(() => {
    const savedPreference = localStorage.getItem('simplifyDesign');
    if (savedPreference !== null) {
      setSimplifyDesign(JSON.parse(savedPreference));
    }
  }, []);

  useEffect(() => {
    if (listRoomsQuery !== undefined) {
      setAllRooms(prevRooms => (page === 1 ? listRoomsQuery : [...prevRooms, ...listRoomsQuery]));
    }
  }, [listRoomsQuery, page]);

  const loadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleLoadMoreClick = () => {
    loadMore();
  };

  const handleStatusChange = (tab) => {
    setStatus(tab);
    setActiveTab(tab);
    setPage(1);
    setAllRooms([]);
    setHasMore(true); // Resetear hasMore al cambiar de pestaña
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
            <div className="flex items-center justify-center -ml-2 mt-2">
              <Logo className='w-12 sm:hidden fill-white mr-2' />
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-white text-3xl font-bold sm:hidden">VioQUIZ</span>
                <span className="text-white text-xs font-bold text-end italic sm:hidden">Desafía tu mente, <br />conquista lo trivial.</span>
              </div>
            </div>
            {/*<div className="mt-4 flex items-center justify-center space-x-4">
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
            </div>*/}
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-center mb-4">
              <div>
                <Tabs activeTab={status} onTabChange={handleStatusChange} />
              </div>
            </div>

            <TabContent
              activeTab={status}
              rooms={allRooms}
              simplifyDesign={simplifyDesign}
              userId={userId}
            />
            {hasMore && (
              <div className="flex justify-center mt-10 mb-40">
                <button onClick={handleLoadMoreClick} className="btn btn-primary" disabled={isLoadingMore}>
                  {isLoadingMore ? 'Cargando más...' : 'Cargar más'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableRooms;