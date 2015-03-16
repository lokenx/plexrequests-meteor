Template.requests.events({
    'click #requests': function(event){
        document.getElementById("reqmov").className = "row col-md-offset-3 col-md-7";
        return false;
    }
});