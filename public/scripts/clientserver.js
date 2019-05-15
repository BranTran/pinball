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
var root = 'https://brantran.github.io/pinball/public/';


function InitGame(){
  var gameScene = new Phaser.Scene
  var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    parent: "pinball_game",//This is for injecting into html
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
    this.load.image('block','assets/40px_black_square.png');
    this.load.image('LRTri','assets/40px_black_LowRight_triangle.png');
    this.load.image('URTri','assets/40px_black_UpRight_triangle.png');
    this.load.image('LLTri','assets/40px_black_LowLeft_triangle.png');
    this.load.image('ULTri','assets/40px_black_UpLeft_triangle.png');
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

    //CEILING AND FLOOR
    for(var x = offset; x < width+blockSize; x = x+blockSize)
    {
      //    platforms.create(x,offset,'block');//Ceiling
      if(x < (width/3) || x > (2*width/3))
      {//Leave a gap in the center
        platforms.create(x,(height-offset),'block');
      }
    }
    //Walls
    /*  for(var y = offset; y < height; y = y+(blockSize))
    {
    platforms.create(offset,y,'block');
    if(y >= height/2 - (blockSize) && y <= ((height/2))){
    platforms.create((width-offset),y,'LRTri');
  }
  else{
  platforms.create((width-offset),y,'block');
  }

  }
  */
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
  //	ball.events.onOutOfBounds.add(ballOut, this);

  //score
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '16px', fill: '#FFFFFF' });
  ballCountText = this.add.text(width-182, 16, 'Balls Remaining: 3', { fontSize: '16px', fill: '#FFFFFF' });


  }//CREATE
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
    if(cursors.up.isDown)
    {
      ball.setVelocityY(-330);
    }
    if(cursors.left.isDown)
    {
      ball.setVelocityX(-160);
    }
    if(cursors.right.isDown){
      ball.setVelocityX(160);
    }

    if(ball.y > height)
    {
      ballOut();
    }
    if(ballCount < 1)
    {
      gameOver();
    }
  }//Update
}//InitGame()

/************************
OTHER FUNCTIONS
*************************/
function ballOut(){
  ballCount--;
  reset();
  console.log("ball went out of bounds, only "+ballCount+" balls left");
  ballCountText.setText('Balls Remaining: ' + ballCount);
}
function gameOver(){
  console.log("The game is over");
  reset();
  ballCount = 3;
  score = 0;
  scoreText.setText('Score: ' + score);
  ballCountText.setText('Balls Remaining: ' + ballCount);
  //SEND A REQUEST HERE

}
function reset(){
  ball.x = width-(blockSize/4);
  ball.y = (height/2)-(blockSize/2);
  ball.setVelocityX(0);
  ball.setVelocityY(0);
}
function hitbumper(){
  var xspeed = ball.body.velocity.x * 1.5;
  var yspeed = ball.body.velocity.y * 1.5;
  score += 50;
  console.log("We hit the bumper: score = "+ score+", xspeed = "+ ball.body.velocity.x+", yspeed = "+ball.body.velocity.y);
  ball.setVelocity(xspeed,yspeed);
  //  console.log("We hit the bumper: score = "+ score+", xspeed = "+ ball.body.velocity.x+", yspeed = "+ball.body.velocity.y);
  //console.log(ball.toJSON());
  //  console.log(body);
  //  console.log("We hit the bumper: score = "+ score+", xspeed = "+ xspeed+", yspeed = "+yspeed);

  //  var hope = ball.velocity.x;
  //  console.log("our x speed is "+ hope);
  scoreText.setText('Score: ' + score);
}
var saveX;
var saveY;
var paused = 0;
function togglePause(){
  if(paused === 1){//We are paused
    ball.setVelocity(saveX,saveY);
    ball.body.setAllowGravity(true);
    paused = 0;
  }
  else{
    saveX = ball.body.velocity.x;
    saveY = ball.body.velocity.y;

    ball.setVelocity(0,0);
    ball.body.setAllowGravity(false);
    paused = 1;
  }
}
