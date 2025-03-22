const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTestTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentsTestTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const reply = {
        content: 'content',
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
      };

      const fakeIdGenerator = () => 123;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      
      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      await CommentsTestTableTestHelper.addComment({});


      // Action
      await replyRepositoryPostgres.addReply(reply);

      // Assert
      expect(await RepliesTableTestHelper.findReplyById('reply-123')).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const reply = {
        content: 'content',
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
      };

      const fakeIdGenerator = () => 123;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      
      // make a user (dependency for fk_comments.owner_users.id & fk_threads.owner_users.id & fk_replies.owner_users.id)
      await UsersTableTestHelper.addUser({});

      // make a thread (dependency for fk_comments.threads_id_threads.id)
      await ThreadsTableTestHelper.addThread({});

      // make a thread (dependency for fk_replies.comment_id_comments.id)
      await CommentsTestTableTestHelper.addComment({});


      // Action
      const addedReply = await replyRepositoryPostgres.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: reply.content,
        owner: reply.owner,
      }));
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const reply = {
        id: 'reply-',
        owner: 'user-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(reply.id, reply.owner))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when owner is not verified', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        owner: 'user-234',
      };

      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      await CommentsTestTableTestHelper.addComment({});

      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(reply.id, reply.owner))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError when payload is correct', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        owner: 'user-123',
      };

      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      await CommentsTestTableTestHelper.addComment({});

      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(reply.id, reply.owner))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesFromComment', () => {
    it('should return detail thread correctly', async () => {
      // Arrange
      const payload = {
        comment_id: 'comment-123',
      };

      const mockReplies = {
        id: 'reply-123',
        content: 'content',
        date: new Date(),
        username: 'dicoding',
      };

      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      await CommentsTestTableTestHelper.addComment({});

      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesFromComment(payload.comment_id);

      // Assert
      expect(replies[0].id).toBe(mockReplies.id);
      expect(replies[0].content).toBe(mockReplies.content);
      expect(replies[0].date).toEqual(new Date(replies[0].date));
      expect(replies[0].username).toBe(mockReplies.username);
    });
  });
});