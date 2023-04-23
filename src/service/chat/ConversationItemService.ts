import { requestWithAction, requestWithActionType } from '../../common/XHRClient';
import { IConversationItemReq } from '@/models/request/conversation/ConversationItemReq';
import { getConversationItemAction } from '../../action/conversation/ConversationItemAction';

export function getConversationItems(params: IConversationItemReq) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof IConversationItemReq]).join('&');
    const config = {
        method: 'get',
        url: '/ai/conversation/item/page?' + queryString,
        headers: {'Content-Type': 'application/json'}
    };
    return requestWithActionType(config, 'CONVERSATION_ITEM_PAGE');
}
