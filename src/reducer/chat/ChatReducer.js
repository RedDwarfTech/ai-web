
const initState = {
    article: {}
};

const ChatReducer = (state=initState, action) => {
    switch (action.type) {
        case "GET_ARTICLE":
            state = action.article;
            break;
        default:
            break;
    }
    return state;
};

export default ChatReducer;


