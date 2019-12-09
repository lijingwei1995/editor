function ehe_before_processing(){
	// 删除div的所有属性
	$("#ehe_main").find("div").each(function() {
		var attributes = $.map(this.attributes, function(item) { 
			return item.name; 
		}); 
		var tag = $(this); 
		$.each(attributes, function(i, item) { 
				tag.removeAttr(item); 
		});
	});
	
	var str = $("#ehe_main").html();
	
	// 将块元素+</div><div>替换为<br>
	str = str.replace(/(<\/(blockquote|ul|ol|pre|table)>)\s*<\/div>\s*<div>/ig, "$1<br>");
	
	// 将其它</div><div>替换为<br><br>
	str = str.replace(/<\/div>\s*<div>/ig, "<br><br>");
	
	// 删除单独的<div>或</div>
	str = str.replace(/<\/div>|<div>/ig, "");
	
	$("#ehe_main").html(str);
	
	// 将.math标签转换为图片
	$("#ehe_main").find(".math").each(function(){
		if($(this).attr("data-display") == "inline")
		{
			$(this).html("\\("+$(this).attr("data-content")+"\\)");
		}
		else
		{
			$(this).html("\\["+$(this).attr("data-content")+"\\]");
		}
	});
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"ehe_main"], function () {
		$("#ehe_main").find(".math").each(function(){
			$(this).attr("src", generate_svg($(this).find("svg")));
			$(this).html("");
		});
		
		inner_math_function();
	});
	
	inner_pre_function();
	inner_lic_function();
	inner_a_function();
}