export type conversationAction = getConversationAction | delConversationAction;

export enum ConversationActionType {
    CONVERSATION_PAGE,
    DELETE_CONVERSATION
}

export interface getConversationAction {
    type: ConversationActionType.CONVERSATION_PAGE;
    data: any;
}

export interface delConversationAction {
    type: ConversationActionType.DELETE_CONVERSATION;
    data: any;
}