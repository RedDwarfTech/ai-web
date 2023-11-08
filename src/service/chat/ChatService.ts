import { XHRClient } from 'rd-component';
import { chatAskAction } from '../../action/chat/ChatAction';
import { ChatAsk } from '../../models/request/chat/ChatAsk';
import store from '@/store/store';

export function doChatAsk(params: ChatAsk) {
    const config = {
        method: 'post',
        url: '/ai/chat/ask',
        data: JSON.stringify(params)
    };
    return XHRClient.requestWithAction(config, chatAskAction, store);
}