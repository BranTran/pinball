//var app;
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
/*  physics: {
    default:'arcade',
    arcade: {
      gravity: {y_200}
    }
  },*/

//  scene:[example1]

  scene:{
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload(){
  this.load.image('space','assets/space.jpg');
  this.load.image('pinball','assets/pinball.jpg')
}

function create(){
  this.add.image(400, 300, 'space');
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
