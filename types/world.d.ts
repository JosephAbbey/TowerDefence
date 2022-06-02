import { Texture } from "three";

export interface WorldFile {
    $schema: string;
    /**
     * The name of the world.
     **/
    name: string;
    /**
     * The path to texture to apply to the ground.
     * @default "./src/app/textures/defaults/ground.jpg"
     * @pattern ^.*\.(png|jpg)$
     **/
    ground: string;
    /**
     * The path to texture to apply to the ground.
     * @pattern (?i)^m(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(([ml](\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))|([hv](\s?-?((\d+(\.\d+)?)|(\.\d+))))|(c(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){5})|(q(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){3}(\s?t?(\s?-?((\d+(\.\d+)?)|(\.\d+)))[,\s]?(-?((\d+(\.\d+)?)|(\.\d+))))*)|(a(\s?-?((\d+(\.\d+)?)|(\.\d+)))([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}[,\s]?[01][,\s]+[01][,\s]+([,\s]?(-?((\d+(\.\d+)?)|(\.\d+)))){2}))[,\s]?)+z$
     **/
    path: string;
}

export default interface WorldOptions {
    name: string;
    ground: Promise<Texture>;
    path: import("svg-path-parser").CommandMadeAbsolute[];
}
