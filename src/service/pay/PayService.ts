import { createOrder } from '@/action/pay/PayAction';
import { requestWithAction } from '@/common/XHRClient';

export function doPay(params: any) {
    const config = {
        method: 'post',
        url: '/post/alipay/pay/createOrder',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, createOrder);
}

