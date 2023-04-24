import { UserActionType } from "@/action/user/UserAction";
import { requestWithActionType } from "@/common/XHRClient";

export function submitFeedback(params: any) {
    const config = {
        method: 'post',
        url: '/post/user/feedback/submit',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
    return requestWithActionType(config, actionTypeString);
}
