import redis from "../client";

export async function incrementRateLimit(key: string, windowSeconds: number) {
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, windowSeconds);
    }

    return count;
}


export async function getRateLimitCount(key: string) {
    const count = await redis.get(key);
    return Number(count ?? 0);
}

export async function resetRateLimit(key: string) {
    await redis.del(key);
}


