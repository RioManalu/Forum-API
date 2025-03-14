const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async PostThreadHandler(request, h) {
    const {id : credetialId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, credetialId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      }
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;