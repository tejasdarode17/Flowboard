import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {

    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            autoConnect: true,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }


    //autoConnect true hai we dont need this 
    // if (!socket?.connect) {
    //     socket?.connect()
    // }

    return socket;

};


//called connectSocket once after that 
//we can get socket by this fucntion 
//avoid calling connectSocket again and again
//but connectSocket function is creatiing socket if socket does not exist.
//if exist its returning the existing one so no need of this function 
export const getSocket = () => {
    return socket;
}


//socket.io disconnect automatically if user left no need to do any thing on client side or server side
//if we want to explecitly disconnet then this function will be useed  
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
