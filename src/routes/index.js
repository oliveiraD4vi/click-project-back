const SuggestionRoutes = require('./suggestion/suggestion');
const VotingRoutes = require('./voting/voting');
const UserRoutes = require('./user/user');

module.exports = (app) => {
  SuggestionRoutes(app);
  VotingRoutes(app);
  UserRoutes(app);
};
