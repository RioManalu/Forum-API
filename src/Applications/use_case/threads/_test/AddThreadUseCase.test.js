const AddThreadUseCase = require('../AddThreadUseCase');
const Thread = require('../../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should throw AuthenticationError when header not contain authentication key', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };
    const addThreadUseCase = new AddThreadUseCase({});
    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_AUTHORIZATION');
  });

  it('should orchestrating the addThread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const mockAuthentication = 'Bearer accessToken';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
    });

    const accessToken = 'accessToken';

    // prepare dependency for use case
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mocking needed function
    mockAuthenticationTokenManager.removeBearer = jest.fn()
    .mockReturnValue(accessToken);
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
    .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
    .mockImplementation(() => Promise.resolve({ username: 'username', id: mockAddedThread.owner }));
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository : mockThreadRepository,
      authenticationTokenManager : mockAuthenticationTokenManager,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, mockAuthentication);

    // Assert

      // assert addThread use case
    expect(addedThread).toStrictEqual(new AddedThread({
      id: mockAddedThread.id,
      title: mockAddedThread.title,
      body: mockAddedThread.body,
      owner: mockAddedThread.owner,
    }));

      // assert value sent to parameter
    expect(mockAuthenticationTokenManager.removeBearer).toBeCalledWith(mockAuthentication);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
    expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: mockAddedThread.owner,
    }));
  });
});