const { nanoid } = require('nanoid');
const musics = require('./musics');

const addMusicHandler = (request, h) => {
  const {title='untitled', year, genre, performer, duration, albumId} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newMusic = {
        id, title, year, performer, genre, duration, albumId, createdAt, updatedAt,
    };

    musics.push(newMusic);

    const isSuccess = musics.filter((music) => music.id === id).length > 0;

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

const getAllMusicHandler = () => ({
  status: 'success',
  data: {
    musics,
  },
});

const getMusicByIdHandler = (request, h) => {
  const { id } = request.params;
  const music = musics.filter((m) => m.id === id)[0];

  if (music !== undefined) {
    return {
      status: 'success',
      data: {
        music,
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

const editMusicByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, year, genre, performer, duration, albumId } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = musics.findIndex((music) => music.id === id);

  if (index !== -1) {
    albums[index] = {
      ...albums[index],
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

const deleteMusicByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = musics.findIndex((music) => music.id === id);

  if (index !== -1) {
    musics.splice(index, 1);
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
  addMusicHandler,
  getAllMusicHandler,
  getMusicByIdHandler,
  editMusicByIdHandler,
  deleteMusicByIdHandler
};