exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlists');
};
