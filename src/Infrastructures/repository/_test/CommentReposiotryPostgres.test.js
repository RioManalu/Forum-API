const CommentsTestTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

  describe('addComment function', () => {
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

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('comment-123'))
      .rejects
      .toThrowError(NotFoundError);
    });

    it('should return content when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // make a user (dependency for fk_threads.owner_users.id & fk_comments.owner_users.id)
      await UsersTableTestHelper.addUser({});

      // make a user (dependency for fk_comments.threads_id_threads.id)
      await ThreadsTableTestHelper.addThread({});

      // make a thread (dependency to getCommentById)
      await CommentsTestTableTestHelper.addComment({});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment.content).toBe('content');
    })
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const payload = {
        comment_id: 'comment-123',
        owner: 'user-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(payload.comment_id, payload.userId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner not verified', async () => {
      // Arrange
      const payload = {
        comment_id: 'comment-123',
        owner: 'user-321',
      };

      // make a user
      await UsersTableTestHelper.addUser({});

      // make a thread
      await ThreadsTableTestHelper.addThread({});

      // make a comment
      await CommentsTestTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(payload.comment_id, payload.owner))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and Authorization error when payload is correct', async () => {
      // Arrange
      const payload = {
        comment_id: 'comment-123',
        owner: 'user-123',
      };

      // make a user
      await UsersTableTestHelper.addUser({});

      // make a thread
      await ThreadsTableTestHelper.addThread({});

      // make a comment
      await CommentsTestTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(payload.comment_id, payload.owner))
        .resolves.not.toThrowError(AuthorizationError, NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const payload = {
        commentId: 'comment-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById(payload.commentId))
        .rejects
        .toThrow(NotFoundError);
    })
    it('should change is_delete in comments table to be true', async () => {
      // Arrange
      const payload = {
        comment_id: 'comment-123',
      };

      // make a user
      await UsersTableTestHelper.addUser({});

      // make a thread
      await ThreadsTableTestHelper.addThread({});

      // make a comment
      await CommentsTestTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteCommentById(payload.comment_id);

      // Action & Assert
      const comment = await CommentsTestTableTestHelper.findCommentById(payload.comment_id);
      expect(comment[0].is_delete).toBe(true);
    });
  });
});