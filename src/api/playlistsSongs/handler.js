class PlaylistSongsHandler {
    constructor(PlaylistsSongsService, PlaylistsService, validator) {
        this._PlaylistsSongsService = PlaylistsSongsService;
        this._PlaylistsService = PlaylistsService;
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    }

    async postPlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: userId } = request.auth.credentials;

        await this._PlaylistsService.verifyPlaylistOwner(playlistId, userId);

        const playlistsongId = await this._PlaylistsSongsService.addPlaylistSong(playlistId, songId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu ke playlist',
            data: {
                playlistsongId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistSongsHandler(request) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._PlaylistsService.verifyPlaylistOwner(playlistId, userId);

        const playlist = await this._PlaylistsSongsService.getPlaylistSongs(playlistId);

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async deletePlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: userId } = request.auth.credentials;

        await this._PlaylistsService.verifyPlaylistOwner(playlistId, userId);

        await this._PlaylistsSongsService.deletePlaylistSong(playlistId, songId);

        return h.response({
            status: 'success',
            message: 'Berhasil menghapus lagu dari playlist',
        }).code(200);
    }
}

module.exports = PlaylistSongsHandler;
