import { CommandMadeAbsolute } from "svg-path-parser";
import {
    BufferGeometry,
    CubicBezierCurve3,
    Line,
    LineBasicMaterial,
    Material,
    Object3D,
    QuadraticBezierCurve3,
    Vector3,
} from "three";

export default class Path extends Object3D {
    readonly points: Vector3[] = [];

    constructor(path: CommandMadeAbsolute[], material?: Material) {
        super();

        material = material || new LineBasicMaterial({ color: 0xffffff });

        for (var command of path) {
            switch (command.command) {
                // case "moveto":
                //     (x = command.x), (y = command.y);
                //     break;
                case "lineto":
                case "horizontal lineto":
                case "vertical lineto":
                    this.points = this.points.concat([
                        new Vector3(command.x0, 0, command.y0),
                        new Vector3(command.x, 0, command.y),
                    ]);
                    break;
                case "quadratic curveto":
                    this.points = this.points.concat(
                        new QuadraticBezierCurve3(
                            new Vector3(command.x0, 0, command.y0),
                            new Vector3(command.x1, 0, command.y1),
                            new Vector3(command.x, 0, command.y)
                        ).getPoints(50)
                    );
                    break;
                case "curveto":
                    this.points = this.points.concat(
                        new CubicBezierCurve3(
                            new Vector3(command.x0, 0, command.y0),
                            new Vector3(command.x1, 0, command.y1),
                            new Vector3(command.x2, 0, command.y2),
                            new Vector3(command.x, 0, command.y)
                        ).getPoints(50)
                    );
                    break;
                case "smooth curveto":
                case "smooth quadratic curveto":
                case "elliptical arc":
                    throw new Error("Not implemented");
            }
        }

        this.add(
            new Line(new BufferGeometry().setFromPoints(this.points), material)
        );
    }
}
