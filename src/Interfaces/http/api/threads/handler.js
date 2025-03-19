const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/threads/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
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

  async getDetailThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: detailThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;