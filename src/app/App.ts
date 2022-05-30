import {
    PerspectiveCamera,
    PointLight,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import Cube from "./Cube";

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

    private readonly cube = new Cube(
        new Vector3(0, 0, 0),
        new Vector3(10, 10, 10),
        0xff0000
    );

    private readonly light = new PointLight(0xffffff, 1, 100);

    constructor() {
        this.scene.add(this.cube);
        this.light.position.set(30, 30, 30);
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

        this.cube.render();

        this.renderer.render(this.scene, this.camera);
    }
}
