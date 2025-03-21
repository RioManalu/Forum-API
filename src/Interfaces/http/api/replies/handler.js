const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');

class RepliesHandler {
  constructor(conteiner) {
    this._container = conteiner;
  };

  async postReplyHandler(request, h) {
    const { id : credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(request.payload, credentialId, threadId, commentId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;