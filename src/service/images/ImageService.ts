import { genImageAction } from "@/action/images/ImageAction";
import { requestWithAction } from "@/common/XHRClient";

export function genImage(params: any) {
    const config = {
        method: 'post',
        url: '/ai/images/generate',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return requestWithAction(config, genImageAction);
}