const Queue = require('./queue');

const que = new Queue("Hello World","hello");

console.log("Recieve que"+que);

que.send();
