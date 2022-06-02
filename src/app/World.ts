import { Object3D, Vector3 } from "three";
import WorldOptions from "../../types/world";
import Ground from "./Ground";
import Path from "./Path";

export default class World extends Object3D {
    private readonly ground: Ground;
    private readonly path: Path;

    constructor(options: WorldOptions) {
        super();

        console.log(options);

        this.ground = new Ground(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100),
            options.ground
        );
        this.add(this.ground);

        this.path = new Path(options.path);
        this.path.position.add(new Vector3(0, 2, 0));
        this.add(this.path);
    }

    render() {
        this.ground.render();
    }
}
