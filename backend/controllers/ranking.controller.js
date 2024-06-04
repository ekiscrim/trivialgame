import UserStatistics from "../models/user.statistic.model.js";

export const getRankings = async(req, res) => {
    const { filter } = req.query;
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

        const rankings = await UserStatistics.find().sort(sortCriteria).limit(10).populate('userId', 'username profileImg');

        res.json(rankings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rankings' });
    }
};