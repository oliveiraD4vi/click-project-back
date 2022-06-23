const { DataTypes } = require('sequelize');
const db = require('../db');

const Voting = require('./Voting');

const VotingFilm = db.define('votingfilms', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  film_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  voting_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Voting,
      key: 'id'
    }
  },
  votes: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});

// Create table
// VotingFilm.sync({ alter: true });

module.exports = VotingFilm;
