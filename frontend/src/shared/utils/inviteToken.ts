const KEY = "flowboard_invite";
export const inviteToken = {
    set: (token: string) => sessionStorage.setItem(KEY, token),
    get: () => sessionStorage.getItem(KEY),
    clear: () => sessionStorage.removeItem(KEY),
};