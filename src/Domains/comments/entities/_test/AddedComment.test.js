const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload do not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      threads_id: 'thread-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload do not meet data type', () => {
    // Arrange
    const payload = {
      id: true,
      content: 123,
      threads_id: [],
      owner: {},
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload ={
      id: 'comment-123',
      content: 'content',
      threads_id: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.threads_id).toEqual(payload.threads_id);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});