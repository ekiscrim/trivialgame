import { Link } from 'react-router-dom';

const RankingTable = ({ rankings, filter }) => {
    return (
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
                    {rankings.map((user, index) => (
                        <tr key={user.userId._id} className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-200' : index % 2 === 0 ? 'bg-yellow-700' : 'bg-white'} hover:bg-purple-300 transition-colors duration-200`}>
                            <td className="px-6 py-4 text-2xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </td>
                            <td className="px-4 py-4">
                                <Link to={`/profile/${user.userId.username}`}>
                                    <div className="flex items-center">
                                        <img className="w-16 h-16 rounded-full mr-4" src={user.userId.profileImg || '/avatar-placeholder.png'} alt="Profile" />
                                        <span className="text-lg font-semibold">{user.userId.username}</span>
                                    </div>
                                </Link>
                            </td>
                            <td className="px-4 py-4 text-lg font-semibold">
                                {filter === 'alltime'
                                    ? user.totalScore
                                    : filter === 'monthly'
                                    ? user.monthlyScore
                                    : user.weeklyScore}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingTable;
