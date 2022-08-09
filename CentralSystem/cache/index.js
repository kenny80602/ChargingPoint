import Redis from "ioredis";

const host = process.env.NODE_ENV === 'production' ? 'charging-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com' : 'localhost'

const redis = new Redis(6379, host);

//const result = await redis.set("mykey", "abc123"); // Returns a promise which resolves to "OK" when the command succeeds.

redis.on("connect", function () {
    console.log("Redis Connected!");
  });


export default redis;
