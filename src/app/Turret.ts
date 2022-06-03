import {
    BoxGeometry,
    Mesh,
    MeshPhysicalMaterial,
    Object3D,
    Vector3,
} from "three";
import World from "./World";

export default class Turret extends Object3D {
    constructor(private readonly gridPosition: Vector3) {
        super();

        this.position
            .copy(gridPosition.multiplyScalar(100 / World.subDivisions))
            .add(new Vector3(0, 2, 0));

        this.add(
            new Mesh(
                new BoxGeometry(2, 4, 2),
                new MeshPhysicalMaterial({ color: 0x00ff00 })
            )
        );
    }
}
