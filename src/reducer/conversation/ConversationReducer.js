
const initState = {
    conversations: {}
};

const ConversationReducer = (state=initState, action) => {
    switch (action.type) {
        case "CONVERSATION_PAGE":
            return {
                ...state,
                conversations: action.data 
            };
        default:
            break;
    }
    return state;
};

export default ConversationReducer;


