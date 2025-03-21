const AddReplyUseCase = require('../AddReplyUseCase');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the addReply action correctly', async () => {
    // Arrange
    const payload = {
      content: 'content',
    }
    const mockAuth = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner: mockAuth.owner,
    })

    // prepare dependency for use case
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    
    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(payload, mockAuth.owner, mockAuth.threadId, mockAuth.commentId);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: mockAddedReply.id,
      content: mockAddedReply.content,
      owner: mockAddedReply.owner,
    }));

    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new Reply({
      content: payload.content,
      owner: mockAuth.owner,
      thread_id: mockAuth.threadId,
      comment_id: mockAuth.commentId,
    }));
  })
})