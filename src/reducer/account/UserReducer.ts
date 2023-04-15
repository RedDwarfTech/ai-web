import { GetUserAction, UserAction } from "@/action/user/UserAction";
import { AppState } from "@/store/AppState";

const initState: AppState = {
    user: {}
};

const UserReducer = (state=initState, action: UserAction) => {
    switch (action.type) {  
        case "GET_CURRENT_USER":
            const getUserAction = action as GetUserAction;
            return {
                ...state,
                user: getUserAction.payload 
            };
        default:
            break;
    }
    return state;
};

export default UserReducer;


