const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const SongsService = require('./services/inMemory/SongsService');
const AlbumsService = require('./services/inMemory/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'], 
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: { 
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: { 
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  // Error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    // Handle validation errors (status code 400)
    if (response.isBoom && response.output.statusCode === 400) {
      return h.response({
        status: 'fail',
        message: response.message || 'Invalid request payload',
      }).code(400);
    }

    // Handle not found errors (status code 404)
    if (response.isBoom && response.output.statusCode === 404) {
      return h.response({
        status: 'fail',
        message: response.message || 'Resource not found',
      }).code(404);
    }

    // Handle server errors (status code 500)
    if (response.isBoom && response.output.statusCode === 500) {
      return h.response({
        status: 'error',
        message: 'An internal server error occurred',
      }).code(500);
    }

    // If response is not an error, continue with the original response
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
