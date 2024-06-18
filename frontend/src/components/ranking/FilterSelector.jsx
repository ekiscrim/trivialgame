const FilterSelector = ({ selectedFilter, onSelectFilter }) => {
    return (
<div className="flex justify-center my-4 space-x-4">
            <button
                className={`px-4 py-2 rounded-lg transition-colors btn-primary ${
                    selectedFilter === 'weekly' ? 'bg-purple-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('weekly')}
            >
                Semanal
            </button>
            <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'monthly' ? 'bg-purple-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('monthly')}
            >
                Mensual
            </button>
            <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'alltime' ? 'bg-purple-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('alltime')}
            >
                Global
            </button>
        </div>
    );
};

export default FilterSelector;