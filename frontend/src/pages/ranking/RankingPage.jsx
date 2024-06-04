import { useState, useEffect } from 'react';
import FilterSelector from '../../components/ranking/FilterSelector';
import RankingTable from '../../components/ranking/RankingTable';

const RankingsPage = () => {
    const [filter, setFilter] = useState('alltime');
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await fetch(`/api/rankings?filter=${filter}`);
                const data = await res.json();
                setRankings(data);
            } catch (error) {
                console.error('Failed to fetch rankings:', error);
            }
        };

        fetchRankings();
    }, [filter]);

    return (
        <div className="container mx-auto my-8 h-full">
            <h1 className="text-3xl font-bold text-center mb-4 text-cyan-300 uppercase">Rankings</h1>
            <FilterSelector selectedFilter={filter} onSelectFilter={setFilter} />
            <RankingTable rankings={rankings} filter={filter} />
        </div>
    );
};

export default RankingsPage;
