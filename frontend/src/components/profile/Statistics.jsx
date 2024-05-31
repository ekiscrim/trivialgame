import { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import {Chart,ArcElement} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const Statistics = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsByCategory, setStatsByCategory] = useState({});
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
  <div className="grid col-span-1 mb-4 relative bg-purple-700">
    <h2 className='text-2xl font-extrabold lg:font-semibold m-4 text-center text-cyan-300 bg'>Estadísticas</h2>
  </div> 
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Object.entries(statsByCategory).map(([category, stats]) => (
      <div key={category} className="flex">
        <div className="bg-white shadow-md rounded p-4 text-center flex flex-col flex-grow">
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