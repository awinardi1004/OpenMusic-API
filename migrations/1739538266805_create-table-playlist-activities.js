exports.up = (pgm) => {
    pgm.createTable('playlist_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"playlists"',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"songs"',
            onDelete: 'CASCADE',
        },
        action: {
            type: 'VARCHAR(20)',
            notNull: true,
            check: "action IN ('add', 'delete')",
        },
        time: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('NOW()'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_activities');
};
