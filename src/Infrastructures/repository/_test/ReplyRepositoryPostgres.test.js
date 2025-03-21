const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTestTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

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
});