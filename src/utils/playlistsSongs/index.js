const mapDBToPlaylistSongModel = ({ 
    id,
    playlist_id,
    song_id,
  }) => ({
    id,
    playlistId: playlist_id,
    songId: song_id,
  });
   
  module.exports = { mapDBToPlaylistSongModel };