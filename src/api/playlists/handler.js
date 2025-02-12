class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const {name} = request.payload;
        const PlaylistId = await this._service.addPlaylist({name});
        
        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                PlaylistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler() {
        const playlists = await this._service.getPlaylist();
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }


    async deletePlaylistByIdHandler(request) {
        const {id} = request.params;
        await this._service.deletePlaylistById(id);
        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }
}

module.exports = PlaylistsHandler;