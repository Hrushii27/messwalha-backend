const db = require('../config/db');

const Listing = {
    create: async (ownerId, name, location, price, description) => {
        const result = await db.query(
            'INSERT INTO mess_listings (mess_owner_id, name, location, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ownerId, name, location, price, description]
        );
        return result.rows[0];
    },

    findByOwnerId: async (ownerId) => {
        const result = await db.query('SELECT * FROM mess_listings WHERE mess_owner_id = $1', [ownerId]);
        return result.rows;
    },

    update: async (id, ownerId, data) => {
        const { name, location, price, description, is_active } = data;
        const result = await db.query(
            'UPDATE mess_listings SET name = $1, location = $2, price = $3, description = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND mess_owner_id = $7 RETURNING *',
            [name, location, price, description, is_active, id, ownerId]
        );
        return result.rows[0];
    },

    delete: async (id, ownerId) => {
        const result = await db.query('DELETE FROM mess_listings WHERE id = $1 AND mess_owner_id = $2 RETURNING id', [id, ownerId]);
        return result.rows[0];
    },

    deactivateByOwnerId: async (ownerId) => {
        await db.query('UPDATE mess_listings SET is_active = FALSE WHERE mess_owner_id = $1', [ownerId]);
    }
};

module.exports = Listing;
