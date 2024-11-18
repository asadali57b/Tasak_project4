const amqp=require('amqplib');
const express=require('express');
const { v4: uuidv4 } = require('uuid');
const logger=require('./logger/index');

const app=express();
const port=5672;
app.use(express.json());

async function createRpcClient(){
    const connection=await amqp.connect('amqp://localhost');
    const channel=await connection.createChannel();
    const q=await channel.assertQueue("Response_Queue",{exclusive:true});

    const callbackQueue=q.queue;
    let response=null;
    let correlationId=null;

    channel.consume(callbackQueue,(msg)=>{
        if(msg.properties.correlationId==correlationId){
            console.log("Received response:",msg.content.toString());
            response=msg.content.toString();
        }
    },
    {noack:true}
);
   
const rpcCall=async (message,timeout=5000)=>{
    correlationId=uuidv4();
    channel.sendToQueue("Request_Queue",Buffer.from(message),{
        correlationId:correlationId,
        replyTo:callbackQueue
    });
    const start=Date.now();
    while(response==null && Date.now()-start<timeout){
        await new Promise((resolve)=>setTimeout(resolve,50));

        if(Date.now()-start>timeout){
            response="Request timed out";
        }
    }
    return response;
};

return{
    rpcCall
};
    }
    app.post("/order", async (req, res) => {
        const message = req.body;
      
        const rpcClient = await createRpcClient();
        const result = await rpcClient.rpcCall(message);
        logger.info(result);
        res.send(`RPC Response: ${result}`);
      });
      
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
      });
      
app.post("/order",async(req,res)=>{
    const message=req.body;
    const rpcClient=await createRpcClient();
    const result=await rpcClient.rpcCall(message);
    logger.info(result);
    res.send(`RPC Response: ${result}`);
});
app.listen(port,()=>console.log(`Server running at http://localhost:${port}/`));