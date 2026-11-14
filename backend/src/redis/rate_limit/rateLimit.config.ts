import redis from "../core/client";

// export async function incrementRateLimit(key: string, windowSeconds: number) {
//     const count = await redis.incr(key);

//     //setup a ttl on first req
//     if (count === 1) {
//         await redis.expire(key, windowSeconds);
//     }

//     return count;
// }

//above function is not atomic so we used lua scripts.
//we can also use MULTI / EXEC. but we cannot give conditions inside that like if count === 1 then.

// below are syntax of lua scripts
// let || const = local 
// {} == then and end 

export async function incrementRateLimit(key: string, windowSeconds: number) {

    const count = await redis.eval(`
    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return count `,
        1,
        key,
        windowSeconds
    );

    return Number(count);
}


export async function getRateLimitCount(key: string) {
    const count = await redis.get(key);
    return Number(count ?? 0);
}


export async function resetRateLimit(key: string) {
    await redis.del(key);
}




