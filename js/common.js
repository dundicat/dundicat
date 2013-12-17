$(document).ready(function() {

	$("body").click(function(){
	  var dropdown = $(window.parent.document).find(".dropdown");
	  dropdown.removeClass("open");
	  dropdown.find(">.dropdown-menu").hide();
	});
		
	themeDefault = "teal";
	themeCurr = themeDefault;
	if($.cookie("themeColors") != null&&$.cookie("themeColors") !=''){
		themeCurr = $.cookie("themeColors");
	}
	 $("body").attr("class","theme-"+themeCurr);

});