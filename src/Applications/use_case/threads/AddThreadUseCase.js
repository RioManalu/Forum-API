const Thread = require('../../../Domains/threads/entities/Thread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, authorization) {
    this._validateAuthorization(authorization);
    const token = this._authenticationTokenManager.removeBearer(authorization);
    await this._authenticationTokenManager.verifyAccessToken(token);
    const { id : user_id } = await this._authenticationTokenManager.decodePayload(token);
    const thread = new Thread({ ...useCasePayload, user_id });
    return this._threadRepository.addThread(thread);
  }

  _validateAuthorization(authorization) {
    if(!authorization) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_AUTHORIZATION');
    }
  }
}

module.exports = AddThreadUseCase;