import * as express from "express";
import { Server } from "socket.io";
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

io.on("connection", function (socket: any) {
    console.log("a user connected");
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});
