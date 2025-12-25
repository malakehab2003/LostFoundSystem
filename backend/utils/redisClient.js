import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('ready', () => {
      console.log('Redis client is ready');
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, duration) {
    if (duration) {
      await this.client.set(key, value, { EX: duration });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key) {
    await this.client.del(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;