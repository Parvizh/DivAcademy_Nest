import { Inject, Injectable } from '@nestjs/common';
import { CacheKeyEnum } from 'src/enum/cache-key.enum';
import { RedisClientType } from 'redis'
import { redisClient } from 'src/constants/redis.constant';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(redisClient) private cache: RedisClientType) { }

    async setCache(key: string, value) {
        const result = await this.cache.set(key, JSON.stringify({ ...value }))

        return result
    }

    async getCacheByKey(key: string) {
        let result = await this.cache.get(key);
        return JSON.parse(result)
    }

    async deleteCacheByKey(key: CacheKeyEnum) {
        await this.cache.del(key);
    }

    async deleteCache() {
        await this.cache.flushAll();

        return { message: 'Deleted succesfully' }
    }
}
