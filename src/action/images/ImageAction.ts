export function genImageAction(content: any) {
    return {
        type: "GEN_IMAGE",
        image: content
    };
}