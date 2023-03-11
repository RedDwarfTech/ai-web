import { combineReducers } from 'redux';
import chat from '../reducer/chat/ChatReducer';


const rootReducer = combineReducers({
    chat
})

export default rootReducer;