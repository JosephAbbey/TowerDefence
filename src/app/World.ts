import { Object3D, Vector3 } from "three";
import WorldOptions from "../../types/world";
import Ground from "./Ground";

export default class World extends Object3D {
    private readonly ground: Ground;

    constructor(options: WorldOptions) {
        super();

        this.ground = new Ground(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100),
            options.ground
        );
        this.add(this.ground);
    }

    render() {
        this.ground.render();
    }
}
