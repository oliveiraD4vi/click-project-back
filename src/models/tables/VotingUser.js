const { DataTypes } = require('sequelize');
const db = require('../db');

const Voting = require('./Voting');
const User = require('./User');

const VotingUser = db.define('uservoting', {
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
  voting_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Voting,
      key: 'id'
    }
  }
});

// Create table
// VotingUser.sync({ alter: true });

module.exports = VotingUser;
