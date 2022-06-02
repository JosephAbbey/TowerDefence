/* eslint-disable no-undef */
const { loadTexture } = require("./texture-loader");
const { parseSVG: path, makeAbsolute } = require("svg-path-parser");

module.exports = function (source) {
    const output = {};

    for (const [key, value] of Object.entries(JSON.parse(source))) {
        if (key != "$schema")
            output[key] = WorldOptionsResolutions[key]?.(this, value);
    }

    return `const{TextureLoader}=require("three");module.exports.default=${stringify(
        output
    )};`;
};

const stringify = (module.exports.stringify = function (object) {
    var output = "";

    if (object instanceof Array) output += "[";
    else output += "{";

    for (const [key, value] of Object.entries(object)) {
        if (value === undefined) continue;
        output += `"${key}":`;
        if (value instanceof Object) output += stringify(value);
        else output += value.toString();
        output += ",";
    }

    output = output.substring(0, output.length - 1);

    if (object instanceof Array) output += "]";
    else output += "}";

    return output;
});

const WorldOptionsResolutions = (module.exports.WorldOptionsResolutions = {
    name: (l, f) => `"${f}"`,
    ground: loadTexture,
    path: (l, f) => JSON.stringify(makeAbsolute(path(f))),
});
