import { IConversation } from "./3.5/Conversation"

export interface IChatAskResp {
    chatProps: {
        chatResp: string
    },
    conversations: {
        conversations: {
            list: IConversation[]
        }
    }
}