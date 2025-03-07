const redis = require('redis');

class CacheService {
    constructor() {
        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER || 'localhost',
                port: 6379,
            },
        });

        this._client.on('error', (err) => {
            console.error('Redis Error:', err);
        });

        this._client.connect();
    }

    async set(key, value, expiration = 1800) {
        await this._client.set(key, value, { EX: expiration }); 
    }

    async get(key) {
        return await this._client.get(key);
    }

    async delete(key) {
        await this._client.del(key);
    }
}

module.exports = CacheService;
