const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw an error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});