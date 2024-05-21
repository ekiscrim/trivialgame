import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import CreateRoom from "./CreateRoom";

const AvailableRooms = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [rooms, setRooms] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { isLoading: isRoomsLoading, error: roomsError, data: listRoomsQuery } = useQuery({
    queryKey: ["listRooms", page, pageSize],
    queryFn: async () => {
      try {
        setLoading(true);
        const res = await fetch(`api/rooms/list?page=${page}&pageSize=${pageSize}`);
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Algo fue mal");
        setHasMore(data.hasMore);
        return data.rooms;
      } catch (error) {
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    },
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
      <CreateRoom />

      {loading || isRoomsLoading ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 ml-5">
            {rooms.map((room, index) => (
              <div key={index} className="bg-white shadow-md rounded-md p-6">
                <h2 className="text-xl font-semibold mb-2">{room.roomName}</h2>
                <p className="text-gray-600 mb-2">{`Máximo de Usuarios: ${room.maxUsers}`}</p>
                <p className="text-gray-600 mb-4">{`Descripción: ${room.description}`}</p>
                <Link to={`rooms/${room._id}`}>
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Unirse</button>
                </Link>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button onClick={handleLoadMoreClick} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                Cargar más
              </button>
            </div>
          )}
          {isRoomsLoading && (
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
