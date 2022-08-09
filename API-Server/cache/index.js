import Redis from "ioredis";
const host = process.env.NODE_ENV === 'production' ? `charging-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com` : `localhost`
const client = new Redis(6379, host);
// const client = new Redis();
// const client = new Redis();

client.on("connect", function () {
  console.log("Redis Connected!");
});

export default client;
