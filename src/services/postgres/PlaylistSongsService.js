const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong(playlistId, songId) {
        // Pastikan playlistId ada
        const playlistCheckQuery = {
            text: 'SELECT id FROM playlists WHERE id = $1',
            values: [playlistId],
        };
        const playlistCheckResult = await this._pool.query(playlistCheckQuery);
    
        if (!playlistCheckResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    
        // Pastikan songId ada
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
        await this._pool.query(query);
    }
    

    async getPlaylistSongs(playlistId) {
        try {
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
    
            if (!playlistResult.rowCount) {
                throw new NotFoundError("Playlist tidak ditemukan");
            }
    
            const playlist = playlistResult.rows[0];
            const songs = songsResult.rows.map((row) => ({
                id: row.id,
                title: row.title,
                performer: row.performer,
            }));
    
            return {
                id: playlist.id,
                name: playlist.name,
                username: playlist.username,
                songs,
            };
        } catch (error) {
            console.error("Error di getPlaylistSongs:", error.message);
            throw new InvariantError("Gagal mengambil lagu dalam playlist");
        }
    }
    
    
    async deletePlaylistSong(playlistId, songId) {
        try {
            // Cek apakah playlist ada
            const playlistCheckQuery = {
                text: 'SELECT id FROM playlists WHERE id = $1',
                values: [playlistId],
            };
            const playlistCheckResult = await this._pool.query(playlistCheckQuery);
    
            if (!playlistCheckResult.rowCount) {
                throw new NotFoundError('Playlist tidak ditemukan');
            }
    
            // Cek apakah lagu ada di dalam playlist
            const query = {
                text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
                values: [playlistId, songId],
            };
    
            const result = await this._pool.query(query);
    
            if (!result.rowCount) {
                throw new InvariantError('Lagu gagal dihapus dari playlist. Lagu mungkin tidak ada dalam playlist.');
            }
        } catch (error) {
            console.error("Error di deletePlaylistSong:", error.message);
            throw new InvariantError("Gagal menghapus lagu dari playlist");
        }
    }
    
}

module.exports = PlaylistsSongsService;