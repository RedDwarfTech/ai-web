import { chatAskAction } from '../../action/chat/ChatAction';
import { requestWithAction } from '../../common/XHRClient';
import { ChatAsk } from '../../models/request/chat/ChatAsk';

export function doChatAsk(params: ChatAsk) {
    const config = {
        method: 'post',
        url: '/ai/chat/ask',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, chatAskAction);
}
