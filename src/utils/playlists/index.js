const mapDBToPlaylistModel = ({ 
    id,
    name,
    created_at,
    updated_at,
    owner
  }) => ({
    id,
    name,
    createdAt: created_at,
    updatedAt: updated_at,
    owner
  });
   
  module.exports = { mapDBToPlaylistModel };