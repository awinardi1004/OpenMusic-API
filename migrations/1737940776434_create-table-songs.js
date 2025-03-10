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
        performer: {
            type: 'TEXT',
            notNull: true
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        duration : {
            type: "INT",
            notNull: false,
        },
        album_id: {
            type: "VARCHAR(50)",
            notNull: false,
            references: '"albums"(id)', 
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
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
    pgm.dropTable('songs');
};
