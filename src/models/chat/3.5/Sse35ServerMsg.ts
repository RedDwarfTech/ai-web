export interface ISse35ServerMsg {
    id: string,
    created: number,
    choices: Choice35[],
}

interface Choice35 {
    index: number,
    finish_reason: string,
    delta: Content
}

interface Content {
    content: string
}
