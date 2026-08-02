const Redis = require('ioredis');

// Redis client singleton
let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected');
    });
  }
  
  return redisClient;
}

// Cache wrapper for feed queries
async function getCachedFeed(key, fetchFunction, ttl = 300) {
  try {
    const redis = getRedisClient();
    
    // Try to get from cache
    const cached = await redis.get(key);
    if (cached) {
      console.log('✓ Cache hit:', key);
      return JSON.parse(cached);
    }
    
    // Cache miss - fetch from database
    console.log('✗ Cache miss:', key);
    const data = await fetchFunction();
    
    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return data;
  } catch (err) {
    console.error('Cache error:', err.message);
    // Fallback to direct query if Redis fails
    return await fetchFunction();
  }
}

// Invalidate cache for specific patterns
async function invalidateCache(pattern) {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`✓ Invalidated ${keys.length} cache keys`);
    }
  } catch (err) {
    console.error('Cache invalidation error:', err.message);
  }
}

// Cache individual post
async function cachePost(postId, data, ttl = 600) {
  try {
    const redis = getRedisClient();
    await redis.setex(`post:${postId}`, ttl, JSON.stringify(data));
  } catch (err) {
    console.error('Post cache error:', err.message);
  }
}

// Get cached post
async function getCachedPost(postId) {
  try {
    const redis = getRedisClient();
    const cached = await redis.get(`post:${postId}`);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('Get cached post error:', err.message);
    return null;
  }
}

module.exports = {
  getRedisClient,
  getCachedFeed,
  invalidateCache,
  cachePost,
  getCachedPost
};
