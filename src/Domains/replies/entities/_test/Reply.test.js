const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
      thread_id: 'thread-123',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrow('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: {},
      thread_id: [],
      comment_id: {},
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrow('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      owner: 'user-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
    };

    // Action
    const reply = new Reply(payload);
    // Assert
    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
    expect(reply.thread_id).toEqual(payload.thread_id);
    expect(reply.comment_id).toEqual(payload.comment_id);
  })
});