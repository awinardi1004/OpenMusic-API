const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongHandler,
        options: {
          auth: 'playlists_jwt',
        },
      },
      {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongsHandler,
        options: {
          auth: 'playlists_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongHandler,
        options: {
          auth: 'playlists_jwt',
        },
      },
];

module.exports = routes;