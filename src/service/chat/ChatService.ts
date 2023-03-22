import { chatAskAction } from '../../action/chat/ChatAction';
import { requestWithAction } from '../../common/XHRClient';
import { IChatAsk } from '../../models/chat/ChatAsk';

export function doChatAsk(params: IChatAsk) {
    const config = {
        method: 'post',
        url: '/ai/chat/ask',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, chatAskAction);
}

export function createQrCodeImpl(params: { cruiseProductId: string | undefined; }) {
  throw new Error("Function not implemented.");
}
