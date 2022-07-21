import handyRedis from "handy-redis";
const client = handyRedis.createNodeRedisClient("centralsystem-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com 6379");

client.nodeRedis.on('connect',function(){
    console.log('Redis Connected!');

});

export default  client;