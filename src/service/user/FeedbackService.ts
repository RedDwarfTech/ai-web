import { getCurrentUserAction } from "@/action/user/UserAction";
import { requestWithAction } from "@/common/XHRClient";

export function submitFeedback(params: any) {
    const config = {
        method: 'post',
        url: '/post/user/feedback/submit',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, getCurrentUserAction);
}
