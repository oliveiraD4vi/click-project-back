const { DataTypes } = require('sequelize');
const db = require('../db');

const Voting = db.define('voting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  current: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  cancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  result: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Create table
// Voting.sync({ alter: true });

module.exports = Voting;
