const InvariantError = require("../../Commons/exceptions/InvariantError");

class ThreadRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3) RETURNING id, title, body',
      values: [id, title, body],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length){
      throw new InvariantError('gagal menambahkan thread');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;