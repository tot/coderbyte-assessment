import { createHash } from "crypto";
import { redis } from "~/server/redis";
import { CACHE_TTL, VALIDITY_THRESHOLD } from "./constants";

const generateKey = (keywords: string): string => {
  const hash = createHash("sha256");
  hash.update(keywords);
  return hash.digest("hex");
};

const isValidData = async (cacheKey: string) => {
  const remainingTime = await redis.ttl(cacheKey);

  // If the key doesn't exist or has no TTL, it's invalid
  if (remainingTime === -2 || remainingTime === -1) return false;

  // Calculate the seconds elapsed since the data was added
  const ttlSeconds = CACHE_TTL;
  const elapsedSeconds = ttlSeconds - remainingTime;

  // Set a threshold for considering the data valid (valid if 5 seconds before expiration)
  const validityThreshold = VALIDITY_THRESHOLD;

  // Compare the elapsed time with the threshold
  return elapsedSeconds < validityThreshold;
};

export { generateKey, isValidData };
