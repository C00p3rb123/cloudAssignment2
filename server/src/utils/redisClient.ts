import * as redis from "redis";
const redisOptions = {
  socket: {
    host: process.env.REDIS_URL,
    port: 6379,
  },
};
const redisClient = redis.createClient(redisOptions);

export const initClient = async () => redisClient.connect();

export const setRedis = async (key: string, value: any) => {
  redisClient.setEx(
    key,
    3600,
    JSON.stringify({ source: "Redis Cache", value })
  );
};

export const getRedis = async (key: string) => {
  const redisKey = `${key}`;
  const result = await redisClient.get(redisKey);
  if (!result) {
    return;
  }
  const resultJSON = JSON.parse(result);
  return resultJSON;
};
