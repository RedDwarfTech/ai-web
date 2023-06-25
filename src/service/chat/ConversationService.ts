import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { ConversationActionType } from '@/action/conversation/ConversationAction';
import store from '@/store/store';
import { XHRClient } from 'rd-component';

export function getConversations(params: IConversationReq) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof IConversationReq]).join('&');
    const config = {
        method: 'get',
        url: "/ai/conversation/page?" + queryString,
        data: JSON.stringify(params)
    };
    return XHRClient.requestWithActionType(config, 'CONVERSATION_PAGE', store);
}

export function delConversation(id: number) {
    const config = {
        method: 'delete',
        url: "/ai/conversation/del/" + id,
    };
    const actionTypeString: string = ConversationActionType[ConversationActionType.DELETE_CONVERSATION];
    return XHRClient.requestWithActionType(config, actionTypeString, store);
}

export function editConversation(params: any) {
    const config = {
        method: 'put',
        url: "/ai/conversation",
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    const actionTypeString: string = ConversationActionType[ConversationActionType.DELETE_CONVERSATION];
    return XHRClient.requestWithActionType(config, actionTypeString, store);
}