const amqp = require('amqplib/callback_api');


class QueueSP{

    constructor(msg, exchange, args){
            this.msg = msg;
            this.exchange = exchange;
            this.args = args;
    }

    publish(){
        const exchange = 'direct_logs';
        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || 'Hello World!';
        amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    console.log("Error while connecting at Publish "+error0);
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      console.log("Error while creating a channel at Publish "+error1);
    }
    
    var severity = (args.length > 0) ? args[0] : 'info';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);
});

    }

    subscribe(){
        const exchange = this.exchange;;
        const args = this.args;;
        const msg = this.msg;


        if (args.length == 0) {
            console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
            process.exit(1);
          }
          
          amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
              console.log("Error while connecting at Subscribe "+error0);
            }
            connection.createChannel(function(error1, channel) {
              if (error1) {
                console.log("Error while craeting channel at Subscribe "+error1);
              }
              
          
              channel.assertExchange(exchange, 'direct', {
                durable: false
              });
          
              channel.assertQueue('', {
                exclusive: true
                }, function(error2, q) {
                  if (error2) {
                    console.log("Error while asserting queue at Subscribe "+error2);
                  }
                console.log(' [*] Waiting for logs. To exit press CTRL+C');
          
                args.forEach(function(severity) {
                  channel.bindQueue(q.queue, exchange, severity);
                });
          
                channel.consume(q.queue, function(msg) {
                  console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                }, {
                  noAck: true
                });
              });
            });
          });

    }
}

module.exports = QueueSP;