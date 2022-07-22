import handyRedis from "handy-redis";
const client = handyRedis.createNodeRedisClient({
    
});

client.nodeRedis.on('connect',function(){
    console.log('Redis Connected!');

});

export default  client;
