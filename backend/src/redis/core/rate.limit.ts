import redis from "../client";

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
        current,
        remaining: Math.max(0, limit - current),
        ttl,
        exceeded: current > limit,
    };
}