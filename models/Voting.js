const { DataTypes } = require('sequelize');
const db = require('./db');

const Voting = db.define('voting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  current: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

// Create table
// Voting.sync({ alter: true });

module.exports = Voting;
