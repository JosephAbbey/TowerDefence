import * as express from "express";
import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "process";

const app = express();
app.set("port", env.PORT || 3000);

const http = new HTTPServer(app);
const io = new Server(http, {
    cors: {
        origin: ["http://localhost:9000", "https://josephabbey.github.io"],
    },
});

class Player {
    constructor(public readonly socket: Socket) {
        console.log(socket.id, "connected");

        this.on("disconnect", function () {
            players.delete(socket.id);
            console.log(socket.id, "disconnected");
        });
        this.on("join", this.join.bind(this));
        this.on("message", this.message.bind(this));
    }

    on(event: string, callback: (...args: any[]) => any) {
        this.socket.on(event, callback);
    }

    join(roomCode: string) {
        if (this.socket.rooms.has(roomCode)) {
            this.socket.emit("error", {
                message: `You are already in room '${roomCode}'`,
            });
            return;
        }
        if (!rooms.has(roomCode)) {
            this.socket.emit("error", {
                message: `Room '${roomCode}' doesn't exist`,
            });
            return;
        }
        this.socket.join(roomCode);
        rooms.get(roomCode)!.players.add(this.socket.id);
        console.log(this.socket.id, "joined room", roomCode);
    }

    message(message: { to?: string; message: string }) {
        if (message.to) {
            this.socket.to(message.to).emit("message", message.message);
        } else {
            this.socket.to([...this.socket.rooms]).emit("message", {
                from: this.socket.id,
                message: message.message,
            });
            console.log(
                this.socket.id,
                "broadcasted",
                `"${message.message}"`,
                "in",
                [...this.socket.rooms]
            );
        }
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

http.listen(3000, function () {
    console.log("listening on *:3000");
});
