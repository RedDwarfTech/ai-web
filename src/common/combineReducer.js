import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';
import pay from '../reducer/pay/PayReducer';

const rootReducer = combineReducers({
    chat,
    pay
})

export default rootReducer;