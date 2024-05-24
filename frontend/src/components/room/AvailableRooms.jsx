import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import CreateRoom from "./CreateRoom";
import RoomCard from "./RoomCard";

const AvailableRooms = () => {
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [rooms, setRooms] = useState([]);
  const [hasMore, setHasMore] = useState(true);

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
      const res = await fetch(`api/rooms/list?page=${page}&pageSize=${pageSize}`);
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
    queryKey: ["listRooms", page, pageSize],
    queryFn: () => fetchRooms(page),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (listRoomsQuery) {
      setRooms((prevRooms) => [...prevRooms, ...listRoomsQuery]);
    }
  }, [listRoomsQuery]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleLoadMoreClick = () => {
    loadMore();
  };

  return (
    <>
      {loading || isUserLoading ? (
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : roomsError ? (
        <div className="mt-6 ml-4 grid sm:grid-flow-row md:grid-flow-row md:grid-cols-2 gap-y-5 content-stretch">
          <div role="alert" className="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{roomsError.message}</span>
          </div>
        </div>
      ) : !rooms || rooms.length === 0 ? (
        <p>No hay salas disponibles.</p>
      ) : (
        <div>
          <CreateRoom />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xl:mt-6 ml-2 mr-2">
            {rooms.map((room, index) => (
              <RoomCard key={index} room={room} userId={userId} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button onClick={handleLoadMoreClick} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                Cargar más
              </button>
            </div>
          )}
          {isLoadingMore && (
            <div className="flex justify-center mt-4">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AvailableRooms;
