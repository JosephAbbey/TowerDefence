import { Object3D, Vector3 } from "three";
import WorldOptions from "../../types/world";
import Enemy from "./Enemy";
import Ground from "./Ground";
import Path from "./Path";

export default class World extends Object3D {
    private readonly ground: Ground;
    private readonly path: Path;
    private readonly enemies: Enemy[] = [];

    constructor(options: WorldOptions) {
        super();

        this.ground = new Ground(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100),
            options.ground
        );
        this.add(this.ground);

        this.path = new Path(options.path);
        this.path.position.add(new Vector3(0, 2, 0));
        this.add(this.path);

        for (var i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(this.path.points));
            this.add(this.enemies[i]);
        }
    }

    render() {
        for (var e of this.enemies) e.render();
        this.ground.render();
    }
}
