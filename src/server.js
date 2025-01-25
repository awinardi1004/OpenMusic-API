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

  // Global error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response.isBoom) {
      const { statusCode, message } = response.output.payload;

      // 400 Bad Request
      if (statusCode === 400) {
        return h.response({
          status: 'fail',
          message: message || 'Bad Request',
        }).code(400);
      }

      // 404 Not Found
      if (statusCode === 404) {
        return h.response({
          status: 'fail',
          message: message || 'Resource not found',
        }).code(404);
      }

      // 500 Internal Server Error
      return h.response({
        status: 'error',
        message: 'Internal Server Error',
      }).code(500);
    }

    return h.continue;
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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
