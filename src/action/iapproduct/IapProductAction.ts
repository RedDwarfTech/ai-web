export function getIapProducts(products: any) {
    return {
        type: "GET_IAP_PRODUCT",
        iapproducts: products
    };
}