exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'SMALLINT', 
            notNull: true,
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
};

exports.down = (pgm) => {
    pgm.dropTable('albums');
};
