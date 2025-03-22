class GetDetailThreadUseCase {
  constructor({ threadRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    // Mendapatkan detail thread berdasarkan threadId
    let detailThread = await this._threadRepository.getDetailThreadById(threadId);

    // Mendapatkan replies untuk setiap comment
    for (let i = 0; i < detailThread.comments.length; i++) {
      const comment = detailThread.comments[i];
      const replies = await this._replyRepository.getRepliesFromComment(comment.id);

      // Menambahkan replies ke dalam comment yang sesuai
      detailThread.comments[i].replies = replies;
    }

    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;