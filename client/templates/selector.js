Template.selector.events ({
    'change #tv' : function (event) {
        Session.set('searchmovie', false);
        Session.set('mresults', false);
        Session.set('mrequests', false);
        Session.set('mresultsloaded', false);
        Session.set('tvsearch', true);
    },
    'change #movie' : function () {
        Session.set('tvsearch', false);
        Session.set('searchmovie', true);
    }
});