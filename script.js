$(document).ready(function() {
  $("#tabs").tabs();
  $("#authlink").button().text("Sign In");
  $("#genderSearch").autocomplete({
    source : ["Male", "Female"]
  });
//  $("#searchForm").validate();
  $("#searchForm").submit(function() {
      // validate and process form here
      getData("familytree/v2/search?"+$(this).serialize(), handleSearchResults);
      return false;
    });
  getData("identity/v2/user", function(data) {
    if (data.users && data.users[0]) {
      $("#authlink").text("Sign Out").attr("href", "").button().click(signOut);
      $(".welcome span").html("Welcome, "+data.users[0].names[0].value);
    }
    else {
    var $dialog = $('<div></div>').load("oauth.php .message");
      $(".message button").button();
      $dialog.dialog({
    		title: 'Authentication Required',
    		width: 400,
    		position: ['center', 60],
    		dialogClass: 'mydialog'    		
    	});
    }
  });
});

function getData(request, callback) {
  var params = {
    dataFormat: "application/json"
  }
  var delimeter = request.indexOf("?") >= 0 ? "&" : "?";
  var url = "http://www.dev.usys.org/" + request + delimeter + $.param(params);
  console.log(url);
  $.getJSON("proxy.php", {
      "send_cookies" : 1,
      "mode" : "native",
      "url" : url
    }, callback);
}

function handleSearchResults(data) {
console.log("data", data);
if (data.searches && data.searches[0]) {
  $results = $("#searchResults");
  $results.find("tbody").empty();
  $results.find("caption").text("Search Results ("+data.searches[0].count+" matches)");
  $.each(data.searches[0].search, function(i,item) {
    console.log(i, item);
    $("<tr><td>"+item.id+"</td><td>"+item.person.assertions.names[0].value.forms[0].fullText+"</td><td>"+item.score+"</td></tr>").appendTo($results);
});
}
}

function getPedigree(personId) {
if (data.users && data.users[0]) {
  $.each(data.persons.person, function(i,item){
    log("item: ",i,item);
    $("<span/>").text(item.ref).appendTo("#main");
    if ( i == 3 ) return false;
  });
}
}

function signOut() {
  $.cookie("fssessionid", "");
  getData("identity/v2/logout", null);
}