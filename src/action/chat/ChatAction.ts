export function chatAskAction(content: any) {
    return {
        type: "CHAT_ASK",
        chatResp: content
    };
}

export function chatSseAskAction(content: any) {
    return {
        type: "CHAT_SSE_ASK",
        chatResp: content
    };
}