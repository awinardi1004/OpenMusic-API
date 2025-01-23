const { 
    addAlbumsHandler,
    getAllAlbumsHandler,
    getAlbumByIdHandler,
    editAlbumByIdHandler,
    deleteAlbumByIdHandler,
    addMusicHandler,
    getAllMusicHandler,
    getMusicByIdHandler,
    editMusicByIdHandler,
    deleteMusicByIdHandler
 } = require('./handler');

 const routes = [
    // albums routes
    {
      method: 'POST',
      path: '/albums',
      handler: addAlbumsHandler,
    },
    {
      method: 'GET',
      path: '/albums',
      handler: getAllAlbumsHandler,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: getAlbumByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: editAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: deleteAlbumByIdHandler,
    },
    
    // song routes
    {
        method: 'POST',
        path: '/songs',
        handler: addMusicHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: getAllMusicHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: getMusicByIdHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: editMusicByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: deleteMusicByIdHandler,
    },
];
  
module.exports = routes;
  