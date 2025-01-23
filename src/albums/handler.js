const { nanoid } = require('nanoid');
const albums = require('./albums');


const addAlbumsHandler = (request, h) => {
    const {name , year } = request.payload;

    const id = "album-" + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newAlbum = {
        id, name, year, createdAt, updatedAt,
    };

    albums.push(newAlbum);

    const isSuccess = albums.filter((album) => album.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Menambahkan Album',
          data: {
            albumId: id,
          },
        });
        response.code(201);
        return response;
      }
    
      const response = h.response({
        status: 'fail',
        message: 'Album gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const getAllAlbumsHandler = () => ({
  status: 'success',
  data: {
    albums,
  },
});

const getAlbumByIdHandler = (request, h) => {
  const { id } = request.params;
  const album = albums.filter((a) => a.id === id)[0];

  if (album !== undefined) {
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'album tidak ditemukan',
  });
  response.code(404);
  return response;
}

const editAlbumByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = albums.findIndex((album) => album.id === id);

  if (index !== -1) {
    albums[index] = {
      ...albums[index],
      name,
      year,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui album. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteAlbumByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = albums.findIndex((album) => album.id === id);

  if (index !== -1) {
    albums.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Album gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
    addAlbumsHandler,
    getAllAlbumsHandler,
    getAlbumByIdHandler,
    editAlbumByIdHandler,
    deleteAlbumByIdHandler
}