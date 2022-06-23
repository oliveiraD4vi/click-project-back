const { DataTypes } = require('sequelize');
const db = require('./db');

const Suggestion = db.define('suggestions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

// Create table
// Suggestion.sync({ alter: true });

module.exports = Suggestion;
