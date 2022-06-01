declare module "*.vert" {
    const content: string;
    export default content;
}

declare module "*.frag" {
    const content: string;
    export default content;
}

declare module "*.world" {
    const content: import("./world").default;
    export default content;
}

declare module "*.png" {
    const content: import("three").Texture;
    export default content;
}

declare module "*.jpg" {
    const content: Promise<import("three").Texture>;
    export default content;
}

declare module "*.svg" {
    const content: Promise<import("three").Texture>;
    export default content;
}

declare module "*.glb" {
    const content: Promise<
        import("three/examples/jsm/loaders/GLTFLoader").GLTF
    >;
    export default content;
}

declare module "*.gltf" {
    const content: Promise<
        import("three/examples/jsm/loaders/GLTFLoader").GLTF
    >;
    export default content;
}
