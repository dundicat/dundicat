$(document).ready(function() {

	ajustHeader();
	themeDefault = "teal";
	themeCurr = themeDefault;
	if($.cookie("themeColors") != null&&$.cookie("themeColors") !=''){
		themeCurr = $.cookie("themeColors");
	}
	$("body").addClass("theme-"+themeCurr).attr("data-theme","theme-"+themeCurr);

		
	$(".user .dropdown > a[data-toggle=dropdown]").click(function(e){
		$(".user .dropdown").removeClass("open");
		$(".user .dropdown").find(">.dropdown-menu").hide(); 
		var $el = $(this).parent();
		if($el.hasClass("open")){
			$el.find(">.dropdown-menu").hide(); 
			$el.removeClass("open");
		}else{
			$el.find(">.dropdown-menu").show(); 
			$el.addClass("open");
		}
  
	});

	$("body").click(function(e){
		var target = $(e.target);
		var $el = $(".user .dropdown");
		if(target.parents(".dropdown").length == 0&& $el.hasClass("open")){
			// close all
			$el.removeClass("open");
			$el.find(">.dropdown-menu").hide(); 
		}
	});
		
  
  $(".subnav-title").click(function(){
	  var $em = $(this).parent();
	  if($em.hasClass("open")){
		$em.removeClass("open")
		$(this).find("i").attr("class","icon-plus");  
		$em.find(">.subnav-menu").addClass("hide");  
	  }else{
		$em.addClass("open")
		$(this).find("i").attr("class","icon-minus");  
		$em.find(">.subnav-menu").removeClass("hide");  
	  }
	  
  });
  
  $(".subnav-menu li").click(function(){
	  $(".subnav-menu li").removeClass("active");
	  $(this).addClass("active");
  });
  
  $(".set-fullscreen").click(function(){
  	if($(".sidebar").hasClass("hide")){
		$(".sidebar").removeClass("hide");
		$(".wrapper").css({"padding-left":"200px"});
		$(this).removeClass("open");
	}else{
		$(".sidebar").addClass("hide");
		$(".wrapper").css({"padding-left":"0px"});
		$(this).addClass("open");
	}
  
  });
  
  menuLength = 90;
  $("#scroll-nav-left").click(function(){
 	 menuWidth = $(".scroll-content").width();
	  var position = parseInt($(".main-nav").css("padding-left")); 
	  var contentwidth = parseInt($(".main-nav li").size()*menuLength);
	  position = ((position + contentwidth) > 0) ? 0 : (position + menuWidth); 
	  $(".main-nav").animate({marginLeft: position + "px" },300);
	   
  
  })
  $("#scroll-nav-right").click(function(){
 	 menuWidth = $(".scroll-content").width();
	  var position = parseInt($(".main-nav").css("padding-left")); 
	  var contentwidth = parseInt($(".main-nav li").size()*menuLength);
		position = ((contentwidth - position) > menuWidth) ? ( - menuWidth) : position;
	  $(".main-nav").animate({marginLeft: position + "px" },300); 
  
  })
  
  $(".theme-colors > li > span").hover(function(e){
	  var $el = $(this);
	  $("body").attr("class","theme-"+$el.attr("class"));
	  $("body",window.frames["dataFrame"].document).attr("class","theme-"+$el.attr("class"));
  }, function(){
	  var $el = $(this);
	  $("body").attr({"data-theme":"theme-"+themeCurr,"class":"theme-"+themeCurr});;
	  $("body",window.frames["dataFrame"].document).attr("class","theme-"+themeCurr);
  }).click(function(){
	  var $el = $(this);
	  $("body").attr({"data-theme":"theme-"+$el.attr("class"),"class":"theme-"+$el.attr("class")});
	  $("body",window.frames["dataFrame"].document).attr("class","theme-"+$el.attr("class"));
	  $.cookie("themeColors",$el.attr("class"));
	  themeCurr = $el.attr("class");
  });
  
});

$(window).resize(function(e){
	e.stopPropagation();
    ajustHeader();
//    getSidebarScrollHeight();
//    resizeContent();
//    resizeHandlerHeight();
});

//IE 6-8 不支持css调整菜单
function ajustHeader(){
	
	$("#dataFrame").height($(".main").height());
	if (!$.support.leadingWhitespace) {
		var windowWidth = $(window).width();
		if(windowWidth<=780){
			
			$(".header .scroll-content").width(360);
			$(".icon-nav,.userinfo").hide();
			
		}else if(windowWidth<=990&&windowWidth>780){
			
			$(".header .scroll-content").width(360);
			$(".icon-nav").hide();
			$(".userinfo").show();
			
		}else if(windowWidth<=1080&&windowWidth>990){
			
			$(".header .scroll-content").width(360);
			$(".icon-nav").show();
			$(".userinfo").show();
			
		}else if(windowWidth<=1170&&windowWidth>1080){
			
			$(".header .scroll-content").width(450);
			$(".icon-nav").show();
			$(".userinfo").show();
			
		}else if(windowWidth<=1260&&windowWidth>1170){
			
			$(".header .scroll-content").width(540);
			$(".icon-nav").show();
			$(".userinfo").show();
			
		}else if(windowWidth>1260){
			
			$(".header .scroll-content").width(630);
			$(".icon-nav").show();
			$(".userinfo").show();
			
		}
	}
}
