import {
    BoxGeometry,
    Mesh,
    MeshPhysicalMaterial,
    Object3D,
    Vector3,
} from "three";

export default class Turret extends Object3D {
    constructor(position: Vector3) {
        super();

        this.position.copy(position);

        this.add(
            new Mesh(
                new BoxGeometry(1, 2, 1),
                new MeshPhysicalMaterial({ color: 0x00ff00 })
            )
        );
    }
}
