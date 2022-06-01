import { Object3D } from "three";
import Model from "./models/player.glb";

export default class Player extends Object3D {
    constructor() {
        super();

        Model.then((model) => {
            console.log(model);
            this.add(model.scene);
        });
    }

    render() {}
}
