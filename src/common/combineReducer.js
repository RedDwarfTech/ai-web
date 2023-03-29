import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';
import pay from '../reducer/pay/PayReducer';
import conversation from '../reducer/conversation/ConversationReducer';
import citem from '../reducer/conversation/ConversationItemReducer';

const rootReducer = combineReducers({
    chat,
    pay,
    conversation,
    citem
})

export default rootReducer;