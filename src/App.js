import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './Components/Login.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Route path="/" component={Login}/>
        </Router>
      </div>
    );
  }
}

export default App;
