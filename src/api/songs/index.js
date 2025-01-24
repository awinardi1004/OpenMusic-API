const SongsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const notesHandler = new SongsHandler(service);
    server.route(routes(notesHandler));
  },
};