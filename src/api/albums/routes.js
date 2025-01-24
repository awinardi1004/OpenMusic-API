const routes = () => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.posyAlbumHandler,
      },
      {
        method: 'GET',
        path: '/albums',
        handler: handler.getAlbumsHandler,
      },
      {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler,
      },
      {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumByIdHandler,
      },
      {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler,
      },
];

module.exports = routes;