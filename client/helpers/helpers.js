UI.registerHelper('resultsloaded',function(input){
  return Session.get("resultsloaded");
});

UI.registerHelper('searchingresults',function(input){
  return Session.get("searchingresults");
});

UI.registerHelper('noresults',function(input){
  return Session.get("noresults");
});

UI.registerHelper('searcherror',function(input){
  return Session.get("searcherror");
});