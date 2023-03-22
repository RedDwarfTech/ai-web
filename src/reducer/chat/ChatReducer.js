
const initState = {
    chatResp: ''
};

const ChatReducer = (state=initState, action) => {
    switch (action.type) {
        case "CHAT_ASK":
            return {
                ...state,
                chatResp: action.chatResp 
            };
        default:
            break;
    }
    return state;
};

export default ChatReducer;


