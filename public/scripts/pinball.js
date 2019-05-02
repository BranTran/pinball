//var app;
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default:'arcade',
    arcade: {
      gravity: {y: 200},
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
  this.load.image('pinball',root+'assets/pinball.jpg');
  this.load.image('black-block',root+'assets/black-block.jpg');
}

function create(){
  var platforms;

  this.add.image(400, 300, 'space');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'black-block').setScale(2).refreshBody();

  var player;

  player = this.physics.add.sprite(100,450,'pinball');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);





}

function update(){

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
