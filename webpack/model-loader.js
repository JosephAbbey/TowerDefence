/* eslint-disable no-undef */
const { readFileSync } = require("fs");
const path = require("path");

module.exports = function (source) {
    return `const{GLTFLoader}=require("three/examples/jsm/loaders/GLTFLoader");module.exports.default=${loadModel(
        this,
        this.resourcePath,
        source
    )};`;
};

const loadModel = (module.exports.loadModel = function (loader, file, source) {
    if (source === undefined)
        source = readFileSync(path.resolve("./src/app/", file));

    const filename = path.basename(file);
    loader.emitFile(filename, source, null, { sourceFilename: filename });

    return `new Promise((resolve,reject)=>new GLTFLoader().load("dist/${filename}",resolve,undefined,reject))`;
});

module.exports.raw = true;
