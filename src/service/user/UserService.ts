import { userLogin } from '../../action/user/UserAction';
import { requestWithAction } from '../../common/XHRClient';


export function userLoginImpl(params: any) {
    const config = {
        method: 'get',
        url: '/post/alipay/login/getQRCodeUrl',
        headers: {'Content-Type': 'application/json'},
        params: params
    };
    return requestWithAction(config, userLogin);
}
