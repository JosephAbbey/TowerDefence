import {
    DirectionalLight,
    Euler,
    HemisphereLight,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Player from "./Player";
import World from "./World";

import tutorial from "./worlds/0.world";

export default class App {
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(
        45,
        innerWidth / innerHeight,
        0.1,
        10000
    );
    private readonly renderer = new WebGLRenderer({
        antialias: true,
        canvas: document.getElementById("main-canvas") as HTMLCanvasElement,
    });
    private readonly controls = new OrbitControls(
        this.camera,
        this.renderer.domElement
    );

    private readonly mainPlayer = new Player();
    private readonly world = new World(tutorial);
    private readonly light = new DirectionalLight(0xffffff, 2);

    private readonly keysDown = new Set<string>();

    constructor() {
        this.mainPlayer.position.add(new Vector3(0, 1.2));
        this.scene.add(this.mainPlayer);

        this.scene.add(this.world);

        this.light.position.set(50, 70, 0);
        this.light.lookAt(new Vector3(0, 0, 0));
        this.scene.add(this.light);
        this.scene.add(new HemisphereLight(undefined, undefined, 0.3));

        this.controls.enablePan = false;

        this.camera.position.set(100, 100, 0);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(0x000000);

        window.addEventListener("resize", () => this.adjustCanvasSize());
        window.addEventListener("keydown", (e) => this.onkeydown(e));
        window.addEventListener("keyup", (e) => this.onkeyup(e));
        this.render();
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private onkeydown(e: KeyboardEvent) {
        this.keysDown.add(e.key);
        switch (e.key) {
            case "w":
                this.mainPlayer.rotation.copy(new Euler(0, -Math.PI / 2, 0));
                break;
            case "a":
                this.mainPlayer.rotation.copy(new Euler(0, 0, 0));
                break;
            case "s":
                this.mainPlayer.rotation.copy(new Euler(0, Math.PI / 2, 0));
                break;
            case "d":
                this.mainPlayer.rotation.copy(new Euler(0, Math.PI, 0));
                break;
        }
    }

    private onkeyup(e: KeyboardEvent) {
        this.keysDown.delete(e.key);
    }

    private render() {
        requestAnimationFrame(() => this.render());

        if (this.keysDown.has("w")) {
            this.world.position.add(new Vector3(0.1, 0, 0));
        }
        if (this.keysDown.has("a")) {
            this.world.position.add(new Vector3(0, 0, -0.1));
        }
        if (this.keysDown.has("s")) {
            this.world.position.add(new Vector3(-0.1, 0, 0));
        }
        if (this.keysDown.has("d")) {
            this.world.position.add(new Vector3(0, 0, 0.1));
        }

        this.world.render();
        this.mainPlayer.render();

        this.renderer.render(this.scene, this.camera);
    }
}
