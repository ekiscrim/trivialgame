import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const fetchScores = async (roomId) => {
  const id = roomId.id || roomId.roomId;
  const response = await fetch(`/api/room/${id}/results`);
  if (!response.ok) {
    throw new Error('Error fetching results');
  }
  return response.json();
};

const ScoresTable = ({ currentUser }) => {

  const id = useParams();
  const { data: scores, isLoading, isError } = useQuery({
    queryKey: ["results", id],
    queryFn: () => fetchScores(id),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <p>Error al cargar los resultados.</p>;
  }

  if (!scores || scores.length === 0) {
    return <p className="text-cyan-300">No hay puntuaciones registradas</p>;
  }

  // Encuentra la entrada del usuario actual
  const currentUserScoreEntry = scores.find(scoreEntry => scoreEntry.user._id === currentUser._id);

  return (
    <div className="w-screen mt-0 flex justify-center">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Resultados</h2>
        <div className="stats bg-primary text-primary-content flex justify-center items-center rounded-lg shadow-md">
          <div className="stat">
            <div className="stat-title">Puntuación</div>
            <div className="stat-value text-4xl font-bold text-center">{currentUserScoreEntry ? currentUserScoreEntry.score : 'N/A'}</div>
            <div className="stat-actions"></div>
          </div>
        </div>
        <table className="table-auto w-full mb-9">
          <thead>
            <tr>
              <th className="px-0 py-0"></th>
              <th className="px-4 py-2 text-cyan-300">Usuario</th>
              <th className="px-4 py-2 text-cyan-300">Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((scoreEntry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={"/avatar-placeholder.png"} alt="Profile" />
                    </div>
                  </div>
                </td>
                <td className="border px-4 py-2 text-center text-lg">{scoreEntry.user.username}</td>
                <td className="border px-4 py-2 text-center text-lg">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {scoreEntry.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoresTable;
