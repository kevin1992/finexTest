import React, {Component} from 'react';
import './OrderBookItem.scss';
import {toFixed} from "../utilities/toFixed";


export class OrderBookItem extends Component {

  state = {barWidth: 0};

  containerRef = null;
  handleNewRefBind = this.handleNewRef.bind(this);

  handleNewRef(ref) {
    if (!ref) {
      return;
    }
    this.containerRef = ref;

    this.calculateBarWidth();

  }

  calculateBarWidth() {

    if (this.props.header) {
      return;
    }

    const _maxWidth = this.containerRef.clientWidth;

    const _width = (this.props.data.total / this.props.total) * _maxWidth;

    this.setState({barWidth: _width});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.total !== nextProps.total) {
      this.calculateBarWidth();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((this.props.total != nextProps.total) || (nextProps.data.count != this.props.data.count || nextProps.data.total != this.props.data.total || nextProps.data.amount != this.props.data.amount || nextProps.data.price != this.props.data.price) || (this.containerRef != null && this.state.barWidth === 0))
  }

  renderPrice() {
    return <div key={'price'}
    className={this.props.header ? 'orderBookItem__ItemContainer orderBookItem__ItemContainer--header' : 'orderBookItem__ItemContainer'}>
      <span className="orderBookItem__Item">{this.props.data.price}</span>
    </div>
  }

  renderTotal() {
    return <div key={'total'}
    className={this.props.header ? 'orderBookItem__ItemContainer orderBookItem__ItemContainer--header' : 'orderBookItem__ItemContainer'}>
      <span className="orderBookItem__Item">{isNaN(this.props.data.total) ? this.props.data.total : toFixed(this.props.data.total)}</span>
    </div>
  }

  renderAmount() {
    return <div key={'amount'}
    className={this.props.header ? 'orderBookItem__ItemContainer orderBookItem__ItemContainer--header' : 'orderBookItem__ItemContainer'}>
      <span className="orderBookItem__Item">{isNaN(this.props.data.amount) ? this.props.data.amount : toFixed(this.props.data.amount)}</span>
    </div>
  }

  renderCount() {
    return <div key={'count'}
    className={this.props.header ? 'orderBookItem__ItemContainer orderBookItem__ItemContainer--header' : 'orderBookItem__ItemContainer'}>
      <span className="orderBookItem__Item">{this.props.data.count}</span>
    </div>
  }


  renderCols() {
    if (this.props.reversed) {
      return (
      [this.renderPrice(),
        this.renderTotal(),
        this.renderAmount(),
        this.renderCount()]
      )

    } else {
      return ([this.renderCount(),
        this.renderAmount(),
        this.renderTotal(),
        this.renderPrice()]
      )

    }
  }


  renderValues() {

    let barStyle = {backgroundColor: this.props.barColor, width: this.state.barWidth};

    if (this.props.reversed) {
      barStyle.left = 0;
    } else {
      barStyle.right = 0;
    }

    return <div>
      <div className="orderBookItem__Container" ref={this.handleNewRefBind}>
        <div style={barStyle} className={'bar'}></div>
        {this.renderCols()}
      </div>
    </div>

  }

  render() {
    return <div>
      {this.renderValues()}
    </div>
  }

}