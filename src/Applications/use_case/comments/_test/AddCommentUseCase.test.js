const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const Comment = require('../../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddComentUseCase', () => {
  it('should orchestrating the addComment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'content',
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content',
      threads_id: 'thread-123',
      owner: 'user-123',
    });

    // prepare dependencies (mocking needed class)
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository : mockCommentRepository,
      threadRepository : mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      payload,
      threads_id = mockAddedComment.threads_id, 
      owner = mockAddedComment.owner
    );

    const expected = new AddedComment({
      id: mockAddedComment.id,
      content: mockAddedComment.content,
      threads_id: mockAddedComment.threads_id,
      owner: mockAddedComment.owner,
    });

    // Assert
    // assert returned value
    expect(addedComment).toStrictEqual({ 
      id: expected.id, 
      content: expected.content, 
      owner: expected.owner
    })

    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockAddedComment.threads_id);
    expect(mockCommentRepository.addComment).toBeCalledWith(new Comment({
      content: payload.content,
      threads_id: mockAddedComment.threads_id,
      owner: mockAddedComment.owner,
    }));
  });
});