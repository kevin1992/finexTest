import {combineReducers} from 'redux';
import bookReducer from './book';

const rootReducers = combineReducers({
  bookOrders:bookReducer
});

export default rootReducers;