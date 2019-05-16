var app;

function Init() {
  app = new Vue({
    el: "#app",
    data: {
      username:'',
      password:'',
      page_type: "main",//main, login, game,stats
      leader_board:[{name: "Goofy", score:7500},
      {name: "Player 1", score: 300},
      {name: "Player 2", score: 370},
      {name: "Player 3", score: 500},
      {name: "Player 4", score: 430},
      {name: "Player 5", score: 340}],
      selected_user:{},
      gamesplayed:0,
      secretsfound:0,
      chat_messages:[{sender: 'Mickey', msg:'Donald did it better'}],
      new_message: ""
    },
    computed: {
      // input_placeholder: function() {
      //   if (this.movie_type === "/Titles") {
      //     return "Search for a Movie/TV Show Title";
      //   }
      //   else {
      //     return "Search for People";
      //   }
      // }
    },
    watch: {
      page_type: function (){
        if(this.page_type === 'game'){
          InitGame();
        }
      }
    }
  });
}

function SendMessage(){
  console.log(app.new_message);
  app.new_message = "";
}

function playGame(){
  console.log("NEED TO CHANGE PLAYGAME()");
  app.username = "Goofy";
  if(app.username !== "")
  {
    console.log("Let's Play "+app.username+"!");
    app.page_type = "game";
  }
  else{
    console.log("Please login/sign up before playing");
    app.page_type ="login";
  }
}
function SignIn(event){
  console.log("signin");
  if(app.username !== "" && app.password !== "")
  {
    console.log("Username: "+app.username+" Password: "+app.password);
    GetJson('/login' + "?" + app.username+"|||"+app.password).then((data)=>{
      console.log(data);
      app.username = data.name;
      app.highscore = data.highscore;
      app.gamesplayed = data.gamesplayed;
      app.secretsfound = data.secretsfound;
      app.page_type = "game";
    });

  }
  else{
    if(app.username === ""){
      alert("Please enter your username");
    }
    if(app.password === ""){
      alert("Please enter your password");
    }
  }
}
function SignUp(event){
  console.log("signup");
  if(app.username !== "" && app.password !== "")
  {
    console.log("Username: "+app.username+" Password: "+app.password);
    PostJson('/login' + "?" + app.username+"|||"+app.password).then((data)=>{
      app.username = data.name;
      app.highscore = data.highscore;
      app.gamesplayed = data.gamesplayed;
      app.secretsfound = data.secretsfound;
      app.page_type = "game";
    });
  }
  else{
    console.log("DID NOT GET IN SIGNUP Username: "+app.username+" Password: "+app.password);
  }

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
  if(event.keyCode == 13 && app.page_type==="game")
  {
    SendMessage();
  }
  if(event.keyCode == 13 && app.page_type==="login")
  {
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
//var root = 'https://brantran.github.io/pinball/public/';


function InitGame(){
  var gameScene = new Phaser.Scene
  var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: "pinball_game",//This doesn't work
    physics: {
      default:'arcade',
      arcade: {
        gravity: {y: 500},
        debug: false
      }
    },
    //  scene:[example1]
    scene: gameScene
  };

  var game = new Phaser.Game(config);

  //        PRELOAD
  gameScene.preload = function(){
    this.load.image('space','assets/space.png');
    // this.load.image('block','assets/40px_black_square.png');
    // this.load.image('LRTri','assets/40px_black_LowRight_triangle.png');
    // this.load.image('URTri','assets/40px_black_UpRight_triangle.png');
    // this.load.image('LLTri','assets/40px_black_LowLeft_triangle.png');
    // this.load.image('ULTri','assets/40px_black_UpLeft_triangle.png');
    this.load.image('floor','assets/100X10_black_rectangle.png');
    this.load.image('pinball','assets/pinball.png');
    this.load.image('star','assets/star.png');
  }
  //        CREATE
  gameScene.create = function(){
    //Starting game data
    score = 0;
    ballCount = 3;

    //Setting up the background
    this.physics.world.setBoundsCollision(true,true,true,false);//set all bounds except the floor
    this.add.image(400, 300, 'space');//setScale(0.5)

    //Setting up static objects
    platforms = this.physics.add.staticGroup();
    //Center of the item (x,y)
    //floor
    platforms.create(25,height-50, 'floor').setScale(2).refreshBody();
    platforms.create(width-25, height-50,'floor').setScale(2).refreshBody();
    //Bumpers
    bumpers = this.physics.add.staticGroup();
    bumpers.create(231,241,'star');
    bumpers.create(50,100,'star');

    //Pinball
    ball = this.physics.add.sprite((width-(blockSize/4)),(height/2)-(blockSize/2),'pinball').setCollideWorldBounds(true).setBounce(1);
    ball.setBounce(0.8);
    ball.setCircle(7,0,0);//Circle collision
    this.physics.add.collider(ball, platforms);
    this.physics.add.collider(ball, bumpers, hitbumper, null, this);

    //score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '16px', fill: '#FFFFFF' });
    ballCountText = this.add.text(width-92, 16, 'Balls: 3', { fontSize: '16px', fill: '#FFFFFF' });
    jumpsLeft = this.add.text(124, 16, 'Jump Power: 100', { fontSize: '16px', fill: '#FFFFFF' });

    jumps = 100;
  }//CREATE
  var jumps;
  var jumpsLeft;
  //        UPDATE
  gameScene.update = function(){
    var cursors = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    });
    var body = ball.body;

    //	if(cursors.up.isDown && ball.body.touching.down)

    if(cursors.up.isDown && jumps > 0){
      ball.setVelocityY(-640);
      jumps--;
      jumpsLeft.setText('Jump Power: ' + jumps);
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


    if(ball.y > height)
    {
      this.ballOut();
    }
    if(ballCount < 1)
    {
      this.gameOver();
    }
  }//Update
  /************************
  OTHER FUNCTIONS
  *************************/
  gameScene.ballOut = function(){
    ballCount--;
    this.resetBall();
    console.log("ball went out of bounds, only "+ballCount+" balls left");
    ballCountText.setText('Balls: ' + ballCount);
  }
  gameScene.gameOver = function(){
    console.log("The game is over");
    //  game.scene.switch('gameOver');
    this.scene.restart();
    //SEND A REQUEST HERE
  }
  gameScene.resetBall = function(){
    ball.x = width-(blockSize/4);
    ball.y = (height/2)-(blockSize/2);
    ball.setVelocityX(0);
    ball.setVelocityY(0);
    jumps = 100;
    jumpsLeft.setText('Jump Power: ' + jumps);
  }
  gameScene.hitbumper = function(){
    var xspeed = ball.body.velocity.x * 1.25;
    var yspeed = ball.body.velocity.y * 1.25;
    score += 50;
    //  console.log("We hit the bumper: score = "+ score+", xspeed = "+ ball.body.velocity.x+", yspeed = "+ball.body.velocity.y);
    ball.setVelocity(xspeed,yspeed);

    scoreText.setText('Score: ' + score);
  }
}//InitGame
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
