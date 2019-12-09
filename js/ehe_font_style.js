/**
 * 	编辑器有关文字样式的函数
 */

function effity_editor_font_style(){
	// 加粗
	$("#bold_button").click(function(){
		alert(1)
		if($(this).attr("clicked") != "unable")
		{
			if($("#ehe_main").hasCursor())// 判断具有焦点
			{
				document.execCommand("Bold");
				
				if($(this).attr("clicked") == "false")
				{
					$(this).attr("clicked", "true");
				}
				else
				{
					$(this).attr("clicked", "false");
				}
			}
		}
	});
	
	// 斜体
	$("#italic_button").click(function(){
		if($(this).attr("clicked") != "unable")
		{
			if($("#ehe_main").hasCursor())// 判断具有焦点
			{
				document.execCommand("Italic");
				
				if($(this).attr("clicked") == "false")
				{
					$(this).attr("clicked", "true");
				}
				else
				{
					$(this).attr("clicked", "false");
				}
			}
		}
	});
	
	// 下划线
	$("#underline_button").click(function(){
		if($(this).attr("clicked") != "unable")
		{
			if($("#ehe_main").hasCursor())// 判断具有焦点
			{
				document.execCommand("Underline");
				
				if($(this).attr("clicked") == "false")
				{
					$(this).attr("clicked", "true");
				}
				else
				{
					$(this).attr("clicked", "false");
				}
			}
		}
	});
}