let handleEvent = (ms,channel) => {
    let content= JSON.parse(msg.content.toString());
    switch(content.type){
        case "CREATE_ORDER":
            let response= `Order created for ${content.name}`;
            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(response.toString()),
                {correlationId: msg.properties.correlationId});
            }
    }
    module.exports = handleEvent;