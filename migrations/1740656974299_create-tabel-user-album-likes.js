exports.up = (pgm) => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'albums',
            onDelete: 'CASCADE',
        },
        create_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('NOW()'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('NOW()'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('user_album-likes');
};
