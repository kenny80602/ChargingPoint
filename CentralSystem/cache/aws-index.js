import Redis from "ioredis";



const redis = new Redis(6379, "charging-redis.gxsri4.ng.0001.apne1.cache.amazonaws.com");

const result = await redis.set("mykey", "abc123"); // Returns a promise which resolves to "OK" when the command succeeds.

console.log('redis set result: ', result);
// ioredis supports the node.js callback style
redis.get("mykey", (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('mykey value: ', result); // Prints "value"
  }
});







// client.on("connect", function () {
//   console.log("Redis Connected!");
// });

export default redis;
