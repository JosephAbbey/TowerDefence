import {
    Euler,
    Mesh,
    Object3D,
    Raycaster,
    Texture,
    Vector2,
    Vector3,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { io } from "socket.io-client";
import App from "./App";
import Turret, { turrets } from "./Turret";
import World from "./World";
import EmitPromise, { EmitResolver } from "./EmitPromise";
import { CommandMadeAbsolute } from "svg-path-parser";

import playerModel from "./models/player.gltf";
import joseph from "./textures/joseph.jpg";
import will from "./textures/will.jpg";
import sus from "./textures/sus.jpg";
import micah from "./textures/micah.jpg";

const mphue = window.localStorage.getItem("mphue");
var devSkin = window.localStorage.getItem("devSkin");

export function traverse(object: Object3D, callback: (object: Mesh) => any) {
    //@ts-expect-error
    if (object.type === "Mesh") callback(object);
    for (var o of object.children) {
        traverse(o, callback);
    }
}

export default class Player extends Object3D {
    private readonly app: App;

    readonly pos = new Vector3();
    private readonly velocity = new Vector3();
    private readonly acceleration = new Vector3();

    private jumping = false;
    private readonly keysDown = new Set<string>();
    readonly mousePosition = new Vector2();
    private readonly raycaster = new Raycaster();

    private readonly socket = io(
        new URLSearchParams(window.location.search).has("dev")
            ? "http://localhost:3000"
            : "https://towerdefence.herokuapp.com/",
        {
            auth: {
                skin: devSkin || mphue,
            },
        }
    );

    constructor(app: App) {
        super();

        var roomCode = prompt("Room Code:");
        if (roomCode === "idev") {
            devSkin = prompt("Name:") || "";
            window.localStorage.setItem("devSkin", devSkin);
            window.location.reload();
        }
        if (roomCode)
            EmitPromise<string, undefined>(this.socket, "join", roomCode).catch(
                // (e: { message: string }) => alert(e.message)
                (e: { message: string }) =>
                    roomCode
                        ? EmitPromise<
                              {
                                  roomCode: string;
                                  data: {
                                      name: string;
                                      path: CommandMadeAbsolute[];
                                  };
                              },
                              undefined
                          >(this.socket, "create", {
                              roomCode,
                              data: {
                                  name: this.app.world.options.name,
                                  path: this.app.world.options.path,
                              },
                          }).catch((e: { message: string }) => alert(e.message))
                        : alert(e.message)
            );

        var a = Math.random();
        console.log(a);
        EmitPromise<{ message: string }, undefined>(this.socket, "message", {
            message: `number: ${a}`,
        });

        EmitResolver<{ from: string; message: string }, undefined>(
            this.socket,
            "message",
            (message, resolve, reject) => {
                console.log(`${message.from}: ${message.message}`);
                resolve(undefined);
            }
        );

        EmitResolver<
            undefined,
            {
                x: number;
                y: number;
                z: number;
            }
        >(this.socket, "position", (_, resolve, reject) => {
            resolve(this.pos);
        });

        this.app = app;

        this.position.add(new Vector3(0, 1.2));

        var devSkins: { [key: string]: Promise<Texture> } = {
            joseph,
            will,
            sus,
            micah,
        };
        var skin;
        if (typeof devSkin == "string") skin = devSkins[devSkin];

        Promise.all<[Promise<GLTF>, Promise<Texture> | undefined]>([
            playerModel,
            skin,
        ]).then(([model, texture]) => {
            var m = model.scene.clone();
            traverse(m, (o) => {
                //@ts-expect-error
                if (texture) o.material.map.source = texture.source;
                else {
                    var h: number;
                    if (mphue) h = parseFloat(mphue);
                    else
                        window.localStorage.setItem(
                            "mphue",
                            (h = Math.random()).toString()
                        );
                    //@ts-expect-error
                    o.material.color.setHSL(h, 0.5, 0.5);
                }
            });
            this.add(m);
        });

        window.addEventListener("mousemove", (e) => this.onmousemove(e));
        window.addEventListener("mousedown", (e) => this.onmousedown(e));
        window.addEventListener("keydown", (e) => this.onkeydown(e));
        window.addEventListener("keyup", (e) => this.onkeyup(e));
    }

    private onmousemove(e: MouseEvent) {
        this.mousePosition.set(e.clientX, e.clientY);
    }

    get mouseNormalisedPosition() {
        return new Vector2(
            (this.mousePosition.x / window.innerWidth) * 2 - 1,
            -(this.mousePosition.y / window.innerHeight) * 2 + 1
        );
    }

    get mouseWorldPosition(): Vector3 | undefined {
        this.raycaster.setFromCamera(
            this.mouseNormalisedPosition,
            this.app.camera
        );
        return this.raycaster
            .intersectObjects(this.app.world.environment.children)[0]
            ?.point?.sub(this.app.world.position);
    }

    private onmousedown(e: MouseEvent) {
        if (e.button == 2) {
            var p = this.mouseWorldPosition
                ?.divideScalar(100 / World.subDivisions)
                ?.round();
            if (p !== undefined) this.app.world.add(new Turret(turrets.gun, p));
        }
    }

    private onkeydown(e: KeyboardEvent) {
        if (e.repeat) return;
        this.keysDown.add(e.key);
    }

    private onkeyup(e: KeyboardEvent) {
        this.keysDown.delete(e.key);
    }

    render() {
        this.acceleration.add(new Vector3(0, -0.1, 0));

        this.rotation.copy(
            new Euler(
                0,
                (Math.PI / 2) *
                    ((Math.round(
                        this.app.controls.getAzimuthalAngle() / (Math.PI / 2)
                    ) +
                        2) %
                        4),
                0
            )
        );

        var m = new Vector3();
        if (this.keysDown.has("w")) m.add(new Vector3(0, 0, 0.1));
        if (this.keysDown.has("a")) m.add(new Vector3(0.1, 0, 0));
        if (this.keysDown.has("s")) m.add(new Vector3(0, 0, -0.1));
        if (this.keysDown.has("d")) m.add(new Vector3(-0.1, 0));
        m.normalize().multiplyScalar(0.1).applyEuler(this.rotation);

        this.pos.add(m);
        this.rotation.copy(new Euler(0, Math.atan2(m.x, m.z), 0));

        // Quirky Jump Algorithm: Copyright (c) 2022, Joseph and Will
        if (this.pos.y == 0) this.jumping = false;
        if (this.keysDown.has(" ") && !this.jumping) {
            this.jumping = true;
            this.acceleration.add(new Vector3(0, 10.5, 0));
        }

        if (this.keysDown.has("Shift"))
            this.acceleration.add(new Vector3(0, -0.1, 0));

        this.velocity.add(this.acceleration);
        this.pos
            .add(this.velocity)
            .clamp(new Vector3(-50, 0, -50), new Vector3(50, 100, 50));
        this.acceleration.multiplyScalar(0);
    }
}
