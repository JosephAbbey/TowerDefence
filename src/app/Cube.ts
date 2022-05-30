import {
    BoxGeometry,
    ColorRepresentation,
    Mesh,
    MeshPhysicalMaterial,
    Vector3,
} from "three";

export default class Cube extends Mesh {
    constructor(position: Vector3, size: Vector3, color: ColorRepresentation) {
        super();

        this.position.add(position);
        this.geometry = new BoxGeometry(size.x, size.y, size.z);
        this.material = new MeshPhysicalMaterial({ color });
    }

    render() {
        this.rotateY(0.01);
    }
}
