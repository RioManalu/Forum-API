const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  version: '1.0.0',
  register: async (server, { contianer }) => {
    const threadsHandler = new ThreadsHandler(contianer);
    server.route(routes(threadsHandler));
  }
}