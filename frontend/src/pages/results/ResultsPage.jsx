import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Importa useQuery

const ResultsPage = () => {
  const { roomId } = useParams();
  // Utiliza useQuery para manejar la solicitud de resultados
  const { data: scores, isLoading, isError } = useQuery({
    queryKey: ['results', roomId],
    queryFn: async () => {
      const response = await fetch(`/api/room/${roomId}/results`);
      if (!response.ok) {
        throw new Error('Error fetching results');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  if (isError) {
    return <div>Error al cargar los resultados</div>; // Muestra un mensaje de error si la solicitud falla
  }

  return (
    <div className="min-h-screen w-screen mt-0 flex justify-center items-center">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Results</h2>
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
    </div>
  );
};

export default ResultsPage;
