const initState = {
    conversations: {}
};

const ConversationReducer = (state=initState, action:any) => {
    switch (action.type) {
        case "CONVERSATION_PAGE":
            return {
                ...state,
                conversations: action.data.data 
            };
        default:
            break;
    }
    return state;
};

export default ConversationReducer;


