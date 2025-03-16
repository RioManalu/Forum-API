const CommentsTestTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  afterEach( async () => {
    await UsersTableTestHelper.cleanTable();
  });
  
  afterEach( async () => {
    await CommentsTestTableTestHelper.cleanTable();
  });

  afterEach( async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll( async () => {
    await pool.end();
  });

  describe('addUser function', () => {
    it('should persist addComment and return addedComment correctly', async () => {
      // Arrange
      const comment = {
        content: 'content',
        threads_id: 'thread-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // make a user (dependency for fk_comments.owner_users.id)
      await UsersTableTestHelper.addUser({ id: comment.owner });

      // make a thread (dependency for fk_comments.threads_id_threads.id)
      await ThreadsTableTestHelper.addThread({ id: comment.threads_id });

      // Action
      await commentRepositoryPostgres.addComment(comment);

      // Assert
      const addedComment = await CommentsTestTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toHaveLength(1);
    });

    it('should return addedComment correctly', async () => {
      // Arrange
      const comment = {
        content: 'content',
        threads_id: 'thread-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // make a user (dependency for fk_comments.owner_users.id)
      await UsersTableTestHelper.addUser({ id: comment.owner });

      // make a thread (dependency for fk_comments.threads_id_threads.id)
      await ThreadsTableTestHelper.addThread({ id: comment.threads_id , owner: comment.owner });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: comment.content,
        threads_id: comment.threads_id,
        owner: comment.owner,
      }));
    });
  });
});