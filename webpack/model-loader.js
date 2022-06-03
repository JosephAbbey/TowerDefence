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
    var p = path.dirname(file);
    if (source === undefined) source = readFileSync(file);

    if (file.endsWith(".gltf")) {
        var b = path.basename(file.replace(".gltf", ".bin"));
        loader.emitFile(b, readFileSync(file.replace(".gltf", ".bin")), null, {
            sourceFilename: b,
        });
        var data = JSON.parse(source.toString());
        for (var image in data.images) {
            var a = data.images[image].uri;
            var fn = path.basename(a);
            loader.emitFile(fn, readFileSync(path.resolve(p, a)), null, {
                sourceFilename: fn,
            });
            data.images[image].uri = fn;
        }
        source = JSON.stringify(data);
    }

    const filename = path.basename(file);
    loader.emitFile(filename, source, null, { sourceFilename: filename });

    return `new Promise((resolve,reject)=>new GLTFLoader().load("dist/${filename}",resolve,undefined,reject))`;
});

module.exports.raw = true;
