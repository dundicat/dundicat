$(document).ready(function() {

	$("body").click(function(){
	  var dropdown = $(window.parent.document).find(".dropdown");
	  dropdown.removeClass("open");
	  dropdown.find(">.dropdown-menu").hide();
	});
		
});