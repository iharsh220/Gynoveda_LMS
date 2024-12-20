import sequelize from '../config/database.js';
import Lead from './Lead.js';

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ alter: true }); // Updates schema if necessary
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

export { sequelize, connectDB, Lead };
