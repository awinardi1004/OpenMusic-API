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

    async postSongHandler (request, h) {
        this._validator.validateSongPayload(request.payload);
        const {title, year, performer, genre, duration, albumId} = request.payload;
        const songId = await this._service.addSong({title, year, performer, genre, duration, albumId});

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        
        response.code(201);
        return response;
    }

    async getSongsHandler(request, h) {
        const songs = await this._service.getSongs();
        
        const { title = '', performer = '' } = request.query;
    
        const filteredSongs = songs.filter(song => {
            const titleMatch = title === '' || song.title.toLowerCase().includes(title.toLowerCase());
            const performerMatch = performer === '' || song.performer.toLowerCase().includes(performer.toLowerCase());
            return titleMatch && performerMatch;
        });
    
        const songsData = filteredSongs.map(song => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
        }));
    
        if (songsData.length === 0) {
            return h.response({
                status: 'success',
                message: 'Tidak ada lagu yang cocok dengan kriteria.',
                data: { songs: [] },
            }).code(200);
        }
    
        return h.response({
            status: 'success',
            message: 'Lagu berhasil ditampilkan',
            data: { songs: songsData },
        }).code(200);
    }
    

    async getSongByIdHandler(request, h) {
        const { id } = request.params;
        const song = await this._service.getSongById(id);

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
    

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;
        
        await this._service.editSongById(id, request.payload);
        return {
            status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
    }

    async deleteSongByIdHandler(request, h) {
        const {id} = request.params;
        await this._service.deleteSongById(id);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}
    
module.exports = SongsHandler;