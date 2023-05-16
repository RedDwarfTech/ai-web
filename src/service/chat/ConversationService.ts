import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { requestWithActionType } from '../../common/XHRClient';
import { ConversationActionType } from '@/action/conversation/ConversationAction';

export function getConversations(params: IConversationReq) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof IConversationReq]).join('&');

    const config = {
        method: 'get',
        url: "/ai/conversation/page?" + queryString,
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithActionType(config, 'CONVERSATION_PAGE');
}

export function delConversation(id: number) {
    const config = {
        method: 'delete',
        url: "/ai/conversation/" + id,
        headers: {'Content-Type': 'application/json'}
    };
    const actionTypeString: string = ConversationActionType[ConversationActionType.DELETE_CONVERSATION];
    return requestWithActionType(config, actionTypeString);
}