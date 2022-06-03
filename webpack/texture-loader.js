/* eslint-disable no-undef */
const { readFileSync } = require("fs");
const path = require("path");

module.exports = function (source) {
    return `const{TextureLoader}=require("three");module.exports.default=${loadTexture(
        this,
        this.resourcePath,
        source
    )};`;
};

const loadTexture = (module.exports.loadTexture = function (
    loader,
    file,
    source
) {
    if (source === undefined) source = readFileSync(file);

    const filename = path.basename(file);
    loader.emitFile(filename, source, null, { sourceFilename: filename });

    return `new Promise((r,x)=>new TextureLoader().load("dist/${filename}",r,undefined,x))`;
});

module.exports.raw = true;
