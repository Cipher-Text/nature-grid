/**
 * CJS stub for bullmq used in Jest tests.
 * The real package is pure ESM which Jest cannot load in CommonJS mode.
 */
'use strict';

class Queue {
  async add(_name, _data, _opts) { return { id: 'mock-job-id' }; }
  async close() {}
}

class Worker {}

class Job {
  constructor() {
    this.name = '';
    this.data = {};
  }
}

module.exports = { Queue, Worker, Job };
