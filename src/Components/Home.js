import React, {Component} from 'react';
import firebase from 'firebase';
import NavBar from './NavBar.js';

class Home extends Component {
  constructor(){
    super();
    this.state = {
      p1key: null,
      p1name : null,
      p1photo : null,
      p1sex : null,
      p1total : 0,
      p1win : 0,
      p1lost : 0,
      ra : 0,
      p1prob : 0,
      showp1prob : 0,

      p2key : null,
      p2name : null,
      p2photo : null,
      p2sex : null,
      p2total : 0,
      p2win : 0,
      p2lost : 0,
      rb : 0,
      p2prob : 0,
      showp2prob : 0,

      topRankedMen : [],
      topRankedWomen : []
    }

    this.getPlayer = this.getPlayer.bind(this);
    this.addPoints1 = this.addPoints1.bind(this);
    this.addPoints2 = this.addPoints2.bind(this);
  }

  componentWillMount() {
    this.getPlayer();
  }

  getPlayer() {
    var userData = {
      key : null,
      name : null,
      photo : null,
      sex : null,
      total : 0,
      win : 0,
      lost : 0,
      score : 0
    };
    userData = JSON.stringify(userData);

    var players = [];

    //se inicializa la base de datos
    var database = firebase.database();
    var ref = database.ref('photos');

    ref.once('value', function(data){
      var users = data.val();
      var key = Object.keys(users);


      for (var i=0; i<key.length; i++){
        var k = key[i];

        var aPlayer = JSON.parse(userData);
        aPlayer.key = key[i];
        aPlayer.name = users[k].username;
        aPlayer.photo = users[k].photo;
        aPlayer.sex = users[k].sex;
        aPlayer.total = users[k].total;
        aPlayer.win = users[k].win;
        aPlayer.lost = users[k].lost;
        aPlayer.score = users[k].score;

        players.push(aPlayer);

      }
    });

    let topRankedWomen = [];
    let topRankedMen = [];
    for (var i=0; i<players.length; i++){
      if (players[i].photo.indexOf("https://lh5.googleusercontent.com") !== -1){

        if (players[i].photo.indexOf("s320-c/photo.jpg") !== -1){
          players[i].photo = players[i].photo.replace("s320-c/photo.jpg", "photo.jpg");
        }

        players[i].photo = players[i].photo.replace("photo.jpg","s320-c/photo.jpg");
      }else if(players[i].photo.indexOf("https://graph.facebook.com") !== -1){

        if (players[i].photo.indexOf("picture?type=large&width=300&height=300") !== -1){
          players[i].photo = players[i].photo.replace("picture?type=large&width=300&height=300", "picture");
        }

        players[i].photo = players[i].photo.replace("picture", "picture?type=large&width=300&height=300");
      }

      if (players[i].sex === "f"){
        topRankedWomen.push(players[i]);
      }

      if (players[i].sex === "m"){
        topRankedMen.push(players[i]);
      }
    }

    topRankedMen.sort(function(a, b){
      if (a.score > b.score){
        return -1;
      }else if(a.score < b.score){
        return 1;
      }
    });
    topRankedWomen.sort(function(a, b){
      if (a.score > b.score){
        return -1;
      }else if(a.score < b.score){
        return 1;
      }
    });

    var aleatorio = Math.floor(Math.random()*(players.length));

    var prePlayer = players[aleatorio];
    console.log(prePlayer);

    players.splice(aleatorio, 1);
    var aleatorio2 =  Math.floor(Math.random()*(players.length));


    while (prePlayer.sex !== players[aleatorio2].sex){
      aleatorio2 =  Math.floor(Math.random()*(players.length));
    }
    if (prePlayer.sex === players[aleatorio2].sex){
      var r1 = Math.pow(10, (prePlayer.score / 400));
      var r2 = Math.pow(10, (players[aleatorio2].score / 400));

      var e1 = r1 / (r1+r2);
      var showe1 = e1;
      showe1 = showe1*100;
      if (showe1%100 > 50){
        showe1++;
      }
      showe1 = Math.trunc(showe1);
      
      var e2 = r2 / (r1+r2);
      var showe2 = e2;
      showe2 = showe2*100;
      if (showe2%100 > 50){
        showe2++;
      }
      showe2 = Math.trunc(showe2);

      this.setState({
        p1key : prePlayer.key,
        p1name : prePlayer.name,
        p1photo : prePlayer.photo,
        p1sex : prePlayer.sex,
        p1total : prePlayer.total,
        p1win : prePlayer.win,
        p1lost : prePlayer.lost,
        ra : prePlayer.score,
        p1prob : e1,
        showp1prob : showe1,

        p2key : players[aleatorio2].key,
        p2name : players[aleatorio2].name,
        p2photo : players[aleatorio2].photo,
        p2sex : players[aleatorio2].sex,
        p2total : players[aleatorio2].total,
        p2win : players[aleatorio2].win,
        p2lost : players[aleatorio2].lost,
        rb : players[aleatorio2].score,
        p2prob : e2,
        showp2prob : showe2,

        topRankedMen : topRankedMen,
        topRankedWomen : topRankedWomen
      });
      
    }
  }

  addPoints1() {
    this.state.p1total = this.state.p1total + 1;
    this.state.p1win = this.state.p1win + 1;

    this.state.p2total = this.state.p2total + 1;
    this.state.p2lost = this.state.p2lost + 1;

    if(this.state.p1photo.indexOf("https://graph.facebook.com") !== -1){
      this.state.p1photo = this.state.p1photo.replace("?type=large&width=300&height=300", "");
    }
    if (this.state.p1photo.indexOf("https://lh5.googleusercontent.com") !== -1){
      this.state.p1photo = this.state.p1photo.replace("s320-c/photo.jpg", "photo.jpg");
    }

    firebase.database().ref('photos/' + this.state.p1key).set({
      username : this.state.p1name,
      photo : this.state.p1photo,
      sex: this.state.p1sex,
      total : this.state.p1total,
      win : this.state.p1win,
      lost : this.state.p1lost,
      score : this.state.ra + 32 * (1-this.state.p1prob)
    });

    firebase.database().ref('photos/' + this.state.p2key).set({
      username : this.state.p2name,
      photo : this.state.p2photo,
      sex: this.state.p2sex,
      total : this.state.p2total,
      win : this.state.p2win,
      lost : this.state.p2lost,
      score : this.state.rb + 32 * (0-this.state.p2prob)
    });


    this.getPlayer();
  }

  addPoints2() {
    this.state.p2total = this.state.p2total + 1;
    this.state.p2win = this.state.p2win + 1;

    this.state.p1total = this.state.p1total + 1;
    this.state.p1lost = this.state.p1lost + 1;

    if(this.state.p1photo.indexOf("https://graph.facebook.com") !== -1){
      this.state.p1photo = this.state.p1photo.replace("?type=large&width=300&height=300", "");
    }
    if (this.state.p1photo.indexOf("https://lh5.googleusercontent.com") !== -1){
      this.state.p1photo = this.state.p1photo.replace("s320-c/photo.jpg", "photo.jpg");
    }

    firebase.database().ref('photos/' + this.state.p1key).set({
      username : this.state.p1name,
      photo : this.state.p1photo,
      sex: this.state.p1sex,
      total : this.state.p1total,
      win : this.state.p1win,
      lost : this.state.p1lost,
      score : this.state.ra + 32 * (0-this.state.p1prob)
    });

    firebase.database().ref('photos/' + this.state.p2key).set({
      username : this.state.p2name,
      photo : this.state.p2photo,
      sex: this.state.p2sex,
      total : this.state.p2total,
      win : this.state.p2win,
      lost : this.state.p2lost,
      score : this.state.rb + 32 * (1-this.state.p2prob)
    });


    this.getPlayer();
  }


  getTopMen(){  
    var imgstyle = {
      height : "100px", 
      width : "100px",
      margin : "10px",
    }

    if (this.state.topRankedMen.length >= 5){
      return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
          <h2>Top Ranked Men</h2>
          <div style={{display : "flex"}}>
            <section>
              <img src={this.state.topRankedMen[0].photo} style={imgstyle}/>
              <p>{this.state.topRankedMen[0].name}</p>
            </section>
            
            <section>
              <img src={this.state.topRankedMen[1].photo} style={imgstyle}/>
              <p>{this.state.topRankedMen[1].name}</p>
            </section>

            <section>
              <img src={this.state.topRankedMen[2].photo} style={imgstyle}/>
              <p>{this.state.topRankedMen[2].name}</p>
            </section> 

            <section>
              <img src={this.state.topRankedMen[3].photo} style={imgstyle}/>
              <p>{this.state.topRankedMen[3].name}</p>
            </section> 

            <section>
              <img src={this.state.topRankedMen[4].photo} style={imgstyle}/>
              <p>{this.state.topRankedMen[4].name}</p>
            </section>          
          </div>
        </div>
      );
    }
  }

  getTopWomen(){
    var imgstyle = {
      height : "100px", 
      width : "100px",
      margin : "10px",
    }

    if (this.state.topRankedWomen.length >= 5){
      return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
          <h2>Top Ranked Women</h2>
          <div style={{display : "flex"}}>
            <section>
              <img src={this.state.topRankedWomen[0].photo} style={imgstyle}/>
              <p>{this.state.topRankedWomen[0].name}</p>
            </section>
            
            <section>
              <img src={this.state.topRankedWomen[1].photo} style={imgstyle}/>
              <p>{this.state.topRankedWomen[1].name}</p>
            </section>

            <section>
              <img src={this.state.topRankedWomen[2].photo} style={imgstyle}/>
              <p>{this.state.topRankedWomen[2].name}</p>
            </section> 

            <section>
              <img src={this.state.topRankedWomen[3].photo} style={imgstyle}/>
              <p>{this.state.topRankedWomen[3].name}</p>
            </section> 

            <section>
              <img src={this.state.topRankedWomen[4].photo} style={imgstyle}/>
              <p>{this.state.topRankedWomen[4].name}</p>
            </section>          
          </div>
        </div>
      );
    }
  }

  render() {
    var pstyle = {
      display : "inline-block", 
      lineHeight : "250px"
    }
  
    return ( 
      <div> 
        <NavBar/>
        <div className="fatherStyle">
          <div className="homeStlye">
            <div onClick={ this.addPoints1} className="imageDiv">
              <img src={this.state.p1photo} alt={this.state.p1name} className="image"/>
              <p style={{color : "black"}}>{this.state.p1name}</p>
              <div className="alignText">
                
                <p style={{marginRight : "15px"}}>Ganadas: <br/>
                <span style={{color : "#66BB6A"}}>{this.state.p1win}</span></p>
                
                <p>Perdidas: <br/><span style={{color : "#EF5350"}}>{this.state.p1lost}</span></p>                
              </div>
              <div>
                <p>{"probabilidad de ganar esta ronda:" + this.state.showp1prob + "%"}</p>
              </div>           
            </div>

            <p style={pstyle}>O</p>

            <div onClick={ this.addPoints2} className="imageDiv">
              <img src={this.state.p2photo} alt={this.state.p2name} className="image"></img>
              <p style={{color : "black"}}>{this.state.p2name}</p>
              <div className="alignText">
                <p style={{marginRight : "15px"}}>Ganadas: <br/><span style={{color : "#66BB6A"}}>{this.state.p2win}</span></p>
                <p>Perdidas: <br/><span style={{color : "#EF5350"}}>{+this.state.p2lost}</span></p>
              </div>
              <div>
                <p>{"probabilidad de ganar esta ronda:" + this.state.showp2prob + "%"}</p>
              </div>
            </div>      
          </div>

          
          <div className="topRankedMen">
            {this.getTopWomen()}
          </div>

          <div className="topRankedMen">            
            {this.getTopMen()}
          </div>          
        </div>
      </div>
    );
  }
}
export default Home;
