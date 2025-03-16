/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    threads_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Menambahkan constraints Foreign key threads_id reference ke threads.id
  pgm.addConstraint('comments', 'fk_threads.threads_id_threads.id', 'FOREIGN KEY(threads_id) REFERENCES threads(id) ON DELETE CASCADE');

  // Menambahkan constraints Foreign key owner reference ke users.id
  pgm.addConstraint('comments', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

};

exports.down = pgm => {
  pgm.dropTable('comments');
};
