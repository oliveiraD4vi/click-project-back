const { DataTypes } = require('sequelize');
const db = require('../db');

const Voting = require('./Voting');
const User = require('./User');

const UserVoting = db.define('uservoting', {
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
// UserVoting.sync();

module.exports = UserVoting;
