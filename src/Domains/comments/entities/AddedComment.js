class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, threads_id, owner } = payload;
    this.id = id;
    this.content = content;
    this.threads_id = threads_id;
    this.owner = owner;
  }

  _verifyPayload({ id, content, threads_id, owner }) {
    if(!id || !content || !threads_id || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof id !== 'string' || typeof content !== 'string' || typeof threads_id !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;