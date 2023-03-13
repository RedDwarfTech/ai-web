import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';
import order from '../reducer/pay/PayReducer';

const rootReducer = combineReducers({
    chat,
    order
})

export default rootReducer;