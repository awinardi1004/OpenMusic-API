const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToPlaylistModel } = require('../../utils/playlists');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({name}) {
        const id = "playlist-" + nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, name, createdAt, updatedAt],
        };
    
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }
        
        return result.rows[0].id;
    }

    async getPlaylist() {
        const result = await this._pool.query('SELECT * FROM playlists');
        return result.rows.map(mapDBToPlaylistModel);
    }
    

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };
     
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;
