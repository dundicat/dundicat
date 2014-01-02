$(document).ready(function() {

	$("body").click(function(){
	  var dropdown = $(window.parent.document).find(".dropdown");
	  dropdown.removeClass("open");
	  dropdown.find(">.dropdown-menu").hide();
	});
	$("body").click(function(e){
		var target = $(e.target);
		var $el = $(".ColVis_collection");
		if(target.closest(".ColVis_Button").length == 0){
			// close all
			$el.hide();
		}
	});
	// 皮肤	
	themeDefault = "teal";
	themeCurr = themeDefault;
	if($.cookie("themeColors") != null&&$.cookie("themeColors") !=''){
		themeCurr = $.cookie("themeColors");
	}
	 $("body").attr("class","theme-"+themeCurr);
	 
	 // form advance
	 $("#more-searchItem").click(function(){
		 var el = $(this).parents(".data-search").find(".advance-search");
		 if(el.hasClass("hide")){
			 $(this).find("i").attr("class","icon-chevron-down");
			 el.removeClass("hide");
		 }else{
			 $(this).find("i").attr("class","icon-chevron-right");
			 el.addClass("hide");
		 }
		 
	 });
	 
});