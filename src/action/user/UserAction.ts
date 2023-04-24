export type userAction = loginByPhoneAction|userLoginAction|getCurrentUserAction;

export enum UserActionType {
  LOGIN_BY_PHONE,
  USER_LOGIN,
  GET_CURRENT_USER
}

export interface loginByPhoneAction {
    type: UserActionType.LOGIN_BY_PHONE;
    data: any;
}

export interface userLoginAction {
  type: UserActionType.USER_LOGIN;
  data: any;
}

export interface getCurrentUserAction {
  type: UserActionType.USER_LOGIN;
  data: any;
}