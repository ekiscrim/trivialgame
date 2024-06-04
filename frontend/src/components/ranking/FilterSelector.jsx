const FilterSelector = ({ selectedFilter, onSelectFilter }) => {
    return (
<div className="flex justify-center my-4 space-x-4">
            <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'alltime' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('alltime')}
            >
                Global
            </button>
            <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('monthly')}
            >
                Mensual
            </button>
            <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => onSelectFilter('weekly')}
            >
                Semanal
            </button>
        </div>
    );
};

export default FilterSelector;