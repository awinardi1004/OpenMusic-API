class ExportsHandler {
    constructor(ProducerService, PlaylistsService, PlaylistSongsService, Validator) {
        this._producerService = ProducerService;
        this._playlistsService = PlaylistsService;
        this._playlistSongsService = PlaylistSongsService;
        this._validator = Validator;

        this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        const playlistWithSongs = await this._playlistSongsService.getPlaylistSongs(playlistId);
    
        const message = {
            playlist: {
                id: playlistWithSongs.id,
                name: playlistWithSongs.name,
                songs: playlistWithSongs.songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
            targetEmail: request.payload.targetEmail,
        };
        

        await this._producerService.sendMessage(
            'export:playlist',
            JSON.stringify(message),
        );        

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrian',
            playlist: message.playlist,
        });

        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;