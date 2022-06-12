import * as express from "express";
import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "process";
import EmitPromise, { EmitResolver } from "./EmitPromise";
import path = require("path");

const app = express();
app.set("port", env.PORT || 3000);
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
    );
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
    );
    next();
});

declare var __dirname: string;
app.use(express.static(path.resolve(__dirname, "../../")));

const http = new HTTPServer(app);
const io = new Server(http, {
    cors: {
        origin: ["http://localhost:9000", "http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

class Player {
    room?: Room;

    lastPosition: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    get position(): Promise<{ x: number; y: number; z: number }> {
        return EmitPromise<undefined, { x: number; y: number; z: number }>(
            this.socket,
            "position",
            undefined
        ).then((d) => (this.lastPosition = d[0]));
    }

    skin: string | number;

    constructor(public readonly socket: Socket) {
        console.log(socket.id, "connected");

        this.skin = socket.handshake.auth.skin;

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
                reject({
                    message: `Room '${roomCode}' doesn't exist`,
                });
            } else {
                rooms.get(roomCode)!.join(this);
                console.log(this.socket.id, "joined room", roomCode);
                resolve(undefined);
            }
        });

        this.on<string, undefined>("create", (roomCode, resolve, reject) => {
            if (rooms.has(roomCode)) {
                reject({
                    message: `Room '${roomCode}' already exists`,
                });
            } else {
                rooms.set(roomCode, new Room(roomCode, this));
                rooms.get(roomCode)!.join(this);
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
    readonly players = new Set<Player>();

    constructor(public readonly roomCode: string, public owner: Player) {
        console.log(owner.socket.id, "created room", roomCode);
    }

    add(player: Player) {
        this.players.add(player);
        if (this.players.size == 0) this.owner = player;
    }

    join(player: Player) {
        this.add(player);
        player.socket.join(this.roomCode);
        player.room = this;
    }

    to(from: Player) {
        return from.socket.to(this.roomCode);
    }
}

const players = new Map<string, Player>();

const rooms = new Map<string, Room>();

io.on("connection", (socket: Socket) => {
    players.set(socket.id, new Player(socket));
});

http.listen(env.PORT || 3000, function () {
    console.log(`listening on *:${env.PORT || 3000}`);
});
