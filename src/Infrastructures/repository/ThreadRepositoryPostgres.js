const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository{
  constructor(pool, idGenerator) {
    super()
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body , owner} = thread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    }

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username
      FROM threads t
      JOIN users u
      ON t.owner = u.id
      WHERE t.id = $1`,
      values: [id],
    };
    
    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async getDetailThreadById(id) {
    const thread = await this.getThreadById(id);
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content,
      CASE 
          WHEN comments.is_delete = TRUE THEN '**komentar telah dihapus**'
          ELSE comments.content
      END
      FROM comments
      JOIN users
      ON comments.owner = users.id
      JOIN threads
      ON comments.threads_id = threads.id
      WHERE threads.id = $1
      ORDER BY comments.date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);
    const comments = result.rows;
    const detailThread = {
      ...thread,
      comments,
    }
    return detailThread;
  }
}

module.exports = ThreadRepositoryPostgres;