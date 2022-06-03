/* eslint-disable no-undef */
const { stringify } = require("./world-loader");

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

const WorldOptionsResolutions = (module.exports.WorldOptionsResolutions = {
    range: (l, f) => f,
});
