const { AlbumSchema, CoverHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validateCoverHeaders: (headers) => {
    const { error } = CoverHeadersSchema.validate(headers);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = AlbumsValidator;
