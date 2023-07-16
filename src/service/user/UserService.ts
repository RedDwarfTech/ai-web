import { IUserModel, WheelGlobal } from 'rdjs-wheel';
import { UserActionType } from '@/action/user/UserAction';
import { requestWithActionType } from '@/common/XHRClient';

export function getCurrentUser() {
    const config = {
        method: 'get',
        url: '/post/user/current-user',
        headers: {'Content-Type': 'application/json'}
    };
    const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
    return requestWithActionType(config, actionTypeString);
}

export function userLoginImpl(params: any) {
    const config = {
        method: 'get',
        url: '/post/alipay/login/getQRCodeUrl',
        headers: {'Content-Type': 'application/json'},
        params: params
    };
    const actionTypeString: string = UserActionType[UserActionType.USER_LOGIN];
    return requestWithActionType(config, actionTypeString);
}

export function isLoggedIn(){
    const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
    if(accessToken == null){
        return false;
    }else{
        return true;
    }
}

export function isSubscribed(): boolean {
    const userInfoJson = localStorage.getItem("userInfo");
    if (!userInfoJson) {
        return false;
    }
    const uInfo: IUserModel = JSON.parse(userInfoJson);
    // pay attention that the long data type in the backend server using string to avoid precise loss
    if(uInfo && Number(uInfo.autoRenewProductExpireTimeMs) > new Date().getTime()){
        return true;
    }
    return false;
}