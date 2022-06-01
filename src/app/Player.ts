import {
    BoxGeometry,
    Camera,
    Color,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Scene,
} from "three";
import { OrbitControls } from "@three-ts/orbit-controls";

export default class Player extends Object3D {
    controls?: OrbitControls;

    constructor(color: number, controls?: OrbitControls) {
        super();

        this.controls = controls;

        this.add(
            new Mesh(
                new BoxGeometry(1, 1, 1),
                new MeshBasicMaterial({
                    color: new Color().setHSL(color, 1, 0.5),
                })
            )
        );
    }

    render() {
        if (this.controls) {
            this.position.copy(this.controls.target);
        }
    }
}

export class MainPlayer extends OrbitControls {
    player = new Player(
        parseFloat(localStorage.getItem("mphue") || "") ||
            (() => {
                var a: number;
                localStorage.setItem("mphue", (a = Math.random()).toString());
                return a;
            })(),
        this
    );
    constructor(camera: Camera, scene: Scene, domElement: HTMLElement) {
        super(camera, domElement);

        scene.add(this.player);
    }

    render() {
        this.player.render();
    }
}
