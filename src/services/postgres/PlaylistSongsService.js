const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToSongModel } = require('../../utils/songs');

class PlaylistsSongsService {
    constructor(activitiesService, playlistsService) {
        this._pool = new Pool();
        this._activitiesService = activitiesService;
        this._playlistsService = playlistsService; // Tambahkan dependency PlaylistsService
    }

    async addPlaylistSong(playlistId, songId, userId) {
        // Pastikan pengguna memiliki akses ke playlist
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        // Pastikan lagu ada sebelum ditambahkan
        const songCheckQuery = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };
        const songCheckResult = await this._pool.query(songCheckQuery);

        if (!songCheckResult.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        const id = `playlistsong-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
        await this._activitiesService.addPlaylistActivity(playlistId, userId, songId, 'add');

        return result.rows[0].id;
    }

    async getPlaylistSongs(playlistId) {
        const playlistQuery = {
            text: `
                SELECT playlists.id, playlists.name, users.username
                FROM playlists
                INNER JOIN users ON playlists.owner = users.id
                WHERE playlists.id = $1
            `,
            values: [playlistId],
        };

        const songsQuery = {
            text: `
                SELECT songs.id, songs.title, songs.performer
                FROM songs
                INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
                WHERE playlist_songs.playlist_id = $1
            `,
            values: [playlistId],
        };

        const playlistResult = await this._pool.query(playlistQuery);
        const songsResult = await this._pool.query(songsQuery);

        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = playlistResult.rows[0];
        const songs = songsResult.rows.map(mapDBToSongModel);

        return {
            id: playlist.id,
            name: playlist.name,
            username: playlist.username,
            songs,
        };
    }

    async deletePlaylistSong(playlistId, songId, userId) {
        // Pastikan pengguna memiliki akses ke playlist sebelum menghapus lagu
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus dari playlist. Lagu mungkin tidak ada dalam playlist.');
        }

        await this._activitiesService.addPlaylistActivity(playlistId, userId, songId, 'delete');
        return true;
    }
}

module.exports = PlaylistsSongsService;
