const mapDBToPlaylistModel = ({ 
  id,
  name,
  created_at,
  updated_at,
  owner,
  username,
}) => ({
  id,
  name,
  createdAt: created_at,
  updatedAt: updated_at,
  owner,
  username,
});

module.exports = { mapDBToPlaylistModel };
