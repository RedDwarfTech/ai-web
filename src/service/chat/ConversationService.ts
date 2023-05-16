import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { requestWithActionType } from '../../common/XHRClient';

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
