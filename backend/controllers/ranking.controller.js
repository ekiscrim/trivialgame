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

        const rankings = await UserStatistics.find()
        .populate({
          path: 'userId',
          select: 'username profileImg',
          match: { $or: [{ deleted: { $exists: false } }, { deleted: false }] } // Selecciona usuarios no eliminados o usuarios sin el campo 'deleted'
        })
        .sort(sortCriteria)
        .limit(10);

        res.json(rankings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rankings' });
    }
};