import React, { Component } from 'react';
import firebase from 'firebase';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {facebookProvider, googleProvider} from '../index.js';
import {Button} from 'react-bootstrap';
import Home from './Home.js';
import Sex from './Sex.js';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      cont : false,
      redirectToSex : false,
      redirectToHome : false,
    }
    this.authWithGoogle = this.authWithGoogle.bind(this);
    this.authWithFacebook = this.authWithFacebook.bind(this);
    this.addUser = this.addUser.bind(this);
  }


  authWithFacebook() {
    firebase.auth().signInWithPopup(facebookProvider)
    .then((result, error)=>{
      if(error){
        console.log(error);
      }else {
        this.addUser();
      }
    })
  }

  authWithGoogle() {
    firebase.auth().signInWithPopup(googleProvider)
    .then((result, error)=>{
      if(error){
        console.log(error);
      }else {
        this.addUser();
      }
    })
  }

  addUser() {
    const user = firebase.auth().currentUser;

    //se inicializa la base de datos
    var database = firebase.database();
    var ref = database.ref('photos');

    //se obtienen los datos de los usuarios ya registrados
    ref.on('value', (data) =>{

      //se comparan con el de el usuario actual para saber si ya se registro antes
      var users = data.val();

      if (users != null){
        var key = Object.keys(users);
        for (var i=0; i<key.length; i++){
          var k = key[i];
          if (user.displayName === users[k].username){
            if (user.photoURL !== users[k].photo){
              firebase.database().ref('photos/' + key[i]).update({
                photo : user.photoURL
              });
            }
            this.setState({cont : true});
          }
        }
      }

      //si no se registro se agregan los datos a la base de datos
      if (this.state.cont === false){
        var userdata = {
          username : user.displayName,
          photo : user.photoURL,
          sex: null,
        }
        ref.push(userdata);
        this.setState({redirectToSex : true});
      }else {
        this.setState({redirectToHome : true});
      }
    });
    console.log(this.state.redirectToSex);
  }

  render() {
    if (this.state.redirectToSex === true){
      return(
        <div>
          <Router>
            <Route path="/" component={Sex}/>
          </Router>
        </div>
      );
    }
    if (this.state.redirectToHome === true) {
      return(
        <div>
          <Router>
            <Route path="/" component={Home}/>
          </Router>
        </div>
      );
    }

    return(
      <div className="loginContainer">
        <h1>Yuzi</h1>
        <div className="loginStyle">
          <Button style={{width: "100%"}} bsStyle="primary" onClick={this.authWithFacebook}>Login con facebook</Button>

          <hr style={{marginTop:"10px", marginBottom:"10px", backgroundColor:"#F4511E"}}/>

          <Button style={{width: "100%"}} bsStyle="danger" onClick={this.authWithGoogle}>Login con google</Button>
        </div>
        <footer style={{fontSize:"10px", textAlign:"right"}}>Facundo Rotger</footer>
      </div>
    );
  }
}
export default Login;
