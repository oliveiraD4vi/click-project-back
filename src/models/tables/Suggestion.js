const { DataTypes } = require('sequelize');
const db = require('../db');

const User = require('./User');

const Suggestion = db.define('suggestions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  suggestion: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Create table
// Suggestion.sync({ alter: true });

module.exports = Suggestion;
