const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

console.log("Using Redis URL:", REDIS_URL);

const client = redis.createClient({ url: REDIS_URL });

client.on("connect", () => console.log("🔌 Redis connected"));
client.on("error", err => console.error("❌ Redis error", err));

(async () => {
  await client.connect();
})();

module.exports = client;
