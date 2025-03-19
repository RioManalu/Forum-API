const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the getDetailThread action correctly', async () => {
    const payload = {
      threadId: 'thread-123',
    };

    const newDate = new Date();

    const mockDetailThread = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: newDate,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: newDate,
          content: 'content',
        },
      ],
    };

    // prepare repo class
    const mockThreadRepository = new ThreadRepository();

    // prepare repo function
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(payload.threadId);

    // check if detailThread.date is a 'date type'
    const date = new Date(detailThread.date);

    // Assert
    expect(detailThread).toStrictEqual({
      id: mockDetailThread.id,
      title: mockDetailThread.title,
      body: mockDetailThread.body,
      date: date,
      username: mockDetailThread.username,
      comments: mockDetailThread.comments,
    });

    expect(mockThreadRepository.getDetailThreadById).toHaveBeenCalledWith(payload.threadId);
  });
});