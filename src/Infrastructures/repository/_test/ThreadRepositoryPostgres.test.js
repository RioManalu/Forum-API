const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const thread = {
        title: 'title thread',
        body: 'body thread',
        owner: 'user-123',
      }
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // make a user (dependency for fk_threads.user_id_users.id)
      await UsersTableTestHelper.addUser({ username: thread.owner });
  
      // Action
      await threadRepositoryPostgres.addThread(thread);
  
      // Assert
      const addedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const thread = {
        title: 'title thread',
        body: 'body thread',
        owner: 'user-123',
      }
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // make a user (dependency for fk_threads.owner_users.id)
      await UsersTableTestHelper.addUser({ username: thread.owner });
  
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: thread.title,
        body: thread.body,
        owner: thread.owner,
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return id, title, body, username when user is found', async () => {
      // Arrange
      const id = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // make a user (dependency for fk_threads.user_id_users.id)
      await UsersTableTestHelper.addUser({});

      // make a thread (dependency to getThreadByid)
      await ThreadsTableTestHelper.addThread({});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(id);

      // Assert
      expect(thread.id).toBe(id);
      expect(thread.title).toBe('title');
      expect(thread.body).toBe('body');
      expect(thread.username).toBe('dicoding');
    });
  });

  describe('getDetailThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      expect(threadRepositoryPostgres.getDetailThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return detail thread correctly', async () => {
      // Arrange
      const payload = {
        thread_id: 'thread-123',
      };

      const mockComments = {
          id: 'comment-123',
          username: 'dicoding',
          content: 'content'
        }

      const mockDetailThread = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
        comments: [mockComments],
      }

      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      await CommentTableTestHelper.addComment({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getDetailThreadById(payload.thread_id);

      // Assert
      // toEqual(new Date(detailThread.date)) means -> to check if the output is a date type
      expect(detailThread.id).toBe(mockDetailThread.id);
      expect(detailThread.title).toBe(mockDetailThread.title);
      expect(detailThread.body).toBe(mockDetailThread.body);
      expect(detailThread.date).toEqual(new Date(detailThread.date));
      expect(detailThread.username).toBe(mockDetailThread.username);
      expect(detailThread.comments[0].id).toBe(mockComments.id);
      expect(detailThread.comments[0].username).toBe(mockComments.username);
      expect(detailThread.comments[0].date).toEqual(new Date(detailThread.comments[0].date));
      expect(detailThread.comments[0].content).toBe(mockComments.content);
    })
  })
});