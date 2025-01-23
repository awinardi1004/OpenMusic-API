const { 
    addMusicHandler,
    getAllMusicHandler,
    getMusicByIdHandler,
    editMusicByIdHandler,
    deleteMusicByIdHandler
 } = require('./handler');

 const routes = [
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
  