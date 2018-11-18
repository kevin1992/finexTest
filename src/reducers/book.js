// default reducer
// Note: You can remove this reducer and create your own reducer

import {
  REQUEST_BOOKORDERS,
  RECEIVE_BOOKORDERS,
  ADD_BOOKORDER,
  UPDATE_BOOKORDER,
  DELETE_BOOKORDER,
  MAX_ORDERS, _generateOrderList
} from '../actions';
import {insertItem, removeItem, updateObjectInArray} from "./ReducersHelpers";
import * as _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case REQUEST_BOOKORDERS:
      return {...state, loading: true, bookLoaded: false};
    case RECEIVE_BOOKORDERS:
      return {...state, bids: action.payload.bids, asks: action.payload.asks, bookLoaded: true};
    case ADD_BOOKORDER:
      return {
        ...state,
        [`${action.payload.type}s`]: _generateOrderList(insertItem(state[`${action.payload.type}s`], {
          item: action.payload.order,
          index: action.payload.index
        }),action.payload.type,state)
      };
    case UPDATE_BOOKORDER:
      return {
        ...state,
        [`${action.payload.type}s`]: _generateOrderList(updateObjectInArray(state[`${action.payload.type}s`], {
          item: action.payload.order,
          index: action.payload.index
        }),action.payload.type,state)
      };
    case DELETE_BOOKORDER:
      return {
        ...state, [`${action.payload.type}s`]: _generateOrderList(removeItem(state[`${action.payload.type}s`], {
          item: action.payload.order,
          index: action.payload.index
        }),action.payload.type,state)
      };
    default:
      return state;
  }
}