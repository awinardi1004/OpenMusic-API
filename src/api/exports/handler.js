class ExportsHandler {
    constructor(ProducerService, PlaylistsService, Validator) {
        this._producerService = ProducerService;
        this._playlistsService = PlaylistsService;
        this._validator = Validator;

        this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
        };

        await this._producerService.sendMessage(
            'export:playlist',
            JSON.stringify(message),
        );

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrian',
        });

        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;