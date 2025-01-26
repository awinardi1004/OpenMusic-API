const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const {name , year } = request.payload;
        const albumId = this._service.addAlbum({name, year});
        
        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    getAlbumsHandler() {
        const albums = this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    getAlbumByIdHandler(request, h) {
        const { id } = request.params;
        const album = this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        }
    }

    putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;
        this._service.editAlbumById(id, request.payload);
        return {
            status: 'success',
                message: 'Album berhasil diperbarui',
            };
        
    }

    deleteAlbumByIdHandler(request, h) {
        const {id} = request.params;
        this._service.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Catatan berhasil dihapus',
        };
    }
}

module.exports = AlbumsHandler;