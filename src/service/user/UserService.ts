import { UserModel, WheelGlobal } from 'rdjs-wheel';
import { UserActionType } from '@/action/user/UserAction';
import { XHRClient } from 'rd-component';
import store from '@/store/store';

export function getCurrentUser() {
    const config = {
        method: 'get',
        url: '/infra/user/current-user',
        headers: { 'Content-Type': 'application/json' }
    };
    const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
    return XHRClient.requestWithActionType(config, actionTypeString, store);
}

export function delCurUser() {
    const config = {
        method: 'delete',
        url: '/ai/user/del'
    };
    const actionTypeString: string = UserActionType[UserActionType.DEL_USER];
    return XHRClient.requestWithActionType(config, actionTypeString, store);
}

export function isLoggedIn() {
    const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
    if (accessToken == null) {
        return false;
    } else {
        return true;
    }
}

export function isSubscribed(): boolean {
    const userInfoJson = localStorage.getItem("userInfo");
    if (!userInfoJson) {
        return false;
    }
    const uInfo: UserModel = JSON.parse(userInfoJson);
    // pay attention that the long data type in the backend server using string to avoid precise loss
    if (uInfo && Number(uInfo.autoRenewProductExpireTimeMs) > new Date().getTime()) {
        return true;
    }
    return false;
}