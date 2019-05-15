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

/************************
        PRELOAD
*************************/
gameScene.preload = function(){
  this.load.image('space',root+'assets/space.jpg');
  this.load.image('block',root+'assets/40px_black_square.png');
  this.load.image('LRTri',root+'assets/40px_black_LowRight_triangle.png');
  this.load.image('URTri',root+'assets/40px_black_UpRight_triangle.png');
  this.load.image('LLTri',root+'assets/40px_black_LowLeft_triangle.png');
  this.load.image('ULTri',root+'assets/40px_black_UpLeft_triangle.png');
  this.load.image('pinball',root+'assets/pinball.png');
  this.load.image('star',root+'assets/star.png');
  //  this.load.image('ground',root+'assets/platform.png');
  //  this.load.image('wall',root+'assets/wall.png');
}
/************************
        CREATE
*************************/
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

/************************
        UPDATE
*************************/
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
