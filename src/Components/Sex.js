import React, {Component} from 'react';
import firebase from 'firebase';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home.js';

class Sex extends Component {
  constructor(){
    super();
    this.state = {
      redirectToHome : false
    }
    this.clickOnMan = this.clickOnMan.bind(this);
    this.clickOnWoman = this.clickOnWoman.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  saveData(s) {
    //se inicializa la base de datos
    var database = firebase.database();
    var ref = database.ref('photos');

    console.log(firebase.auth().currentUser.displayName);

    ref.once('value', function(data){
      var users = data.val();
      var key = Object.keys(users);

      for (var i=0; i<key.length; i++){
        var k = key[i];

        if (firebase.auth().currentUser.displayName === users[k].username){
          firebase.database().ref('photos/' + key[i]).set({
            username : firebase.auth().currentUser.displayName,
            photo : firebase.auth().currentUser.photoURL,
            sex: s,
            total : 0,
            win : 0,
            lost : 0,
            score : 1000
          });
        }
      }
    });
  }

  clickOnMan(){
    this.saveData("m");
    this.setState({
      redirectToHome : true
    });
    console.log("click man");
  }

  clickOnWoman(){
    this.saveData("f");
    this.setState({
      redirectToHome : true
    });
    console.log("click woman");
  }

  render(){
    if (this.state.redirectToHome === true){
      return(
        <div>
          <Router>
            <Route path="/" component={Home}/>
          </Router>
        </div>
      );
    }

    return(
      <div className="chooseSexStyle">
        <h2 style={{marginBottom:"50px"}}>Antes de empezar indica tu sexo...</h2>

        <div style={{display:"flex", justifyContent:"space-around", width:"40%"}}>
          <div onClick={this.clickOnMan} style={{float:"left"}}>
            <h3 className="ManText">Hombre</h3>
          </div>
          <div onClick={this.clickOnWoman}>
            <h3 className="WomanText">Mujer</h3>
          </div>
        </div>  
      </div>
    );
  }
}
export default Sex;
