exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'SMALLINT', 
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true
        },
        duration : {
            type: "INT",
            notNull: false,
        },
        albumId: {
            type: "VARCHAR",
            notNull: false,
        },
        created_at: {
            type: 'TIMESTAMP',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
        updated_at: {
            type: 'TIMESTAMP',
            default: pgm.func('current_timestamp'),
            notNull: true,
        },
    });
    pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', {
        foreignKeys: {
            columns: 'albumId',
            references: 'albums(id)',
            onDelete: 'CASCADE',
        },
    });
};


exports.down = (pgm) => {
    pgm.dropTable('songs');
};
