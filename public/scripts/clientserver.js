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
	    selected_item: {}//{} for object
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
//	$.get(name, (data) =>{
		var known_titles = data.known_for_titles.split(",");//split on comma the string
		var title_promises = [];
		for(var i = 0; i < known_titles.length; i++){
			title_promises.push(GetJson("/titles/" + known_titles[i]));
		}
		Promise.all(title_promises).then((results) => {
			app.selected_item = data;
			app.show_type = "name";
			app.selected_item.known_for_titles = "";
			for(i = 0; i < results.length; i++){
				app.selected_item.known_for_titles += results[i].primary_title+", ";
			}
		});
		//console.log(data);
	});
//	}, "json");
}

function GetJson(url, query){//Turn jquery get into a promise
	return new Promise((resolve,reject) => {
		$.get(url, query, (data) => {
			resolve(data);
		}, "json");
	});
}
