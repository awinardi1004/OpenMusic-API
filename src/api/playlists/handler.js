class PlaylistsHandler {
    constructor(PlaylistsService, PlaylistsSongsService, ActivitiesService, Validator) {
        this._playlistsService = PlaylistsService;
        this._playlistsSongsService = PlaylistsSongsService;
        this._activitiesService = ActivitiesService;
        this._validator = Validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
        this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);

    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;
        const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: { playlistId },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylist(credentialId);

        return {
            status: 'success',
            data: { playlists },
        };
    }

    async deletePlaylistByIdHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(id, credentialId);
        await this._playlistsService.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postPlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsSongsService.addPlaylistSong(playlistId, songId);
        await this._activitiesService.addPlaylistActivity(playlistId, credentialId, songId, 'add');


        return h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu ke playlist',
        }).code(201);
    }

    async getPlaylistSongsHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const playlist = await this._playlistsSongsService.getPlaylistSongs(playlistId);

        return {
            status: "success",
            data: { playlist },
        };
    }

    async deletePlaylistSongHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsSongsService.deletePlaylistSong(playlistId, songId, credentialId);
        await this._activitiesService.addPlaylistActivity(playlistId, credentialId, songId, 'delete');

        return h.response({
            status: 'success',
            message: 'Berhasil menghapus lagu dari playlist',
        }).code(200);
    }

    async getPlaylistActivitiesHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        const activities = await this._activitiesService.getPlaylistActivities(playlistId);

        return {
            status: "success",
            data: activities,
        };
    }
}

module.exports = PlaylistsHandler;
