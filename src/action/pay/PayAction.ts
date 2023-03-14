export function createOrder(pay: any) {
    return {
        type: "CREATE_ORDER",
        formText: pay
    };
}