import { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import {Chart,ArcElement} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const Statistics = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsByCategory, setStatsByCategory] = useState({});
  const [rankingUser, setRankingUser] = useState({});
  Chart.register(ArcElement)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch(`/api/statistic/${userId}/statsByCategory`);
        if (!res.ok) {
          throw new Error('Failed to fetch user stats');
        }
        const data = await res.json();
        setIsLoading(false);
        setStatsByCategory(data.statsByCategory);
        setRankingUser(data.user);
      } catch (error) {
        setIsLoading(false);
        setStatsByCategory(false);
      }
    };
    fetchUserStats();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (!statsByCategory) {
    return <p>No tienes estadísticas disponibles</p>;
  }

  return (

<div>
<div className="grid col-span-1 mb-4 relative">
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h2 className='text-2xl font-extrabold lg:font-semibold text-center text-purple-500 mb-4'>Estadísticas</h2>
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full">
        <p className="text-lg font-semibold">Puntuación total:</p>
        <p className="text-lg">{rankingUser.totalScore}</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="text-lg font-semibold">Puntuación este mes:</p>
        <p className="text-lg">{rankingUser.monthlyScore}</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="text-lg font-semibold">Puntuación de esta semana:</p>
        <p className="text-lg">{rankingUser.weeklyScore}</p>
      </div>
    </div>
  </div>
</div>
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
    {Object.entries(statsByCategory).map(([category, stats]) => (
      <div key={category} className="flex">
        <div className="bg-white shadow-xl rounded p-4 text-center flex flex-col flex-grow">
          <h3><strong>{category}</strong></h3>
          <p>Totales: <strong>{stats.total}</strong></p>
          <p>Correctas: <strong>{stats.correct}</strong></p>
          <div className="flex-grow flex items-center justify-center">
            <div className="h-32 sm:h-24 lg:h-20 xl:h-24">
              <Doughnut
                data={{
                  labels: ['Correct', 'Incorrect'],
                  datasets: [{
                    data: [stats.correct, stats.total - stats.correct],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                  }]
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


  );
};

export default Statistics;