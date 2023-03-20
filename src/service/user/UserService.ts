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

export function isLoggedIn(){
    const accessToken = localStorage.getItem('aiAccessToken');
    if(accessToken == null){
        return false;
    }else{
        return true;
    }
}

export function doLoginOut() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('aiAccessToken');
    localStorage.removeItem('aiRefreshToken');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('userInfo');

    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'avatarUrl=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href="https://ai.poemhub.top";
}