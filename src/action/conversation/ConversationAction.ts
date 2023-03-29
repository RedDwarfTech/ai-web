export function getConversationAction(content: any) {
    return {
        type: "CONVERSATION_PAGE",
        conversations: content
    };
}