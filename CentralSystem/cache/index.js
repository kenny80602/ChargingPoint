import handyRedis from "handy-redis";
const env = process.env.NODE_ENV
const host = env === 'production' ? 'centralsystem-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com' : 'localhost'
const client = handyRedis.createNodeRedisClient({
    host: host,
    port: 6379
});

client.nodeRedis.on('connect',function(){
    console.log('Redis Connected!');

});

client.nodeRedis.on('error',function(){
    console.log('Redis Connect Failed!');
});

export default  client;