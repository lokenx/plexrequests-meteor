Template.search.events({
    'submit form': function(event){
    var o = "http://www.omdbapi.com/?type=movie&s=";
    var s = document.getElementById("search").value;
    var u = o + s;
         (function() {   
         $.getJSON(u)
            .done(function(data) {
             
            MovieSearch._collection.remove({}); 
            document.getElementById("search").blur();
             try {
                 var len = data['Search'].length;
             }
             catch(err) {
                var info = '<p>Hmm we got no results...<a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">try again!</a></p>';
                document.getElementById("info").setAttribute("class", "alert alert-warning");
                document.getElementById("info").innerHTML = info;
                 
                var list = document.getElementById("results");
                while (list.firstChild) {
                    list.removeChild(list.firstChild);
                }
                var mg = ""
                document.getElementById("overview").innerHTML = mg 
                return;
             }
            var mg = "<br><h3>Results from the OMDB:</h3>"
            document.getElementById("overview").innerHTML = mg;

            var list = document.getElementById("results");
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            for (i = 0; i < data['Search'].length; i++) {
                var t = data['Search'][i]['Title'];
                var y = data['Search'][i]['Year'];
                var imdb = data['Search'][i]['imdbID'];
                var ty = t + " (" + y + ")";

                var d = document.createElement("div");
                d.setAttribute("class", "radio")
                d.setAttribute("id", "for" + i);
                document.getElementById("results").appendChild(d);

                var l = document.createElement("label");
                l.setAttribute("for", imdb);
                l.setAttribute("id", "for" + imdb);
                document.getElementById("for" + i).appendChild(l);

                var n = document.createElement("input");
                n.setAttribute("type", "radio");
                n.setAttribute("value", ty);
                n.setAttribute("id", imdb);
                n.setAttribute("name", "movie");
                n.setAttribute("class", "movie");
                n.required = true;
                document.getElementById("for" + imdb).appendChild(n);

                old_html = document.getElementById("for" + imdb).innerHTML;
                ty = "<p>" + ty + "</p>"
                document.getElementById("for" + imdb).innerHTML = old_html + ty;

                var info = '<p>Not find what you were looking for? <a href="javascript:document.getElementById(\'search\').focus()" >Click here to search again!</a></p>';
                document.getElementById("info").setAttribute("class", "info");
                document.getElementById("info").innerHTML = info;

             //Attempting to input results into collection
                MovieSearch._collection.insert({
                    title: data['Search'][i]['Title'],
                    year: data['Search'][i]['Year'],
                    imdb: data['Search'][i]['imdbID'],
                });
                        
            }
             var s = document.createElement("input");
             s.setAttribute("type", "submit")
             s.setAttribute("value", "Request Movie!")
             s.setAttribute("class", "btn btn-primary");
             document.getElementById("results").appendChild(s);
             document.getElementById('overview').scrollIntoView({block: "end", behavior: "smooth"});
            })
            .fail(function() {
                var mg = '<p>Hmmm something went wrong with your search...<a href="javascript:document.getElementById(\'search\').focus()" class="alert-link">try again in a few moments!</a></p>';
                document.getElementById("info").setAttribute("class", "alert alert-danger");
                document.getElementById("info").innerHTML = mg;
        });
        })();
return false;
}})