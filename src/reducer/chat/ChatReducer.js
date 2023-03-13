
const initState = {
    chat: {}
};

const ChatReducer = (state=initState, action) => {
    switch (action.type) {
        case "GET_ARTICLE":
            state = action.chat;
            break;
        default:
            break;
    }
    return state;
};

export default ChatReducer;


