class ActivitiesHandler {
    constructor(activitiesService, playlistsService) {
        this._activitiesService = activitiesService;
        this._playlistsService = playlistsService;

        this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
    }

    async getPlaylistActivitiesHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        const activities = await this._activitiesService.getPlaylistActivities(playlistId);

        return {
            status: 'success',
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = ActivitiesHandler;
