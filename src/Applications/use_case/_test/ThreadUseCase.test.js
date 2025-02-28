const ThreadUseCase = require('../ThreadUseCase');
// const container = require('../../../Infrastructures/container');
const ThreadRepositoryPostgres = require('../../../Infrastructures/repository/ThreadRepositoryPostgres');

describe('ThreadUseCase', () => {
  describe('addThread', () => {
    it('should response error when request payload not contain needed property', async () => {
      // Arrange
      const useCasePayload = {
        title: 'abc',
      }

      // Action 
      const threadUseCase = new ThreadUseCase({});
  
      // Assert
      await expect(threadUseCase.addThread(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  
    it('should response error when request payload not meet data type', async () => {
      // Arrange
      const useCasePayload = {
        title: 123,
        body: true,
      };
  
      // Action
      const threadUseCase = new ThreadUseCase({});
  
      // Assert
      await expect(threadUseCase.addThread(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    
    // it('should orchestrating the addThread action correctly', async () => {
    //   // Arrange
    //   let useCasePayload = {
    //     title: 'title',
    //     body: 'body',
    //   };

    //   // Action

    //   // Assert
    // })
  })
})