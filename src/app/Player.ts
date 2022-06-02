import { Euler, Object3D, Vector3 } from "three";
import Model from "./models/player.gltf";

export default class Player extends Object3D {
    readonly pos = new Vector3();
    private readonly velocity = new Vector3();
    private readonly acceleration = new Vector3();

    private jumping = false;

    private readonly keysDown = new Set<string>();

    constructor() {
        super();

        this.position.add(new Vector3(0, 1.2));

        Model.then((model) => {
            this.add(model.scene);
        });

        window.addEventListener("keydown", (e) => this.onkeydown(e));
        window.addEventListener("keyup", (e) => this.onkeyup(e));
    }

    private onkeydown(e: KeyboardEvent) {
        this.keysDown.add(e.key);
        switch (e.key) {
            case "w":
                this.rotation.copy(new Euler(0, -Math.PI / 2, 0));
                break;
            case "a":
                this.rotation.copy(new Euler(0, 0, 0));
                break;
            case "s":
                this.rotation.copy(new Euler(0, Math.PI / 2, 0));
                break;
            case "d":
                this.rotation.copy(new Euler(0, Math.PI, 0));
                break;
        }
    }

    private onkeyup(e: KeyboardEvent) {
        this.keysDown.delete(e.key);
    }

    render() {
        this.acceleration.add(new Vector3(0, -0.1, 0));

        if (this.keysDown.has("w")) this.pos.add(new Vector3(-0.1, 0, 0));

        if (this.keysDown.has("a")) this.pos.add(new Vector3(0, 0, 0.1));

        if (this.keysDown.has("s")) this.pos.add(new Vector3(0.1, 0, 0));

        if (this.keysDown.has("d")) this.pos.add(new Vector3(0, 0, -0.1));

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
