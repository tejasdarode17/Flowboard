type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export function getStrength(password: string): { score: StrengthLevel; label: string; color: string } {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password?.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: "", color: "" },
        { label: "Weak", color: "bg-red-400" },
        { label: "Fair", color: "bg-amber-400" },
        { label: "Good", color: "bg-blue-400" },
        { label: "Strong", color: "bg-emerald-500" },
    ];
    return { score: score as StrengthLevel, ...levels[score] };
}


// array indexing is used here like score is 3 then good will selcted