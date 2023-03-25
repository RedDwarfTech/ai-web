export interface ISseServerMsg {
    id: string,
    created: string,
    choices: Choice[],
}


interface Choice {
    text: string
}