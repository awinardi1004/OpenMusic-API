const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToAlbumModel } = require('../../utils/albums');
const ClientError = require('../../exceptions/ClientError');


class AlbumsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addAlbum({name, year}) {
        const id = "album-" + nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt],
        };
    
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }
        
        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        return result.rows.map(mapDBToAlbumModel);
    }

    async getAlbumById(id) {
        const query = {
            text: `
                SELECT 
                    a.id AS album_id, 
                    a.name AS album_name, 
                    a.year AS album_year,
                    a.cover AS cover_url,
                    s.id AS song_id, 
                    s.title AS song_title, 
                    s.performer AS song_performer
                FROM albums a
                LEFT JOIN songs s ON s.album_id = a.id
                WHERE a.id = $1
            `,
            values: [id],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }
    
        const albumData = {
            id: result.rows[0].album_id,
            name: result.rows[0].album_name,
            year: result.rows[0].album_year,
            coverUrl: result.rows[0].cover_url,
            songs: result.rows[0].song_id ? result.rows.map(row => ({
                id: row.song_id,
                title: row.song_title,
                performer: row.song_performer,
            })) : [],
        };
    
        return albumData;
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
          text: 'UPDATE albums SET name = $1, year = $2,  updated_at = $3 WHERE id = $4 RETURNING id',
          values: [name, year, updatedAt, id],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
          throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
      }
    
    

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };
     
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

    async updateAlbumCover(id, cover) {

        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2',
            values: [cover, id],
        }
        await this._pool.query(query);
    }

    async getLikeAlbumById(albumId) {
        try {
            const cachedLikes = await this._cacheService.get(`user_album_likes:${albumId}`);
            
            if (cachedLikes !== null) {
                return { likes: parseInt(cachedLikes, 10), source: 'cache' }; 
            }
        } catch (error) {
            console.warn('Cache service error:', error.message);
        }
    
        const albumCheck = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId],
        };
    
        const albumCheckResult = await this._pool.query(albumCheck);
    
        if (!albumCheckResult.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }
    
        const query = {
            text: `SELECT COUNT(id) AS total_likes FROM user_album_likes WHERE album_id = $1`,
            values: [albumId],
        };
    
        const result = await this._pool.query(query);
        const totalLikes = parseInt(result.rows[0].total_likes, 10);
    
        try {
            await this._cacheService.set(`user_album_likes:${albumId}`, totalLikes);
        } catch (error) {
            console.warn('Failed to set cache:', error.message);
        }
    
        return { likes: totalLikes, source: 'server' };
    }
    
    async addLikeAlbum(userId, albumId) {
        const albumCheck = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId],
        };
    
        const albumCheckResult = await this._pool.query(albumCheck);
    
        if (!albumCheckResult.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }
    
        const likeCheck = {
            text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };
    
        const likeCheckResult = await this._pool.query(likeCheck);
        if (likeCheckResult.rows.length) {
            throw new ClientError('Anda sudah like album ini');
        }
    
        const id = `album-like-${nanoid(16)}`;
        const queryLike = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };
    
        await this._pool.query(queryLike);
        await this._cacheService.delete(`user_album_likes:${albumId}`); 
    }
    
    async deleteLikeAlbum(userId, albumId) {
        const albumCheck = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId],
        };
    
        const albumCheckResult = await this._pool.query(albumCheck);
    
        if (!albumCheckResult.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }
    
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new NotFoundError('Like gagal dihapus. Like tidak ditemukan untuk album ini');
        }
    
        await this._cacheService.delete(`user_album_likes:${albumId}`); 
    }
    
}

module.exports = AlbumsService;