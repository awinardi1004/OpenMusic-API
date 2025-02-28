class AlbumsHandler {
    constructor(service, storageService, validator) {
        this._service = service;
        this._storageService = storageService;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
        this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
        this.getLikeAlbumByIdHandler = this.getLikeAlbumByIdHandler.bind(this);
        this.deleteLikeAlbumByIdHandler = this.deleteLikeAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const {name , year } = request.payload;
        const albumId = await this._service.addAlbum({name, year});
        
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

    async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        }
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;
        
        await this._service.editAlbumById(id, request.payload);
        return {
            status: 'success',
                message: 'Album berhasil diperbarui',
            };
        
    }

    async deleteAlbumByIdHandler(request) {
        const {id} = request.params;
        await this._service.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Album berhasil dihapus',
        };
    }

    async postUploadCoverHandler(request, h) {
        const { id } = request.params;
        const { cover } = request.payload;

        this._validator.validateCoverHeaders(cover.hapi.headers);

        const album = await this._service.getAlbumById(id);
        if (!album) {
            return h.response({
                status: 'fail',
                message: 'Album tidak ditemukan',
            }).code(404);
        }

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/covers/${filename}`;

        await this._service.updateAlbumCover(id, fileLocation);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }

    async postLikeAlbumHandler(request, h) {
        const { id: albumId } = request.params;
        const { id: credentialId } =  request.auth.credentials;

        await this._service.addLikeAlbum(credentialId, albumId);

        return h.response({
            status: 'success',
            message: `Berhasil like Album`,
        }).code(201);
    }

    async getLikeAlbumByIdHandler(request) {
        const { id } = request.params;
        const likeAlbum = await this._service.getLikeAlbumById(id);

        return {
            status: 'success',
            data: likeAlbum,
        };
    }

    async deleteLikeAlbumByIdHandler(request) {
        const { id : albumId } = request.params;
        const { id : credentialId } = request.auth.credentials;

        await this._service.deleteLikeAlbum(credentialId, albumId);

        return {
            status: 'success',
            message: 'Album batal disukai',
        }
    }

}

module.exports = AlbumsHandler;