import { Object3D, Vector3 } from "three";
import WorldOptions from "../../types/world";
import Enemy from "./Enemy";
import Ground from "./Ground";
import Path from "./Path";
import Turret from "./Turret";

export default class World extends Object3D {
    readonly environment = new Object3D();
    private readonly ground: Ground;
    private readonly turrets: (Turret | null)[][][] = Array(~~(100 / 5)).map(
        () => Array(~~(100 / 5)).map(() => Array(~~(100 / 5)).map(() => null))
    );
    private readonly path: Path;
    private readonly enemies: Enemy[] = [];

    constructor(options: WorldOptions) {
        super();

        this.add(this.environment);

        this.ground = new Ground(
            new Vector3(0, 0, 0),
            new Vector3(100, 100, 100),
            options.ground
        );
        this.environment.add(this.ground);

        this.path = new Path(options.path);
        this.path.position.add(new Vector3(0, 2, 0));
        this.add(this.path);

        for (var i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(this.path.points));
            this.add(this.enemies[i]);
        }
    }

    addTurret(gridPosition: Vector3) {
        const turret = new Turret(gridPosition);
        if (!this.turrets[gridPosition.x][gridPosition.y][gridPosition.z])
            this.turrets[gridPosition.x][gridPosition.y][gridPosition.z] =
                turret;
        this.add(turret);
    }

    render() {
        for (var e of this.enemies) e.render();
        this.ground.render();
    }
}
