import { requestWithAction } from '@/common/XHRClient';
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { getIapProductsAction } from '@/action/iapproduct/IapProductAction';


export function doGetIapProduct(params: ProductReq) {
    var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ProductReq]).join('&');
    const config = {
        method: 'get',
        url: '/post/product/v1/list?' + queryString,
        headers: {'Content-Type': 'application/json'}
    };
    return requestWithAction(config, getIapProductsAction);
}
