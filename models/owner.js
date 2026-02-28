const db = require('../config/db');

const Owner = {
    create: async (name, email, phone, passwordHash) => {
        const result = await db.query(
            'INSERT INTO mess_owners (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, created_at',
            [name, email, phone, passwordHash]
        );
        return result.rows[0];
    },

    findByEmail: async (email) => {
        const result = await db.query('SELECT * FROM mess_owners WHERE email = $1', [email]);
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await db.query('SELECT id, name, email, phone, created_at FROM mess_owners WHERE id = $1', [id]);
        return result.rows[0];
    }
};

module.exports = Owner;
