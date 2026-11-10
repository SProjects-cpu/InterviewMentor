/**
 * GraphQL Schema Export
 * Combines type definitions and resolvers
 */

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = {
  typeDefs,
  resolvers
};
