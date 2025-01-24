const { nanoid } = require('nanoid');

class songsService {
    constructor() {
      this._songs = [];
    }

    addSong({title, year, genre, performer, duration, albumId}) {
        const id = "album-" + nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const newSong = {
            id, title, year, performer, genre, duration, albumId, createdAt, updatedAt,
        };
        
        songs.push(newSong);

        const isSuccess = songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
            throw new Error('Music gagal ditambahkan');
        }

        return id;
    }

    getSongs() {
        return this._songs;
    }

    getSongById(id) {
        const song = this._songs.filter((s) => s.id === id)[0];
        if (!song) {
            throw new Error('Album tidak ditemukan');
          }
          return song;
    }

    editSongById(id, {title, year, genre, performer, duration, albumId}) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new Error('Gagal memperbarui music. Id tidak ditemukan');
        }
        
        const updatedAt = new Date().toISOString();

        this._songs[index] = {
            ...songs[index],
            title,
            year,
            genre,
            performer,
            duration,
            albumId,
            updatedAt,
        };
    }

    deleteSOngmById(id){
        const index = this._songs.findIndex((song) => song.id === id);
        if (index === -1) {
          throw new Error('Music gagal dihapus. Id tidak ditemukan');
        }
        this._albums.splice(index, 1);
    }
}

module.exports = songsService;