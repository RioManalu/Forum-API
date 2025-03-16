const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload do not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should response error when request payload not meet data type', () => {
    // Arrange
    const payload = {
      id: [],
      title: 123,
      body: true,
      owner: {},
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      owner: 'user-123'
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  })
})