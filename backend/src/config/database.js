const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD), // 🔥 FORCE STRING
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',

    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // 🔥 IMPORTANT FOR SUPABASE
      }
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    console.log("🔐 DB CONFIG:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      db: process.env.DB_NAME,
      password: typeof process.env.DB_PASSWORD // DEBUG
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };