const { nanoid } = require('nanoid');
const songs = require('./songs');

const addSongHandler = (request, h) => {
  const {title='untitled', year, genre, performer, duration, albumId} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newSong = {
        id, title, year, performer, genre, duration, albumId, createdAt, updatedAt,
    };

    songs.push(newSong);

    const isSuccess = songs.filter((music) => music.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Menambahkan Music',
          data: {
            songId: id,
          },
        });
        response.code(201);
        return response;
      }
    
      const response = h.response({
        status: 'fail',
        message: 'Music gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const getAllSongsHandler = () => {
  const songsData = songs.map(songs => ({
    id: songs.id,
    title: songs.title,
    performer: songs.performer,
  }));

  return {
    status: 'success',
    data: {
      songs: songsData,
    },
  };
};

const getSongByIdHandler = (request, h) => {
  const { id } = request.params;
  const song = songs.filter((m) => m.id === id)[0];
  const songData = song.map(song => ({
    id: song.id,
    title: song.title,
    year: song.year,
    performer: song.performer,
    genre: song.genre,
    duration: song.duration,
    albumId: song.albumId
  }));


  if (song !== undefined) {
    return {
      status: 'success',
      data: {
        song : songData
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'music tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editSongByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, year, genre, performer, duration, albumId } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = songs.findIndex((song) => song.id === id);

  if (index !== -1) {
    songs[index] = {
      ...songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Music berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Music memperbarui album. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteSongByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = songs.findIndex((song) => song.id === id);

  if (index !== -1) {
    songs.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'music berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Music gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addSongHandler,
  getAllSongsHandler,
  getSongByIdHandler,
  editSongByIdHandler,
  deleteSongByIdHandler
};