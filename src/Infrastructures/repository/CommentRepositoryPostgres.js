const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, threads_id, owner } = comment;
    const id = `comment-${this._idGenerator()}`
    const date = new Date();
    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, threads_id, owner`,
      values: [id, content, threads_id, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    const verified = result.rows[0].owner === owner;
    if(!verified) {
      throw new AuthorizationError('Akses ditolak');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;