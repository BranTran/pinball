//var app;

var width = 400;
var height = 500;
var gameScene = new Phaser.Scene
var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
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

var root = 'https://brantran.github.io/pinball/public/';

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

var player;
var platforms;
var offset = 0;
var blockSize = 40;//Block is 40 px
gameScene.create = function(){
	this.physics.world.setBounds(0,0,width,height,true);//check down
	//this.physics.world.setBoundCollision;
	this.physics.world.event.on('ARCADE_WORLD_BOUNDS_EVENT', ballOut);
	this.add.image(400, 300, 'space');//setScale(0.5)

	platforms = this.physics.add.staticGroup();
	bumpers = this.physics.add.staticGroup();
//Center of the item (x,y)

//CEILING AND FLOOR
  for(var x = offset; x < width; x = x+blockSize)
  {
    platforms.create(x,offset,'block');//Ceiling
    if(x < (width/3) || x > (2*width/3))
    {//Leave a gap in the center
	    platforms.create(x,(height-offset),'block');
	}
  }
//Walls
  for(var y = offset; y < height; y = y+(blockSize))
  {
    platforms.create(offset,y,'block');
    if(y >= height/2 - (blockSize) && y <= ((height/2))){
      platforms.create((width-offset),y,'LRTri');
    }
    else{
      platforms.create((width-offset),y,'block');
    }

  }

//Bumpers

	bumpers.create(231,241,'star');
	bumpers.create(50,100,'star');

//Pinball
	player = this.physics.add.sprite((width-(blockSize/4)),(height/2)-(blockSize/2),'pinball');
	player.checkWorldBounds = true;
  	player.setBounce(0.8);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(player, bumpers);
//	player.events.onOutOfBounds.add(ballOut, this);


}

gameScene.update = function(){
var cursors = this.input.keyboard.createCursorKeys();


//	if(cursors.up.isDown && player.body.touching.down)
	if(cursors.up.isDown)
	{
		player.setVelocityY(-330);
	}
	if(cursors.left.isDown && player.body.touching.left && !player.body.touching.down)
	{
		console.log("we are touching left")
		player.setVelocityY(-160);
		player.setVelocityX(330);
	}
	if(cursors.right.isDown && player.body.touching.right && !player.body.touching.down)
	{
			console.log("we are touching right")
			player.setVelocityY(-160);
			player.setVelocityX(-330);
	}

	if(cursors.left.isDown)
	{
		player.setVelocityX(-160);
	} else if(cursors.right.isDown){
		player.setVelocityX(160);
	} else{
		player.setVelocityX(0);
	}
}

function ballOut(player){
	player.reset(player.x,player.y);
	console.log("ball went out of bounds");
}
//
// function Init() {
//     app = new Vue({
//         el: "#app",
//         data: {
//             movie_search: "",
//             movie_type: "/Titles",
//             movie_type_options: [
//                 {value: "/Titles", text: "Movie/TV Show Title"},
//                 {value: "/Names", text: "People"}
//             ],
//             search_results: []
//         },
//         computed: {
//             input_placeholder: function() {
//                 if (this.movie_type === "/Titles") {
//                     return "Search for a Movie/TV Show Title";
//                 }
//                 else {
//                     return "Search for People";
//                 }
//             }
//         }
//     });
// }
//
// function MovieSearch(event) {
//     if (app.movie_search !== "") {
//         $.post(app.movie_type, app.movie_search, (data) => {
//             app.search_results = data;
//         }, "json");
//     }
// }
