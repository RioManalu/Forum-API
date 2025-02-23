/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread');
};
