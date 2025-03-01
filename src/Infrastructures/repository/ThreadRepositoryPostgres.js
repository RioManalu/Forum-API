const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository{
  constructor(pool, idGenerator) {
    super()
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3) RETURNING id, title, body',
      values: [id, title, body],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new InvariantError('gagal menambahkan thread');
    }

    return new AddedThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;