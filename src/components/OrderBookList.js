import React, {Component} from 'react';
import './OrderBookList.scss';
import {OrderBookItem} from "./OrderBookItem";
import {fetchBookOrders} from "../actions";
import {connect} from "react-redux";


class OrderBookList extends Component {
  render() {
    return <div className="orderBookList__Container">
      <h3>{this.props.title}</h3>
      <div key='header' className='orderBookList__ItemContainer'>
        <OrderBookItem total={this.props.total} barColor={this.props.barColor}  reversed={this.props.reversed} header
                       data={{count: 'COUNT', amount: 'AMOUNT', total: 'TOTAL', price: 'PRICE'}}/>
      </div>
      {
        this.props.items ?
        this.props.items.map((book) => {
          return <div key={book.id} className='orderBookList__ItemContainer'>
            <OrderBookItem total={this.props.total} barColor={this.props.barColor} reversed={this.props.reversed}
                           data={{count: book.count, amount: book.amount, total: book.total, price: book.price}}/>
          </div>
        }) : <div/>
      }
    </div>
  }
}


const mapStateToProps = (state) => ({bookOrders: state.bookOrders});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookList);