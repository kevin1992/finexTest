import axios from "axios/index";
import * as _ from 'lodash';

export const REQUEST_BOOKORDERS = 'REQUEST_BOOKORDERS';
export const RECEIVE_BOOKORDERS = 'RECEIVE_BOOKORDERS';
export const DELETE_BOOKORDER = 'DELETE_BOOKORDER';
export const ADD_BOOKORDER = 'ADD_BOOKORDER';
export const UPDATE_BOOKORDER = 'UPDATE_BOOKORDER';

export const requestBookOrders = () => ({
  type: REQUEST_BOOKORDERS,
});
export const receivedBookOrders = data => ({
  type: RECEIVE_BOOKORDERS,
  payload: data,
});


export const MAX_ORDERS = 25;

// default function to display redux action format
export function fetchBookOrders(p = 0, data) {
  return (dispatch) => {
    dispatch(requestBookOrders());
    axios.get(`https://api.bitfinex.com/v2/book/tBTCUSD/P0?len=${MAX_ORDERS}`)
    .then(res => {

      const bids_data = _formatBookData(res.data, BIDS);
      const asks_data = _formatBookData(res.data, ASKS);

      dispatch(receivedBookOrders({bids: bids_data, asks: asks_data}))
    })
  }
}

export const addUpdateOrderAsync = (type, order) => {
  return (dispatch, getState) => {
    const {bookOrders} = getState();
    const orders = (type === 'ask' ? bookOrders.asks : bookOrders.bids);
    dispatch(addUpdateOrder(order, orders, type));
  }
};

export const removeOrderAsync = (type, order) => {
  return (dispatch, getState) => {
    const {bookOrders} = getState();
    const orders = (type === 'ask' ? bookOrders.asks : bookOrders.bids);
    dispatch(deleteOrder(order, orders, type));
  }
};


export const addUpdateOrder = (order, orders, type) => {

  const index = _.findIndex(orders, (o) => {
    return o.price === order.price;
  });

  if (index === -1) {
    order.id = uuidv4();
    return {
      type: ADD_BOOKORDER,
      payload: {index: orders.length, order, type}
    }
  } else {
    return {
      type: UPDATE_BOOKORDER,
      payload: {index, order, type}
    }
  }

};

export const deleteOrder = (order, orders, type) => {

  const index = _.findIndex(orders, (o) => {
    return o.price === order.price;
  });

  return {
    type: DELETE_BOOKORDER,
    payload: {index, type},
  }

};


export const BIDS = elem => elem[2] > 0;
export const ASKS = elem => elem[2] < 0;


export const _formatBookData = (data, condition) => {

  const filtered_data = data.filter(elem => condition(elem));

  const mapped_data = filtered_data.map((order, index) => {
    return {
      price: order[0],
      count: order[1],
      amount: Math.abs(order[2]),
      id: uuidv4()
    }
  })

  mapped_data.forEach((order, index) => order.total = _sumAmounts(order, index, mapped_data));


  return mapped_data;

};


const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export const _sumAmounts = (order, index, data) => _.sum(_.slice(_.map(data, item => Math.abs(
!isNaN(Number(item.amount)) ? Number(item.amount) : 0)), 0, index + 1));

export const _generateOrderList = (orders, type, state) => {

  let ordered = _.sortBy(orders, o => o.price);

  if (type === 'bid') {
    ordered = ordered.reverse()
  }

  let reduced = ordered.filter((o) => {
    if (type === 'bid') {
      return o.price > _.first(state.asks).price;
    }else{
      return o.price < _.first(state.bids).price;
    }
  });

  if (type === 'ask') {
    reduced = _.take(ordered, MAX_ORDERS);
  } else {
    reduced = _.takeRight(ordered, MAX_ORDERS);
  }

  return reduced.map((o, index) => {
    return {
      ...o, total: _sumAmounts(o, index, reduced)
    }
  })

}
