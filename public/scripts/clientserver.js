var app;

function Init() {
  app = new Vue({
    el: "#app",
    data: {
      username:'',
      password:'',
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

function SendMessage(){
  console.log(app.new_message);
  app.new_message = "";
}

function PlayGame(){
  console.log("We want to play the game");
  $.get("/User", (data)=>{
    app.username= data.username;
//    app.password= data.password;
  })
}
function SignIn(event){
  console.log("signin");
  if(app.username !== "" && app.password !== "")
  {
    console.log("Username: "+app.username+" Password: "+app.password);
    GetJson('/login' + "?" + app.username+"|||"+app.password).then((data)=>{
      console.log(data);
    });

  }
  else{
    console.log("DID NOT GET IN Username: "+app.username+" Password: "+app.password);
  }
}
function SignUp(event){
  console.log("signup");
  if(app.username !== "" && app.password !== "")
  {
    console.log("Username: "+app.username+" Password: "+app.password);
    PostJson('/login' + "?" + app.username+"|||"+app.password).then((data)=>{
      console.log(data);
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
	if(event.keyCode == 13)
	{
		SendMessage();
	}
}
