const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
  };

  async postCommentHandler(request, h) {
    const {id : credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload, threadId, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;