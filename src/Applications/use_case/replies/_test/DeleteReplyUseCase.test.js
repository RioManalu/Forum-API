const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123'
    }
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(payload.id, payload.owner))
    .rejects
    .toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      id: 123,
      owner: {},
      threadId: [],
      commentId: true,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    expect(deleteReplyUseCase.execute(payload.id, payload.owner, payload.threadId, payload.commentId))
    .rejects
    .toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the DeleteReply correctly', async () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // mock needed repository class
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mock needed repository function
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(payload.id, payload.owner, payload.threadId, payload.commentId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(payload.commentId);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(payload.id, payload.owner);
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(payload.id);
  });
});