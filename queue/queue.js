const amqp = require('amqplib/callback_api');
const json = require('../utils/json-response');

class Queue {
     constructor(msg, queue){
        this.msg= msg; 
        this.queue = queue;
        console.log("constr:: "+this.queue);
     }
    
     send(){
         const msg = this.msg;
         const queue = this.queue;
        amqp.connect('amqp://localhost',  (error0, connection) => {
            if (error0) {
                console.log("Error while connecting at Send "+error0);
            }
            connection.createChannel( (error1, channel) => {
                if (error1) {
                    console.log("Error while craeting channel at Send "+error1);
                }
        
                
                
        
                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(msg));
        
                console.log(" [x] Sent %s", msg);
            });
            setTimeout( () => {
                connection.close();
                process.exit(0);
            }, 500);
        }); 

    }
    

    recieve(){
        const queue = this.queue;
        const msg = this.msg;
        amqp.connect('amqp://localhost',  (error0, connection) => {
           
    if (error0) {
        console.log("error0"+error0);
        console.log("Error while connecting at Recieve "+error0);
    }
    connection.createChannel( (error1, channel) =>{
        if (error1) {
            console.log("error0"+error1);
            console.log("Error while craeting channel at Recieve "+error1);
        }

        

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue,  (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
             });
         });
        });
    }

    


} 

module.exports = Queue;