import redis from "../client";



export async function setCache(key: string, value: unknown, ttl?: number) {
    const data = JSON.stringify(value);
    if (ttl) {
        await redis.set(key, data, "EX", ttl);
    } else {
        await redis.set(key, data);
    }
}

export async function getCache<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    try {
        return JSON.parse(data) as T;
    } catch {
        return null;
    }
}


export async function updateCache<T>(key: string, value: T) {
    const ttl = await redis.ttl(key);
    if (ttl <= 0) return false;
    await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        ttl
    );
    return true;
}


export async function deleteCache(key: string) {
    await redis.del(key);
}
