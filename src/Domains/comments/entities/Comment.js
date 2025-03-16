class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threads_id, owner } = payload;
    this.content = content;
    this.threads_id = threads_id;
    this.owner = owner
  }

  _verifyPayload({ content, threads_id, owner }) {
    if(!content || !threads_id || !owner) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof content !== 'string' || typeof threads_id !== 'string' || typeof owner !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;