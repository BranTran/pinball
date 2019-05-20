var app;
var port;
var ws;
port = window.location.port || "80";
function Init() {
  //Start the web socket
  ws = new WebSocket("ws://"+window.location.hostname+":"+port);
  app = new Vue({
    el: "#app",
    data: {
      username:"",
      password:"",
      page_type: "main",//main, login, game,stats, leader, about
      // leader_board:[{name: "Goofy", score:7500},
      // {name: "Player 1", score: 300},
      // {name: "Player 2", score: 370},
      // {name: "Player 3", score: 500},
      // {name: "Player 4", score: 430},
      // {name: "Player 5", score: 340}],
      leader_board:[],
      selected_user:{},
      roommates:[],
      room:"",
      highscore:0,
      gamesplayed:0,
      secretsfound:0,
      chat_messages:[],
      new_message: ""
    },
    computed: {
    },
    watch: {
      page_type: function (){
        if(this.page_type === "game"){
          InitGame();
          ws.send(JSON.stringify({type:"username",data:app.username}));
          ws.send(JSON.stringify({type:"roomname",data:app.room}));
        }
      }
    }
  });
  ws.onopen = (event) => {
    console.log("WebSocket connection successful!");
  };
  ws.onmessage = (event) => {//RECEIVE MESSAGE FROM SERVER
    //    console.log(event.data);
    var message = JSON.parse(event.data);
    console.log(message);
    if(message.type === "msg"){
      console.log("pushing in message:"+message.data);
      console.log(app.chat_messages);
      app.chat_messages.push(message.data);
      console.log(app.chat_messages);

    }
    else if(message.type === "history"){
      console.log("add history"+message.data);
      app.chat_messages = message.data;//Object array
    }
  }
}//Init()

function SendMessage(){
  var message = {type:"msg", data:{text:app.new_message, sender:app.username, room:app.room}};
  console.log("Sending message: "+ app.new_message);
  console.log("Message packaged like this: "+message);
  ws.send(JSON.stringify(message));
  app.new_message = "";
}

function About(){
  app.page_type = "about"
}

function playGame(){
  //  console.log("NEED TO CHANGE PLAYGAME()");
  //  app.username = "Goofy";
  if(app.username !== "") {
    console.log("Let's Play "+app.username+"!");
    app.page_type = "game";
    app.page_type = "game";
  }  else{
    console.log("Please login/sign up before playing");
    app.page_type ="login";
  }
}
function SignIn(event){
  console.log("signin");
  if(app.username !== "" && app.password !== "" && app.roon !== ""){
    console.log("Username: "+app.username+" Password: "+app.password);
    GetJson("/login" + "?" + app.username+"|||"+app.password).then((data)=>{
      console.log(data);
      if(data.found_user === 1){
        if(data.goodpassword === 1){
          if(ws.readyState !== WebSocket.OPEN){//not open
            ws = new WebSocket("ws://"+window.location.hostname+":"+port);
          }
          app.username = data.name;
          app.highscore = data.highscore;
          app.gamesplayed = data.gamesplayed;
          app.secretsfound = data.secretsfound;
          app.page_type = "game";
        }else{
          alert("Incorrect password");
          app.password = "";
        }
      }else{
        alert("No user with this username");
      }
    });
  }
  else{
    if(app.username === ""){
      alert("Please enter your username");
    }
    if(app.password === ""){
      alert("Please enter your password");
    }
    if(app.room === "")
    alert("Please enter your Room name");
  }
}
function SignUp(event){
  console.log("signup");
  if(app.username !== "" && app.password !== "" && app.roon !== ""){
    console.log("Username: "+app.username+" Password: "+app.password);
    PostJson("/login" + "?" + app.username+"|||"+app.password).then((data)=>{
      console.log(data);
      if(data.inserted == 1){
        console.log("Successfully created a new user");
        if(ws.readyState !== WebSocket.OPEN){//not open
          ws = new WebSocket("ws://"+window.location.hostname+":"+port);
        }
        app.highscore = 0;
        app.gamesplayed = 0;
        app.secretsfound = 0;
        app.page_type = "game";
      }else{
        alert("Username already exists");
        app.username = "";
        app.password = "";
      }
    });
  }
  else{
    if(app.username === ""){
      alert("Please enter your username");
    }
    if(app.password === ""){
      alert("Please enter your password");
    }
    if(app.room === "")
    alert("Please enter your Room name");
  }
}//SignUp
function LeaderBoard(){
  if(app.page_type === 'game'){
    gameScene.gameOver();
    $("canvas").remove();
  }
  GetJson("/leader").then((data)=>{
    console.log(data);
    var top10;
    if(data.length>10){
      top10 = data.slice(0,10);//inclusive start exclusive end
    }else{top10 = data}
    for(var i = 0; i < top10.length; i++){
      top10[i].rank = i+1;
    }
    app.leader_board = top10;

  });

  app.page_type = "leader";
}
function SignOut(){
  gameScene.gameOver();
  ws.close();
  app.page_type = "main";
  app.username = "";
  app.password = "";
  app.room = "";
  app.chat_messages = [];
  $("canvas").remove();
}

function GetName(name){
  console.log("GetName --> "+name);
  GetJson(name).then((data)=>{
    console.log("selected user will be "+data);
    app.selected_user = data;
    console.log("Turns out that selected user is "+app.selected_user)
  });
  app.page_type = "stats";
}

  function GetJson(url, query){//Turn jquery get into a promise
    return new Promise((resolve,reject) => {
      $.get(url, query, (data) => {
        resolve(data);
      }, "json");
    });
  }

  function PostJson(url, query){//Turn jquery get into a promise
    return new Promise((resolve,reject) => {
      $.post(url, query, (data) => {
        resolve(data);
      }, "json");
    });
  }
  document.onkeydown = function(event){
    if(event.keyCode == 13 && app.page_type==="game"){
      SendMessage();
    }
    if(event.keyCode == 13 && app.page_type==="login"){
      SignIn();
    }
  }




  /************************
  Leader BOard
  ************************/

  function updateLeaderboardView() {
    app.leader_board.sort(function(a, b){ return b.score - a.score  });
    for(var i = 0; i < app.leader_board.length; i++)
    app.leader_board[i].rank = i;
    /*    let colors = ["gold", "silver", "#cd7f32"];
    for(let i=0; i < 3; i++) {
    elements[i].style.color = colors[i];
  }*/

}

/******************************


PINBALL JS STUFF!!!!


******************************/
var width = 400;
var height = 500;
var score;
var scoreText;
var ballCount;
var ballCountText;
var ball;
var platforms;
var offset = 0;
var blockSize = 40;//Block is 40 px
var jumps;
var jumpsLeft;
//var root = "https://brantran.github.io/pinball/public/";
var gameScene;
var game;

function InitGame(){
  game = new Phaser.Game(config);
}//InitGame
gameScene = new Phaser.Scene

var config = {
  key:"game",
  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: "pinball_game",//This doesn't work
  physics: {
    default:"arcade",
    arcade: {
      gravity: {y: 500},
      debug: false
    }
  },
  //  scene:[example1]
  scene: gameScene
};
//        PRELOAD
gameScene.preload = function(){
  this.load.image("space","assets/space.png");
  this.load.image("floor","assets/100X10_black_rectangle.png");
  this.load.image("pinball","assets/pinball.png");
  this.load.image("star","assets/star.png");
}
//        CREATE
gameScene.create = function(){
  //Starting game data
  score = 0;
  ballCount = 3;

  //Setting up the background
  this.physics.world.setBoundsCollision(true,true,true,false);//set all bounds except the floor
  this.add.image(400, 300, "space");//setScale(0.5)

  //Setting up static objects
  platforms = this.physics.add.staticGroup();
  //Center of the item (x,y)
  //floor
  platforms.create(25,height-50, "floor").setScale(2).refreshBody();
  platforms.create(width-25, height-50,"floor").setScale(2).refreshBody();
  //Bumpers
  bumpers = this.physics.add.staticGroup();
  bumpers.create(200,100,"star");
  bumpers.create(75,186,"star");
  bumpers.create(width-75,186,"star");
  bumpers.create(133,325,"star");
  bumpers.create(266,325,"star");

  //Pinball
  ball = this.physics.add.sprite((width-(blockSize/4)),(height/2)-(blockSize/2),"pinball").setCollideWorldBounds(true).setBounce(1);
  ball.setBounce(0.8);
  ball.setCircle(7,0,0);//Circle collision
  this.physics.add.collider(ball, platforms);
  this.physics.add.collider(ball, bumpers, this.hitbumper, null, this);

  //score
  scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "16px", fill: "#FFFFFF" });
  ballCountText = this.add.text(width-92, 16, "Balls: 3", { fontSize: "16px", fill: "#FFFFFF" });
  jumpsLeft = this.add.text(124, 16, "Jump Power: 100", { fontSize: "16px", fill: "#FFFFFF" });

  jumps = 100;
}//CREATE
//        UPDATE
gameScene.update = function(){
  var cursors = this.input.keyboard.addKeys({
    up: "up",
    down: "down",
    left: "left",
    right: "right"
  });
  var body = ball.body;

  //	if(cursors.up.isDown && ball.body.touching.down)

  if(cursors.up.isDown && jumps > 0){
    ball.setVelocityY(-640);
    jumps--;
    jumpsLeft.setText("Jump Power: " + jumps);
  }
  if(cursors.left.isDown && ball.x > 50){
    if(ball.body.velocity.x > -160){
      ball.setVelocityX(-160);
    }else{
      ball.setVelocityX(ball.body.velocity.x-5);
    }
  }
  if(cursors.right.isDown && ball.x < (width-50)){
    if(ball.body.velocity.x < 160){
      ball.setVelocityX(160);
    }else{
      ball.setVelocityX(ball.body.velocity.x+5);
    }
  }

  //FOr when then run out of jumps
  if(ball.body.touching.down && ball.body.velocity.y > -10 && ball.body.velocity.y < 10){
    ball.setVelocityY(-500);
    if(ball.body.velocity.x > -20 && ball.body.velocity.x < 20){
      ball.setVelocityX((Math.random()*640)-320);

    }
  }


  if(ball.y > height){
    this.ballOut();
  }
  if(ballCount < 1){
    this.gameOver();
    this.restartGame();
  }
}//Update
/************************
OTHER FUNCTIONS
*************************/
gameScene.ballOut = function(){
  ballCount--;
  this.resetBall();
  console.log("ball went out of bounds, only "+ballCount+" balls left");
  ballCountText.setText("Balls: " + ballCount);
}
gameScene.restartGame = function(){
  this.resetBall();
  score = 0;
  ballCount = 3;
  scoreText.setText("Score: "+score);
  ballCountText.setText("Balls: "+ballCount);
}
gameScene.resetBall = function(){
  ball.x = width-(blockSize/4);
  ball.y = (height/2)-(blockSize/2);
  ball.setVelocityX(0);
  ball.setVelocityY(0);
  jumps = 100;
  jumpsLeft.setText("Jump Power: " + jumps);
}
gameScene.hitbumper = function(){
  var xspeed = ball.body.velocity.x * 1.25;
  var yspeed = ball.body.velocity.y * 1.25;
  score += 50;
  //  console.log("We hit the bumper: score = "+ score+", xspeed = "+ ball.body.velocity.x+", yspeed = "+ball.body.velocity.y);
  ball.setVelocity(xspeed,yspeed);

  scoreText.setText("Score: " + score);
}
gameScene.gameOver = function(){
  console.log("The game is over. Final score:"+score);
  app.gamesplayed += 1;
  if(score > app.highscore){
    console.log("Score is bigger than the app highscore: "+app.highscore);
    updateHighscore(score);
    PostJson("/update?"+ app.username+"|||"+app.highscore+"|||"+app.gamesplayed).then((data)=>{
      if(data === undefined){
        console.log("New HIGH SCORE!!!: "+app.highscore);
      }
      else{
        console.log(data);
      }
    });
    console.log("highscore is now: "+app.highscore);
  }else{
    PostJson("/update?"+ app.username+"|||"+app.gamesplayed).then((data)=>{
        console.log("Updated games played to "+app.gamesplayed);
    });
  }
}
var saveX;
var saveY;
var paused = 0;
function togglePause(){
  if(paused === 1){//We are paused
    gameScene.scene.resume();
    paused = 0;
  }
  else{
    gameScene.scene.pause();
    paused = 1;
  }
}
function updateHighscore(score){
  app.highscore = score;
}
