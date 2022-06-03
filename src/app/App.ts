import {
    DirectionalLight,
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
    readonly camera = new PerspectiveCamera(
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

    private readonly mainPlayer = new Player(this);
    readonly world = new World(tutorial);
    private readonly light = new DirectionalLight(0xffffff, 2);

    constructor() {
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

        this.world.position.copy(this.mainPlayer.pos).multiplyScalar(-1);

        this.renderer.render(this.scene, this.camera);
    }
}
