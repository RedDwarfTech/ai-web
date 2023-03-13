
const initState = {
    order: {}
};

const PayReducer = (state=initState, action) => {
    switch (action.type) {
        case "CREATE_ORDER":
            return {
                ...state,
                order: action.order
            };
        default:
            break;
    }
    return state;
};

export default PayReducer;


