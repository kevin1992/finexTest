import React, {Component} from 'react';
import './OrderBookContainer.scss';
import OrderBookList from "./OrderBookList";
import {connect} from "react-redux";
import * as _ from 'lodash';

class OrderBookContainer extends Component {

  buildTotal() {

    if (!this.props.bookOrders) {
      return 0;
    }

    return _.max([_.last(this.props.bookOrders.asks).total, _.last(this.props.bookOrders.bids).total])
  }

  render() {
    return <div className="orderBookContainer__MainContainer">
      <div style={{flex: 1}}>

        <h2>Order Book</h2>

      </div>

      <div className="orderBookContainer__Container">
        <div className="orderBookContainer__ListContainer orderBookContainer__ListContainer--left">
          {this.props.bookOrders.bids ?
          <OrderBookList total={this.buildTotal()} barColor={'#6eff008f'} title={'Bids'}
                         items={this.props.bookOrders.bids}/> : <div/>}
        </div>
        <div className="orderBookContainer__ListContainer orderBookContainer__ListContainer--right">
          {this.props.bookOrders.asks ?
          <OrderBookList total={this.buildTotal()} barColor={'#ff00008f'} title={'Asks'} items={this.props.bookOrders.asks}
                         reversed/> : <div/>}
        </div>
      </div>
    </div>
  }

}


const mapStateToProps = (state) => ({bookOrders: state.bookOrders});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);