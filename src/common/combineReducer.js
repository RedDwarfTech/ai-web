import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';
import pay from '../reducer/pay/PayReducer';
import conversation from '../reducer/conversation/ConversationReducer';
import citem from '../reducer/conversation/ConversationItemReducer';
import iapproducts from '../reducer/iapproduct/IapProductReducer';
import image from '../reducer/images/ImageReducer';

const rootReducer = combineReducers({
    chat,
    pay,
    conversation,
    citem,
    iapproducts,
    image
})

export default rootReducer;