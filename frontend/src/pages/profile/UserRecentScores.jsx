import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const fetchUserScores = async ({ queryKey }) => {
  const [, userId] = queryKey;
  if (!userId) {
    throw new Error('User ID is undefined');
  }
  const response = await fetch(`/api/scores/user/${userId}/last-scores`);
  if (!response.ok) {
    // Verificamos el status 404 específicamente
    if (response.status === 404) {
      throw new Error('Room With ID null not found');
    } else {
      throw new Error('Error fetching user scores');
    }
  }
  return response.json();
};

const UserRecentScores = ({ userId }) => {
  const { data: scores, isLoading, error } = useQuery({
    queryKey: ['userScores', userId],
    queryFn: fetchUserScores,
    enabled: !!userId, // Solo habilitamos la consulta si userId está definido
    retry: false, // Deshabilitamos el reintento automático en caso de error
  });

  // Manejo del error cuando el usuario no ha participado en ninguna sala
  if (error && error.message === 'Room With ID null not found') {
    return null; // No mostramos nada si el error específico ocurre
  }

  if (!userId) return <LoadingSpinner />;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  if (!scores || scores.length === 0) {
    return <p>No hay resultados disponibles.</p>; // Mensaje cuando no hay resultados
  }

  return (
    <div className="overflow-x-auto max-w-full bg-white rounded-lg px-1 py-2 mb-10 xl:w-[920px]">
      <h2 className='text-2xl font-extrabold lg:font-semibold text-center text-purple-500 mb-4 uppercase'>RESULTADOS RECIENTES</h2>
      <table className="table-auto w-full text-center border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3">Sala</th>
            <th className="py-3">Puntos</th>
            <th className="py-3">Tipo</th>
            <th className="py-3">Posición</th>
            <th className="py-3">Fecha</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {scores.map((score, index) => (
            <tr
              key={score.room._id || index}
              className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-purple-300 cursor-pointer transition-colors duration-200`}
              onClick={() => window.location.href=`/rooms/${score.room._id}`}
            >
              <td className="px-2 py-4">{score.room.roomName}</td>
              <td className="px-6 py-4"><strong>{score.score.score}</strong></td>
              <td className="px-6 py-4">{score.room.roomType === "super" ? "Bomba" : "Normal"}</td>
              <td className="px-6 py-4"><strong>{score.userPosition}</strong></td>
              <td className="px-6 py-4">{new Date(score.room.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRecentScores;
