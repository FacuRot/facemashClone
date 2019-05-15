import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//inicializar firebase
firebase.initializeApp({
  //your firebase keys
});

//provedor de autenticacion facebook
const facebookProvider = new firebase.auth.FacebookAuthProvider();
//provedor de autenticacion con google
const googleProvider = new firebase.auth.GoogleAuthProvider();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

export {facebookProvider, googleProvider}
