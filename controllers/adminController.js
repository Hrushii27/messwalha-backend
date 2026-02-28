const db = require('../config/db');

const adminController = {
    getStats: async (req, res) => {
        try {
            const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM mess_owners) as total_owners,
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'trial') as trial_subscriptions,
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'expired') as expired_subscriptions,
          (SELECT COALESCE(SUM(599), 0) FROM subscriptions WHERE status = 'active' AND plan_type = 'basic_599') as mrr
        ;
      `;
            const result = await db.query(statsQuery);
            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching admin stats' });
        }
    }
};

module.exports = adminController;
