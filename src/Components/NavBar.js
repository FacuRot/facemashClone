import React, { Component } from 'react';
import firebase from 'firebase';
import './NavBar.css';

class NavBar extends Component {
    constructor(){
        super();
        this.state = {
            navwidth : "0",
            navwidth2 : "0",
            profilephoto : null,
            name : null,
            score : 0,
            list : []
        }
        this.openTab = this.openTab.bind(this);
        this.closeTab = this.closeTab.bind(this);
    }

    componentWillMount(){
        var user = firebase.auth().currentUser;
        var score = 0;

        var database = firebase.database();
        var ref = database.ref('photos');

        ref.once('value', function(data){
            var users = data.val();
            var key = Object.keys(users);

            for (var i=0; i<key.length; i++){
                var k = key[i];

                if (user.displayName === users[k].username){
                    score = users[k].score;
                }
            }            
        });

        this.setState({
            profilephoto : user.photoURL + "?type=large",
            name : user.displayName,
            score : Math.trunc(score)
        });
    }

    openTab(x) {
        if (x===0){
            this.setState({
                navwidth2 : "250px"
            });
            this.getList();
        }else if(x===1){
            this.setState({
                navwidth : "250px"
            });
        }
    }

    closeTab(x) {
        if (x===0){
            this.setState({
                navwidth2 : "0"
            });
        }else if(x===1){
            this.setState({
                navwidth : "0"
            });
        }
    }

    getList() {
        var list = [];
        //se inicializa la base de datos
        var database = firebase.database();
        var ref = database.ref('photos');

        ref.once('value', function(data){
            var users = data.val();
            var key = Object.keys(users);


            for (var i=0; i<key.length; i++){
                var k = key[i];

                list.push(users[k]);
            }
        });

        list.sort(function(a, b){
            if (a.score > b.score){
              return -1;
            }else if(a.score < b.score){
              return 1;
            }
          });

        var userlist = list.map(function(name, index){
            return <div key={index} style={{width:"100%",display:"flex", marginRight:"80px"}}>
                <p>{index+1}</p>
                <img style={{width:"50px", height:"50px", borderRadius:"50%"}} src={name.photo} alt=""></img>
                <section>
                    <p>{name.username}<br/>{Math.trunc(name.score)}</p>
                </section>        
            </div>;
        });

        return <div>{userlist}</div>
    }

    render(){
        var navstyle = {
            height: "100%", /* 100% Full-height */
            width: this.state.navwidth, /* 0 width - change this with JavaScript */
            position: "fixed", /* Stay in place */
            zIndex: "0", /* Stay on top */
            top: "0",
            right: "0",
            backgroundColor: "rgb(250, 250, 250)", 
            overflowX: "hidden", /* Disable horizontal scroll */
            paddingTop: "90px", /* Place content 60px from the top */
            transition: "0.5s",
            border: "1px solid #BDBDBD",
            borderRadius: "5px"
        }

        var navstyle2 = {
            height: "100%", /* 100% Full-height */
            width: this.state.navwidth2, /* 0 width - change this with JavaScript */
            position: "fixed", /* Stay in place */
            zIndex: "0", /* Stay on top */
            top: "0",
            right: "0",
            backgroundColor: "rgb(250, 250, 250)", 
            overflowX: "hidden", /* Disable horizontal scroll */
            paddingTop: "90px", /* Place content 60px from the top */
            transition: "0.5s",
            border: "1px solid #BDBDBD",
            borderRadius: "5px"
        }

        var imgstyle = {
            height : "100px",
            width : "100px",
            borderRadius : "50%"
        }

        return(
            <div style={{width: "100%"}}>
                <header>
                    <p id="logo">Yuzi</p>
                    <nav>
                        <ul>
                            <li><i href="#" onClick={this.openTab.bind(this, 0)} className="fas fa-globe fa-lg"></i></li>
                            <li><i href="#" onClick={this.openTab.bind(this, 1)} className="far fa-user fa-lg"></i></li>
                        </ul>
                    </nav>
                </header>

                <div style={navstyle}>
                    <a href="#" className="closebtn" onClick={this.closeTab.bind(this, 1)} style={{color:"black"}}>&times;</a>
                    <div style={{marginLeft : "75px"}}>
                        <img src={this.state.profilephoto} style={imgstyle}/>
                        <p style={{marginTop:"20px"}}>{this.state.name}</p>
                        <p>score: {this.state.score}</p>
                    </div>
                </div>
                
                <div style={navstyle2}>
                    <a href="#" className="closebtn" onClick={this.closeTab.bind(this, 0)} style={{color:"black"}}>&times;</a>
                    <div style={{marginLeft: "10px"}}>
                        <p style={{marginLeft: "65px",color:"black"}}>Ranking Global</p>
                        {this.getList()}                        
                    </div>
                </div>                
            </div>        
        );
    }
}
export default NavBar;