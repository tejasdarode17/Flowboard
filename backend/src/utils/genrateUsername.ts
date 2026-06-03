import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export function generateUsername(base: string) {
    const clean = base.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "user";
    return `${clean}_${nanoid()}`;
};


