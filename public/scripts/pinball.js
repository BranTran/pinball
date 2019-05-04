//var app;

var width = 400;
var height = 600;
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

  scene:{
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var root = 'https://brantran.github.io/pinball/public/';

function preload(){
  this.load.image('space',root+'assets/space.jpg');
  this.load.image('block',root+'assets/40px_black_square.png');
  this.load.image('LRTri',root+'assets/40px_black_LowRight_triangle.png');
  this.load.image('URTri',root+'assets/40px_black_UpRight_triangle.png');
  this.load.image('LLTri',root+'assets/40px_black_LowLeft_triangle.png');
  this.load.image('ULTri',root+'assets/40px_black_UpLeft_triangle.png');
  this.load.image('pinball',root+'assets/pinball.png');
//  this.load.image('ground',root+'assets/platform.png');
//  this.load.image('wall',root+'assets/wall.png');
}

var player;
var platforms;
var offset = 20;
function create(){

	this.add.image(400, 300, 'space');

	platforms = this.physics.add.staticGroup();
//Center of the item (x,y)

//CEILING AND FLOOR
  for(var x = offset; x < width; x = x+(2*offset))
  {
    platforms.create(x,offset,'URTri');
    platforms.create(x,(height-offset),'LLTri');
  }
//Walls
  for(var y = offset; y < height; y = y+(2*offset))
  {
    platforms.create(offset,y,'ULTri');
    if(y >= height/2 && y <= ((height/2) + offset)){
      platforms.create((width-offset),y,'LRTri');
    }
    else{
      platforms.create((width-offset),y,'block');
    }

  }



  	player = this.physics.add.sprite((width-offset),(height/2)-(offset/2),'pinball');

  	player.setBounce(0.5);
  	player.setCollideWorldBounds(true);

	this.physics.add.collider(player, platforms);



}

function update(){

var cursors = this.input.keyboard.createCursorKeys();


	if(cursors.up.isDown && player.body.touching.down)
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
			console.log("we are touching left")
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
