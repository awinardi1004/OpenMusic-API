const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor ( service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    postSongHandler (request, h) {
        this._validator.validateSongPayload(request.payload);
        const {title, year, genre, performer, duration, albumId} = request.payload;
        const songId = this._service.addSong({title, year, genre, performer, duration, albumId});

        const response = h.response({
            status: 'success',
            message: 'Music berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    getSongsHandler () {
        const songs = this._service.getSongs();
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
    }

    getSongByIdHandler(request, h) {
        const { id } = request.params;
        const song = this._service.getSongById(id);

        const songData = {
            id: song.id,
            title: song.title,
            year: song.year,
            performer: song.performer,
            genre: song.genre,
            duration: song.duration,
            albumId: song.albumId,
        };

        return {
            status: 'success',
            data: {
                song: songData,
            },
        };
    }
    

    putSongByIdHandler (request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;
        this._service.editSongById(id, request.payload);
        return {
            status: 'success',
                message: 'Music berhasil diperbarui',
            };
    }

    deleteSongByIdHandler(request, h) {
        const {id} = request.params;
        this._service.deleteSongById(id);
        return {
            status: 'success',
            message: 'Music berhasil dihapus',
        };
    }
}
    
module.exports = SongsHandler;