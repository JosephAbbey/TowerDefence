import {
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { MainPlayer } from "./Player";
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

    private readonly world = new World(tutorial);
    private readonly light = new DirectionalLight(0xffffff, 1);

    private readonly mainPlayer = new MainPlayer(
        this.camera,
        this.scene,
        this.renderer.domElement
    );

    constructor() {
        this.scene.add(this.world);

        this.light.position.set(30, 30, 30);
        this.light.lookAt(new Vector3(0, 0, 0));
        this.scene.add(this.light);

        this.camera.position.set(100, 100, 0);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(0x000000);

        window.addEventListener("resize", () => this.adjustCanvasSize());
        this.render();
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        requestAnimationFrame(() => this.render());

        this.world.render();
        this.mainPlayer.render();

        this.renderer.render(this.scene, this.camera);
    }
}
