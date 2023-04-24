import { AppState } from "@/store/AppState";

const initState: AppState = {
    user: {}
};

const UserReducer = (state=initState, action: any) => {
    switch (action.type) {  
        case "GET_CURRENT_USER":
            return {
                ...state,
                user: action.data 
            };
        case "LOGIN_BY_PHONE":
            return {
                ...state,
                user: action.data
            };
        default:
            break;
    }
    return state;
};

export default UserReducer;


