const amqp=require('amqplib');
const  handleEvent=require('./event');
const { console } = require('inspector');

const startRpcServer=async()=>{
    const connection=await amqp.connect('amqp://localhost');
    const channel=await connection.createChannel();
    const queue="rpc_queue";
    channel.assertQueue(queue,{durable:false});
    channel.prefetch(1);

    console.log("waiting Rpc requests");
    channel.consume(queue,async(msg)=>{
        const content=JSON.parse(msg.content.toString());
        console.log("Received request:",content);
        handleEvent(msg,channel);
        channel.ack(msg);
    });
}

startRpcServer().catch(console.warn);    