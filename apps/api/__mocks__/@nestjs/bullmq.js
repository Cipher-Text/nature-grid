/**
 * CJS stub for @nestjs/bullmq used in Jest tests.
 * The real package is pure ESM which Jest cannot load in CommonJS mode.
 * Tests mock the services that use queues, so this stub only needs to
 * provide the decorator/class shapes used at module-load time.
 */
'use strict';

const InjectQueue = (_name) => (_target, _propertyKey, _parameterIndex) => {};
const Processor = (_name) => (_target) => _target;

class WorkerHost {
  async process(_job) { return undefined; }
}

const BullModule = {
  forRoot: () => ({ module: class BullModuleStub {} }),
  forRootAsync: () => ({ module: class BullModuleStub {}, imports: [], providers: [] }),
  registerQueue: (..._args) => ({ module: class BullModuleStub {}, imports: [], providers: [], exports: [] }),
};

const getQueueToken = (name) => `BULL_MODULE_QUEUE_${name}`;
const InjectFlowProducer = (_name) => () => {};

module.exports = {
  InjectQueue,
  Processor,
  WorkerHost,
  BullModule,
  getQueueToken,
  InjectFlowProducer,
};
