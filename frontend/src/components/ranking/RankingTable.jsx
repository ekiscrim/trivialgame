import { Link } from 'react-router-dom';

const RankingTable = ({ rankings, filter, currentUser }) => {
  // Función para obtener el puntaje basado en el filtro
  const getScore = (user) => {
    if (filter === 'alltime') {
      return user.totalScore || '0';
    } else if (filter === 'monthly') {
      return user.monthlyScore || '0';
    } else {
      return user.weeklyScore || '0';
    }
  };

  return (
    <div className='animate-scale-in'>
      <h2 className="text-white text-3xl font-bold mb-4">Clasificación</h2>
      <div className="grid grid-cols-3 gap-4 text-center text-white mb-8">
        {rankings.slice(0, 3).map((user, index) => (
          <Link key={user?.userId?._id || 'Unknown'} to={`/profile/${user?.userId?.username || 'Unknown'}`}>
            <div className="bg-white text-black p-4 rounded-lg shadow-md hover:bg-purple-300">
              <img className="w-20 h-20 rounded-full mx-auto" src={user?.userId?.profileImg || '/avatar-placeholder.png'} alt="Profile" />
              <h3 className="text-xl font-semibold mt-2 xl:max-w-full truncate">{user?.userId?.username || 'Unknown'}</h3>
              <p className="text-2xl font-bold">{getScore(user)}</p>
              {index === 0 && <p className="text-yellow-500 text-4xl">🥇</p>}
              {index === 1 && <p className="text-gray-500 text-4xl">🥈</p>}
              {index === 2 && <p className="text-orange-500 text-4xl">🥉</p>}
            </div>
          </Link>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Usuario</th>
              <th className="px-6 py-3">Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {rankings.slice(3).map((user, index) => (
              <tr key={user?.userId?._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} ${currentUser._id === user?.userId?._id ? 'bg-purple-300' : ''} hover:bg-purple-300 transition-colors duration-200`}>
                <td className="px-6 py-4 text-2xl">{index + 4}</td>
                <td className="px-4 py-4">
                  <Link to={`/profile/${user?.userId?.username}`}>
                    <div className="flex items-center justify-start">
                      <img className="w-12 h-12 rounded-full mr-4" src={user?.userId?.profileImg || '/avatar-placeholder.png'} alt="Profile" />
                      <span className="text-lg font-semibold max-w-xs truncate">{user?.userId?.username}</span>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-lg font-semibold">
                  {getScore(user)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
