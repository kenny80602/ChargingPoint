import Redis from "ioredis";

const client = new Redis(6379, "charging-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com");
// const client = new Redis();

client.on("connect", function () {
  console.log("Redis Connected!");
});

export default client;
