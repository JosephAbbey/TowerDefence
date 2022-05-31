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
    const content: import("three").Texture;
    export default content;
}
