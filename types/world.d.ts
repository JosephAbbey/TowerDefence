import { Texture } from "three";

export interface WorldFile {
    $schema: string;
    name: string;
    /**
     * The path to texture to apply to the ground.
     * @default "./src/app/textures/defaults/ground.jpg"
     * @pattern ^.*\.(png|jpg)$
     **/
    ground: string;
}

export default interface WorldOptions {
    name: string;
    ground: Promise<Texture>;
}
