const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    }

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should response error when request payload not meet data type', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: {},
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'user-123',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.owner).toEqual(payload.owner);
  })
})