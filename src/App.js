import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {createStore, applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import {connect, Provider} from 'react-redux'
import rootReducer from './reducers';
import MainPage from './MainPage';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Note: this API requires redux@>=3.1.0
const store = createStore(
rootReducer,
composeEnhancers(applyMiddleware(thunk))
);

export default class App extends Component {

  render() {
    return (
    <Provider store={store}>
      <MainPage/>
    </Provider>
    );
  }
}


