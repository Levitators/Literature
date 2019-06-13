const Queue = require('../queue/queue-sp');

const exchange = 'direct_logs';
const args = process.argv.slice(2);
const msg = args.slice(1).join(' ') || 'Hello World!';

const queSP = new Queue(msg, exchange, args);

queSP.subscribe();