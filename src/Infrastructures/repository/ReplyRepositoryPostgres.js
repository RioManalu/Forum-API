const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const { content, owner, thread_id, comment_id } = reply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, thread_id, comment_id],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('reply tidak ditemukan');
    }
    const verified = result.rows[0].owner === owner;
    if(!verified) {
      throw new AuthorizationError('Akses ditolak');
    }
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);    
  }

  async getRepliesFromComment(id) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username,
      CASE
        WHEN replies.is_delete = TRUE THEN '**balasan telah dihapus'
        ELSE replies.content
      END
      FROM replies
      JOIN users
      ON replies.owner = users.id
      JOIN comments
      ON replies.comment_id = comments.id
      WHERE comments.id = $1
      ORDER BY replies.date ASC`,
      values: [id],
    }

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;