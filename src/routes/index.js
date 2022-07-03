const VotingRoutes = require('./voting/voting');
const UserRoutes = require('./user/user');

module.exports = (app) => {
  VotingRoutes(app);
  UserRoutes(app);
};
