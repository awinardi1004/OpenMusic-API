const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToPlaylistModel } = require('../../utils/playlists');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO playlists (id, name, created_at, updated_at, owner) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, createdAt, updatedAt, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }
    
    async getPlaylist(userId) {
        const query = {
            text: `
                SELECT DISTINCT playlists.id, playlists.name, users.username
                FROM playlists
                JOIN users ON playlists.owner = users.id
                LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1
            `,
            values: [userId],
        };
        const result = await this._pool.query(query);
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

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        if (result.rows[0].owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
          await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }
          try {
            await this._collaborationService.verifyCollaborator(playlistId, userId);
          } catch (collabError) {
            throw error;
          }
        }
      }
    
}

module.exports = PlaylistsService;
