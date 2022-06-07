import * as express from "express";
import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "process";
import EmitPromise, { EmitResolver } from "./EmitPromise";

const app = express();
app.set("port", env.PORT || 3000);
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

const http = new HTTPServer(app);
const io = new Server(http, {
    cors: {
        origin: ["http://localhost:9000", "https://josephabbey.github.io"],
        methods: ["GET", "POST"],
    },
});

class Player {
    constructor(public readonly socket: Socket) {
        console.log(socket.id, "connected");

        this.on<undefined, undefined>("disconnect", (_, resolve, reject) => {
            players.delete(socket.id);
            console.log(socket.id, "disconnected");
            resolve(undefined);
        });

        this.on<string, undefined>("join", (roomCode, resolve, reject) => {
            if (this.socket.rooms.has(roomCode)) {
                reject({
                    message: `You are already in room '${roomCode}'`,
                });
            } else if (!rooms.has(roomCode)) {
                //TODO: remove this test code and make a create room button
                this.socket.join(roomCode);
                reject({
                    message: `Room '${roomCode}' doesn't exist`,
                });
            } else {
                this.socket.join(roomCode);
                rooms.get(roomCode)!.players.add(this.socket.id);
                console.log(this.socket.id, "joined room", roomCode);
                resolve(undefined);
            }
        });

        this.on<{ to?: string; message: string }, undefined>(
            "message",
            (message, resolve, reject) => {
                if (message.to) {
                    EmitPromise<{ from: string; message: string }, undefined>(
                        this.socket,
                        "message",
                        {
                            from: this.socket.id,
                            message: message.message,
                        },
                        this.socket.to(message.to)
                    ).then(() => {
                        console.log(
                            this.socket.id,
                            "sent",
                            `"${message.message}"`,
                            "to",
                            message.to
                        );
                        resolve(undefined);
                    });
                } else {
                    EmitPromise<{ from: string; message: string }, undefined>(
                        this.socket,
                        "message",
                        {
                            from: this.socket.id,
                            message: message.message,
                        },
                        this.socket.to([...this.socket.rooms])
                    )
                        .then(() => {
                            console.log(
                                this.socket.id,
                                "broadcasted",
                                `"${message.message}"`,
                                "in",
                                [...this.socket.rooms]
                            );
                            resolve(undefined);
                        })
                        .catch(console.log);
                }
            }
        );
    }

    on<D, T>(
        event: string,
        callback: (
            data: D,
            resolve: (value: T | PromiseLike<T>) => void,
            reject: (reason?: any) => void
        ) => void
    ) {
        EmitResolver<D, T>(this.socket, event, callback);
    }
}

class Room {
    readonly players = new Set<string>();
}

const players = new Map<string, Player>();

const rooms = new Map<string, Room>();

io.on("connection", (socket: Socket) => {
    players.set(socket.id, new Player(socket));
});

io.of("/").adapter.on("create-room", (room) => {
    if (!players.has(room)) {
        var r = new Room();
        rooms.set(room, r);
        r.players.add(room);
        console.log(`room ${room} was created`);
    }
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});
