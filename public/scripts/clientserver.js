var app;

function Init() {
  app = new Vue({
    el: "#app",
    data: {
      movie_search: "",
      movie_type: "/Titles",
      movie_type_options: [
        {value: "/Titles", text: "Movie/TV Show Title"},
        {value: "/Names", text: "People"}
      ],
      show_type: "search",
      search_results: [],
      selected_item: {},//{} for object
      leader_board:[{rank: 1, name: "Goofy", score:7500}],
      chat_messages:[{sender: 'Mickey', msg:'Donald did it better'}],
      new_message: ""
    },
    computed: {
      input_placeholder: function() {
        if (this.movie_type === "/Titles") {
          return "Search for a Movie/TV Show Title";
        }
        else {
          return "Search for People";
        }
      }
    }
  });
}

function MovieSearch(event) {
  if (app.movie_search !== "") {
    GetJson(app.movie_type + "?" + app.movie_search).then((data) => {
      app.show_type = "search";
      app.search_results = data;
    });
  }
}

function GetTitle(title){
  console.log("GetTitle --> "+title);
  GetJson(title).then((data) =>{
    app.selected_item = data;
    app.show_type = "title";
    //console.log(data);
  });
}

function GetName(name){
  console.log("GetName --> "+name);
  GetJson(name).then((data)=>{

   });
  // //	}, "json");
}

function GetJson(url, query){//Turn jquery get into a promise
  return new Promise((resolve,reject) => {
    $.get(url, query, (data) => {
      resolve(data);
    }, "json");
  });
}

function SendMessage(){
  console.log(app.new_message);
  app.new_message = "";
}

document.onkeydown = function(event){
	if(event.keyCode == 13)
	{
		SendMessage();
	}
}
