export function getConversationItemAction(content: any) {
    return {
        type: "CONVERSATION_ITEM_PAGE",
        citem: content
    };
}