import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner"; // Asegúrate de tener un componente de carga


const fetchScores = async (roomId) => {
  const response = await fetch(`/api/room/${roomId.id}/results`);
  if (!response.ok) {
    throw new Error('Error fetching results');
  }
  return response.json();
};



const ScoresTable = () => {

  const id = useParams();
  const { data: scores, isLoading, isError } = useQuery({
    queryKey: ["results", id],
    queryFn: () => fetchScores(id),
  });

  if (isLoading) {
    return <LoadingSpinner />; // Componente de carga mientras se obtienen los datos
  }

  if (isError) {
    return <p>Error al cargar los resultados.</p>; // Mensaje de error si la solicitud falla
  }

  if (!scores || scores.length === 0) {
    return <p>No scores available.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Scores</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((scoreEntry, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="border px-4 py-2">{scoreEntry.user.username}</td>
              <td className="border px-4 py-2">{scoreEntry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoresTable;
