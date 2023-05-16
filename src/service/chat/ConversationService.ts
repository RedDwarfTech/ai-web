import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { requestWithActionType } from '../../common/XHRClient';

export function getConversations(params: IConversationReq) {
    const config = {
        method: 'get',
        url: '/ai/conversation/page',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithActionType(config, 'CONVERSATION_PAGE');
}
