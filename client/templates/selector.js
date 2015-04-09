Template.selector.events ({
    'change #tv' : function (event) {
        Session.set('searchmovie', false);
        Session.set('mresults', false);
        Session.set('mrequests', false);
        Session.set('mresultsloaded', false);
        Session.set('searchtv', true);
    },
    'change #movie' : function () {
        Session.set('tvsearch', false);
        Session.set('tresults', false);
        Session.set('trequests', false);
        Session.set('tresultsloaded', false);
        Session.set('searchtv', false);
        Session.set('searchmovie', true);
    }
});