const Reply = require('../../../Domains/replies/entities/Reply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload, userId, threadId, commentId) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    const reply = new Reply({ ...payload, owner: userId, thread_id: threadId, comment_id: commentId });
    return this._replyRepository.addReply(reply);
  }
}

module.exports = AddReplyUseCase;