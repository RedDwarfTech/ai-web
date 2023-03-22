export function chatAskAction(content: any) {
    return {
        type: "CHAT_ASK",
        chatResp: content
    };
}