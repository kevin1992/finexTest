import React, {Component} from 'react';
import OrderBookContainer from "./components/OrderBookContainer";
import {connect, Provider} from 'react-redux'
import {addUpdateOrderAsync, ASKS, BIDS, fetchBookOrders, removeOrderAsync} from "./actions";
import * as _ from 'lodash';

class MainPage extends Component {

  state = {
    socketInitialized: false
  }

  componentWillMount() {
  }

  processThrottled = _.throttle(this.process, 200);


  process(msg) {
    const data = JSON.parse(msg.data)[1];

    if (!data) {
      return;
    }

    const order = {price: data[0], count: data[1], amount: data[2]};

    if (order.count > 0) {
      if ((order.amount > 0)) {
        this.props.addUpdate('bid', order);
      }
      if ((order.amount < 0)) {
        order.amount = Math.abs(order.amount);
        this.props.addUpdate('ask', order);
      }
    } else {
      if (order.count === 0) {
        if (order.amount === 1) {
          this.props.remove('bid', order);
        }
        if (order.amount === -1) {
          this.props.remove('ask', order);
        }
      }
    }


  }

  startWebSockets() {

    const w = new WebSocket('wss://api.bitfinex.com/ws/2');
    w.addEventListener('message', (msg) => {

      this.processThrottled(msg);

    });

    let msg = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD'
    });
    w.addEventListener('open', () => w.send(msg));

    w.addEventListener('onclose', (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(() => {
        this.startWebSockets();
      }, 1000);
    });

    w.addEventListener('error', (err) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      w.close();
    })

  }

  componentDidMount() {

    this.props.getBookOrders();

  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.bookOrders.bookLoaded && !this.state.socketInitialized) {
      this.setState({socketInitialized: true});
      this.startWebSockets();
    }
  }

  render() {
    return (
    <div style={{backgroundColor:'#2d2d2d',color:'white',minHeight:'100vh'}}>
      <OrderBookContainer/>
    </div>
    );
  }
}


const mapStateToProps = (state) => ({bookOrders: state.bookOrders});
const mapDispatchToProps = {getBookOrders: fetchBookOrders, addUpdate: addUpdateOrderAsync, remove: removeOrderAsync};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
