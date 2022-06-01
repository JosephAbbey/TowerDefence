import {
    Mesh,
    MeshPhysicalMaterial,
    PlaneGeometry,
    Texture,
    Vector3,
} from "three";

export default class Ground extends Mesh {
    constructor(position: Vector3, size: Vector3, texture: Promise<Texture>) {
        super();

        this.position.add(position);
        this.geometry = new PlaneGeometry(size.x, size.y, size.z);
        texture.then((map) => {
            this.material = new MeshPhysicalMaterial({ map });
        });
        this.rotateX(-Math.PI / 2);
    }

    render() {}
}
