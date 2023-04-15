import { Action } from "redux";

export type UserAction = GetUserAction | LoginUserAction;


export interface GetUserAction extends Action{
    type: 'GET_CURRENT_USER',
    payload: {
        
    }
}

export interface LoginUserAction {
    type: 'USER_LOGIN',
    payload: {
        
    }
}

export const getCurrentUserAction = (user: any): GetUserAction => {
  return {
    type: 'GET_CURRENT_USER',
    payload: user
  }
}


export function userLogin() {
    return {
        type: "USER_LOGIN",
        article: ''
    };
}

