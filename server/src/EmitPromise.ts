import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

var id = -1;

export default async function EmitPromise<D, T>(
    socket: Socket,
    event: string,
    data: D,
    room?: BroadcastOperator<DefaultEventsMap, any>
) {
    var i = (id++).toString(36);
    (room || socket.broadcast).emit(event, data, i);
    // the message promise is never resolved by the client
    return Promise.all(
        [...(await (room || socket.broadcast).allSockets())].map(
            (j) =>
                new Promise<T>((resolve, reject) => {
                    socket.on("resolve" + i, (d, u) =>
                        u === j ? resolve(d) : undefined
                    );
                    socket.on("reject" + i, (e, u) =>
                        u === j ? reject(e) : undefined
                    );
                })
        )
    );
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
            (value: T | PromiseLike<T>) => socket.emit("resolve" + i, value),
            (reason?: any) => socket.emit("reject" + i, reason)
        )
    );
}
