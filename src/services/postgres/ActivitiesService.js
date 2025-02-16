const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class ActivitiesService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistActivity(playlistId, userId, songId, action) {
        const id = `activity-${nanoid(16)}`;
        const time = new Date().toISOString();

        const query = {
            text: `INSERT INTO playlist_activities (activity_id, playlist_id, user_id, song_id, action, time)
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING activity_id`,
            values: [id, playlistId, userId, songId, action, time], 
        };

        const result = await this._pool.query(query);
        return result.rows[0].activity_id;
    }

    async getPlaylistActivities(playlistId) {
        const query = {
            text: `
                SELECT users.username, songs.tittle AS song_title, action, time 
                FROM playlist_activities
                JOIN users ON playlist_activities.user_id = users.id
                JOIN songs ON playlist_activities.song_id = songs.id
                WHERE playlist_activities.playlist_id = $1
                ORDER BY time ASC
            `,
            values: [playlistId],
        };
    
        const result = await this._pool.query(query);
    
        return {
            playlistId,
            activities: result.rows.map((row) => ({
                username: row.username,
                title: row.song_title,
                action: row.action,
                time: row.time,
            })),
        };
    }
    
}

module.exports = ActivitiesService;
