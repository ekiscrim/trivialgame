import UserStatistics from "../models/user.statistic.model.js";

export const getRankings = async(req, res) => {
    const { filter } = req.query;
    const desiredResultsCount = 10; // Número de resultados deseados
    const initialQueryLimit = 15; // Limite inicial mayor que el número de resultados deseados
    try {
        let sortCriteria;
        switch (filter) {
            case 'monthly':
                sortCriteria = { monthlyScore: -1 };
                break;
            case 'weekly':
                sortCriteria = { weeklyScore: -1 };
                break;
            case 'alltime':
            default:
                sortCriteria = { totalScore: -1 };
                break;
        }

        let rankings = [];
        let filteredRankings = [];
        let skip = 0;
        
        // Loop until we have enough valid results
        while (filteredRankings.length < desiredResultsCount) {
            rankings = await UserStatistics.find()
                .populate({
                    path: 'userId',
                    select: 'username profileImg',
                    match: {
                        $and: [
                            { _id: { $ne: null } },
                            {emailConfirmed: true},
                            { $or: [{ deleted: { $exists: false } }, { deleted: false }] }
                        ]
                    }
                })
                .sort(sortCriteria)
                .skip(skip)
                .limit(initialQueryLimit);

            const newFilteredRankings = rankings.filter(ranking => ranking.userId !== null);
            filteredRankings = filteredRankings.concat(newFilteredRankings);
            skip += initialQueryLimit;

            // Break if there are no more results to fetch
            if (rankings.length < initialQueryLimit) {
                break;
            }
        }

        // Ensure we return only the desired number of results
        filteredRankings = filteredRankings.slice(0, desiredResultsCount);

        res.json(filteredRankings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rankings' });
    }
};