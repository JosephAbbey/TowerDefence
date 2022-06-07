import { Socket } from "socket.io-client";

var id = -1;

export default function EmitPromise<D, T>(
    socket: Socket,
    event: string,
    data: D
) {
    var i = (id++).toString(36);
    socket.emit(event, data, i);
    return new Promise<T>((resolve, reject) => {
        socket.on("resolve" + i, (d) => resolve(d));
        socket.on("reject" + i, (e) => reject(e));
    });
}

export function EmitResolver<D, T>(
    socket: Socket,
    event: string,
    resolve: (
        data: D,
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    ) => void
) {
    socket.on(event, (data: D, i: string) =>
        resolve(
            data,
            (value: T | PromiseLike<T>) =>
                socket.emit("resolve" + i, value, socket.id),
            (reason?: any) => socket.emit("reject" + i, reason, socket.id)
        )
    );
}
