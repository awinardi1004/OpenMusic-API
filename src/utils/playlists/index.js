const mapDBToPlaylistModel = ({ 
  id,
  name,
  created_at,
  updated_at,
  owner,
  username, // Tambahkan username
}) => ({
  id,
  name,
  createdAt: created_at,
  updatedAt: updated_at,
  owner,
  username, // Pastikan username ikut dikembalikan
});

module.exports = { mapDBToPlaylistModel };
