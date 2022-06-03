import { Object3D, Vector3 } from "three";
import enemyModel from "./models/enemy.gltf";

export function scalarProjection(position: Vector3, a: Vector3, b: Vector3) {
    a = a.clone();
    b = b.clone();
    let c = position.clone();
    let v = b.sub(a).normalize();
    return v.multiplyScalar(c.sub(a).dot(v)).add(a);
}

export default class Enemy extends Object3D {
    static maxforce = 0.01;
    static maxspeed = 0.1;
    static sight = 20;

    private velocity = new Vector3(-1, 0, 0);
    private acceleration = new Vector3();

    constructor(private readonly path: Vector3[]) {
        super();

        this.path = path;

        this.position.copy(path[0]);
        this.position.add(new Vector3(0, 2, (Math.random() - 0.5) * 16));

        enemyModel.then((model) => {
            this.add(model.scene.clone());
        });
    }

    addForce(v: Vector3) {
        this.acceleration.add(v);
    }

    steer(
        v: Vector3,
        speed: number = Enemy.maxspeed,
        force: number = Enemy.maxforce
    ) {
        return v
            .normalize()
            .multiplyScalar(speed)
            .sub(this.velocity)
            .normalize()
            .multiplyScalar(force);
    }

    seek(target: Vector3, force?: number) {
        return this.steer(target.sub(this.position), undefined, force);
    }

    followPath(path: Vector3[]) {
        var future = this.position
            .clone()
            .sub(new Vector3(0, 2, 0))
            .add(this.velocity.clone().normalize().multiplyScalar(5));

        var sr: Vector3 | null = new Vector3(0, 0, 0);
        var dr = Infinity;
        for (var i = 0; i < path.length - 1; i++) {
            let a = path[i];
            let b = path[i + 1];

            var s = scalarProjection(future, a, b);

            if (
                s.x < Math.min(a.x, b.x) ||
                s.x > Math.max(a.x, b.x) ||
                s.y < Math.min(a.y, b.y) ||
                s.y > Math.max(a.y, b.y) ||
                s.z < Math.min(a.z, b.z) ||
                s.z > Math.max(a.z, b.z)
            ) {
                s = b.clone();
            }

            var d = future.distanceToSquared(s);
            if (d < dr) {
                dr = d;
                sr = s;
            }
        }
        if (sr) {
            return this.seek(
                sr.add(new Vector3(0, 2, 0)),
                Enemy.maxforce * (Math.max(dr - 2, 0) / 50)
            );
        }
    }

    render() {
        var f = this.followPath(this.path);
        if (f) this.addForce(f);

        this.velocity.add(this.acceleration);
        this.velocity.clampLength(0, Enemy.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.multiplyScalar(0);

        if (
            this.position
                .clone()
                .sub(this.path[this.path.length - 1])
                .lengthSq() < 25
        )
            this.visible = false;
        this.lookAt(this.velocity.clone().add(this.position));
    }
}
