import { genImageAction } from "@/action/images/ImageAction";
import store from "@/store/store";
import { XHRClient } from "rd-component";

export function genImage(params: any) {
    const config = {
        method: 'post',
        url: '/ai/images/generate',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    return XHRClient.requestWithAction(config, genImageAction,store);
}