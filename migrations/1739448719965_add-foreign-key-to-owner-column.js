/* eslint-disable camelcase */
 
exports.shorthands = undefined;
 
exports.up = (pgm) => {
  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlist', 'old_playlist', 'old_playlist', 'old playlist')");
 
  // mengubah nilai owner pada playlists yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner IS NULL");
 
  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  // menghapus constraint fk_playlists.owner_users.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
 
  // mengubah nilai owner old_playlists pada note menjadi NULL
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlist'");
 
  // menghapus user baru.
  pgm.sql("DELETE FROM playlists WHERE id = 'old_playlist'");
};