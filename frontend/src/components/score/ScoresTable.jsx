const ScoresTable = ({ scores }) => {
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
