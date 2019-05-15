import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//inicializar firebase
firebase.initializeApp({
  apiKey: "AIzaSyB4yo5zKC26BR46UN_mf93Uq1vIRGxi8r8",
  authDomain: "fotomatching.firebaseapp.com",
  databaseURL: "https://fotomatching.firebaseio.com",
  projectId: "fotomatching",
  storageBucket: "",
  messagingSenderId: "42494916165"
});

//provedor de autenticacion facebook
const facebookProvider = new firebase.auth.FacebookAuthProvider();
//provedor de autenticacion con google
const googleProvider = new firebase.auth.GoogleAuthProvider();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

export {facebookProvider, googleProvider}
