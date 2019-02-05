import React, { Component } from 'react';
import {Connect} from './actions';
import App from './App';
import Login from './Login';

class ScreenContainer extends Component {
  componentDidMount(){
    const name = localStorage.getItem('name');
    const password = localStorage.getItem('password');
    if(name){
      this.props.login({name, password});
    }
    this.props.setState({loading:false});
  }
  render() {
    if(this.props.app.user){
        return <App />
    }else {
        return <Login />
    }
  }
}

export default Connect(ScreenContainer);
