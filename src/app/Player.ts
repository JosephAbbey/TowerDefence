import { Object3D } from "three";
import Model from "./models/player.gltf";

export default class Player extends Object3D {
    constructor() {
        super();

        Model.then((model) => {
            this.add(model.scene);
        });
    }

    render() {}
}
