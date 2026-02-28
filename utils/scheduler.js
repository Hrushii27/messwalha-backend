const cron = require('node-cron');
const Subscription = require('../models/subscription');
const Listing = require('../models/listing');

const startScheduler = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('🕒 Running daily trial expiry check...');
        try {
            const expiredTrials = await Subscription.findExpiredTrials();

            for (const sub of expiredTrials) {
                // Update subscription status to expired
                await Subscription.updateStatus(sub.id, 'expired');

                // Deactivate all listings for this owner
                await Listing.deactivateByOwnerId(sub.mess_owner_id);

                console.log(`✅ Expired trial for owner ID ${sub.mess_owner_id} and deactivated listings.`);
            }
        } catch (err) {
            console.error('❌ Error in daily trial expiry check:', err);
        }
    });

    console.log('🚀 Daily trial expiry scheduler initialized');
};

module.exports = startScheduler;
