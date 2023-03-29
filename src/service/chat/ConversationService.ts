import { getConversationAction } from '../../action/conversation/ConversationAction';
import { IConversationReq } from '@/models/request/conversation/ConversationReq';
import { requestWithAction } from '../../common/XHRClient';

export function getConversations(params: IConversationReq) {
    const config = {
        method: 'get',
        url: '/ai/conversation/page',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, getConversationAction);
}
