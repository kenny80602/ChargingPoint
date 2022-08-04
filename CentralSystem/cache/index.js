import Redis from "ioredis";



const redis = new Redis(6379, "charging-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com");

//const result = await redis.set("mykey", "abc123"); // Returns a promise which resolves to "OK" when the command succeeds.

redis.on("connect", function () {
    console.log("Redis Connected!");
  });


export default redis;
