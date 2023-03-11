import {createStore} from 'redux';
import rootReducer from '../common/combineReducer';

const store = createStore(rootReducer);

export default store;

