const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async PostThreadHandler(request, h) {
    const authorization = request.headers.authorization;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, authorization);

    const response = h.response({
      status: 'success',
      data: addedThread,
    });
    response.code = 201;
    return response;
  }
}

module.exports = ThreadsHandler;