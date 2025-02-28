// buat addThread jadi fungsi yang gantiin execute supaya bisa lebih ringkas
// jadi classnya Threads bisa nampung banyak use case (execute) lain yang berkaitan dengan threads

class ThreadUseCase {
  constructor({ threadRepositoryPostgres }) {
    this._threadRepository = threadRepositoryPostgres;
  }

  async addThread(payload) {
    this._validatePayload(payload);
    await this._threadRepository.addThread(payload);
  }

  _validatePayload({ title, body }) {
    if(!title || !body) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadUseCase;