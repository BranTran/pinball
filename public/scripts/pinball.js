//var app;
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
  this.load.image('pinball',root+'assets/pinball.png');
  this.load.image('ground',root+'assets/platform.png');
  this.load.image('wall',root+'assets/wall.png');
}

var player;
var platforms;

function create(){

	this.add.image(400, 300, 'space');

	platforms = this.physics.add.staticGroup();
//Center of the item (x,y)
	platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	platforms.create(200,16,'ground');
	platforms.create(600,16,'ground');
	platforms.create(16,16,'wall');
	platforms.create(16,400,'wall');
	platforms.create(784,16,'wall');
	platforms.create(784,400,'wall');
	platforms.create(716,400,'wall');




  	player = this.physics.add.sprite(750,450,'pinball');

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
	else if(cursors.left.isDown)
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
