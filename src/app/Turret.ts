import {
    BoxGeometry,
    Mesh,
    MeshPhysicalMaterial,
    Object3D,
    Vector3,
} from "three";
import TurretOptions from "../../types/turret";
import World from "./World";

import gun from "./turrets/0.turret";
export const turrets = {
    gun,
};

export default class Turret extends Object3D {
    private readonly range: number;

    constructor(
        options: TurretOptions,
        private readonly gridPosition: Vector3
    ) {
        super();

        this.range = options.range;

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
