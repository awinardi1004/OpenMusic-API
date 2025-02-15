class PlaylistSongsHandler {
    constructor(playlistsSongsService, playlistsService, validator) {
        this._playlistsSongsService = playlistsSongsService;
        this._playlistsService = playlistsService;
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

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        await this._playlistsSongsService.addPlaylistSong(playlistId, songId, userId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu ke playlist',
        });
        response.code(201);
        return response;
    }

    async getPlaylistSongsHandler(request) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        const playlist = await this._playlistsSongsService.getPlaylistSongs(playlistId);

        return {
            status: 'success',
            data: {
                playlistId,
                songs: playlist.songs,
            },
        };
    }

    async deletePlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: userId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        await this._playlistsSongsService.deletePlaylistSong(playlistId, songId, userId);

        return h.response({
            status: 'success',
            message: 'Berhasil menghapus lagu dari playlist',
        }).code(200);
    }
}

module.exports = PlaylistSongsHandler;
