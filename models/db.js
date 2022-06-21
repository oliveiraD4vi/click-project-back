const { Sequelize } = require('sequelize');

require('dotenv/config');

const sequelize = new Sequelize(
  process.env.PG_DBNM,
  process.env.PG_USER,
  process.env.PG_PSWD,
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
  }
);

module.exports = sequelize;
