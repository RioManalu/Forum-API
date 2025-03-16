const Comment = require("../../../Domains/comments/entities/Comment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }){
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload, threadId, userId) {
    await this._threadRepository.getThreadById(threadId);
    const comment = new Comment({ ...payload, threads_id: threadId, owner: userId});
    
    // sesuaikan output yang diinginkan
    const { id, content, owner } = await this._commentRepository.addComment(comment);
    return { id, content, owner };
  }
}

module.exports = AddCommentUseCase;