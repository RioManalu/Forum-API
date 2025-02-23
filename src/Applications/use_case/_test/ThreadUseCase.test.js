const ThreadUseCase = require('../ThreadUseCase');
const ThreadRepositoryPostgres = require('../../../Infrastructures/repository/ThreadRepositoryPostgres');

describe('ThreadUseCase', () => {
  describe('addThread', () => {
    it('should response error when request payload not contain needed property', async () => {
      // Arrange
      const useCasePayload = {
        title: 'abc',
      }
  
  
      // Action 
      const threadUseCase = new ThreadUseCase({ ThreadRepositoryPostgres });
  
      // Assert
      expect(await threadUseCase.addThread(useCasePayload))
      .rejects
      .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  
    it('should response error when request payload not meet data type', async () => {
      // Arrannge
      const useCasePayload = {
        title: 123,
        body: true,
      };
  
      // Action
      const threadUseCase = new ThreadUseCase({ ThreadRepositoryPostgres });
  
      // Assert
      expect(await threadUseCase.addThread(useCasePayload))
      .toThrowError('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  })
})