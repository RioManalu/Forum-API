const AddThreadUseCase = require('../AddThreadUseCase');
const Thread = require('../../../../Domains/threads/entities/Thread')
const AddedThread = require('../../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the addThread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    // prepare dependency for use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // create use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository : mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
      title: useCasePayload.title,
      body: useCasePayload.body
    }));
  })
});