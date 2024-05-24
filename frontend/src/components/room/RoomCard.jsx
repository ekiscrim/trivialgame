import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { UserIcon } from '@heroicons/react/solid';
import SkeletonCard from "../common/SkeletonCard";

const fetchUserScore = async (roomId, userId) => {
    const res = await fetch(`/api/scores/${roomId}/${userId}`);
    if (!res.ok) throw new Error(`Failed to fetch score for room ${roomId}`);
    return res.json();
};

const fetchCategories = async (roomId) => {
    const res = await fetch(`/api/rooms/${roomId}/categories`);
    if (!res.ok) throw new Error(`Failed to fetch categories for room ${roomId}`);
    const data = await res.json();
    return data.categories || [];
};

const RoomCard = ({ room, userId }) => {
    const { data: userScore, isLoading: isScoreLoading, error: scoreError } = useQuery({
      queryKey: ["userScore", room._id, userId],
      queryFn: () => fetchUserScore(room._id, userId),
      enabled: !!userId,
    });

    const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
      queryKey: ["categories", room._id],
      queryFn: () => fetchCategories(room._id),
    });

    if (isScoreLoading || isCategoriesLoading) return <SkeletonCard />;
    if (scoreError) return <p>Error al cargar los datos de puntuación.</p>;
    if (categoriesError) return <p>Error al cargar las categorías.</p>;

    return (
      <div className="card w-96 bg-base-100 shadow-xl" style={{ maxWidth: "100%" }}>
        <figure><img className="hue-rotate-90" src="https://static.vecteezy.com/system/resources/previews/006/691/884/non_2x/blue-question-mark-background-with-text-space-quiz-symbol-vector.jpg" alt="Questions" /></figure>
        <div className="card-body">
          <h2 className="card-title">
            {room.roomName}
            {userScore?.hasScore && (
              <div className="badge badge-success bg-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="ml-2 w-6 h-6 text-white-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </h2>
          <div className="flex items-center mb-2">
            <UserIcon className="w-5 h-5 mr-1 text-gray-500" /> <span className="mr-2">Máximo de Usuarios:</span> {room.maxUsers}
          </div>
          <div className="mb-2">
            {categories.map((category, index) => (
              <div key={index} className="badge badge-ghost mr-2 mb-2">{category}</div>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="card-actions">
              {userScore?.hasScore && (
                <Link to={`rooms/${room._id}`}>
                  <button className="btn btn-primary">Ver resultados</button>
                </Link>
              )}
              {!userScore?.hasScore && (
                <Link to={`rooms/${room._id}`}>
                  <button className="btn btn-primary">Unirse</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default RoomCard;
