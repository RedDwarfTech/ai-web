export type conversationItemAction = getConversationItemAction;

export enum ConversationItemActionType {
    CONVERSATION_ITEM_PAGE,
}

export interface getConversationItemAction {
    type: ConversationItemActionType.CONVERSATION_ITEM_PAGE;
    data: any;
}
