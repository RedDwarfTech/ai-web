import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { ConversationActionType } from '@/action/conversation/ConversationAction';
import { requestWithActionType } from 'rd-component';
import store from '@/store/store';

export function getConversations(params: IConversationReq) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof IConversationReq]).join('&');
    const config = {
        method: 'get',
        url: "/ai/conversation/page?" + queryString,
        data: JSON.stringify(params)
    };
    return requestWithActionType(config, 'CONVERSATION_PAGE', store);
}

export function delConversation(id: number) {
    const config = {
        method: 'delete',
        url: "/ai/conversation/del/" + id,
    };
    const actionTypeString: string = ConversationActionType[ConversationActionType.DELETE_CONVERSATION];
    return requestWithActionType(config, actionTypeString, store);
}