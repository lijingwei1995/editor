// 辅助链接窗口的变量
var inesrt_a_href = "",
	insert_a_name = "";

// 此变量用于辅助失去焦点的编辑框
var range_temp = null;

// focus position
var in_code 		= 	null,
	in_pre 			= 	null,
	in_blockquote 	= 	null,
	in_li			=	null,
	in_a			=	null,
	in_h1			=	null,
	in_h2			=	null;

$(document).ready(function() {

	reset_effity_HTML_editor_height();
	ehe_before_processing();

	// 编辑框大小变换	
	$(window).resize(function() {
		reset_effity_HTML_editor_height();
	});

	// 各部分功能函数
	effity_editor_font_style();
	effity_editor_link();
	effity_editor_image();
	effity_editor_code();
	effity_editor_inner_code();
	effity_editor_ul();
	effity_editor_ol();
	effity_editor_blockquote();
	effity_editor_heading();
	effity_editor_math();
	
	$("#ehe_main").focus();
	
	$("body").mouseup(function(event){
		if($("#ehe_main").hasCursor())
		{
			// 焦点暂存
			range_temp = getFirstRange(); 
		}
	});
	
	$("#ehe_main").focus(function(){
		// 点击回主编辑器时还原公式编辑器状态
		if($("#fw_inesrt_math").attr("function") == "change")
		{
			// 取消选择标定
			edit_math.css("outline", "none");
			
			// 窗口样式
			$("#math_window").removeAttr("data-state");

			$("#fw_inesrt_math").attr("function", "insert");
			$("#fw_inesrt_math").val("插入");
			
			// 数据传递
			$("#math_content").val(insert_math_content);
			$("#math_display_" + insert_math_display).prop("checked", "checked");
			
			// 重新渲染
			render_math();
		}
		
		focus_judge();
	});
	
	$("#ehe_main").mouseup(function(event){		
		// 焦点判断
		focus_judge();
	});
	
	$("#ehe_main").keyup(function(event){
		// 焦点暂存
		range_temp = getFirstRange(); 
		
		// 更新菜单位置
		update_pre_menu_position();
		update_a_menu_position();
		update_lic_menu_position();
		update_math_menu_position();
		
		// 焦点判断
		focus_judge();
	});
	
	// 键盘按下时的
	$("#ehe_main").keydown(function(event){
		// 更新菜单位置
		update_pre_menu_position();
		update_a_menu_position();
		update_lic_menu_position();
		update_math_menu_position();
		
		// 其它操作
		keydown_code(event);
		keydown_blockquote(event);
	});
		
	$("#ehe_main_wrapper").scroll(function(){
		// 更新菜单位置
		update_pre_menu_position();
		update_a_menu_position();
		update_lic_menu_position();
		update_math_menu_position();
		
		// 滚轮后隐藏鼠标移出的菜单
		if(select_pre != null)
		{
			if (!select_pre.is(':hover')) {
				close_pre_menu();
		    }
		}
		if(select_a != null)
		{
			if (!select_a.is(':hover')) {
				close_a_menu();
		    }
		}		
		if(select_lic != null)
		{
			if (!select_lic.is(':hover')) {
				close_lic_menu();
		    }
		}
	});
	
	// 防止焦点丢失
	var prevent_blur = 
		".ehe_menu_button,"		+
		"#ehe_menu,"			+
		"#ehe_main_placeholder"	;
	$(prevent_blur).bind('mousedown',function(event){
		event.preventDefault();
	});	
});

//鼠标点击、键盘弹起检测光标事件
function focus_judge(){
	// 获得鼠标位置
	var	range = getFirstRange();
	var sel = rangy.getSelection();
	var n = sel.focusNode;
	
	in_code 		= 	null;
	in_pre 			= 	null;
	in_blockquote 	= 	null;
	in_li			=	null;
	in_a			=	null;
	in_h1			=	null;
	in_h2			=	null;
	
	if(n != null)
	{
		var className, tagName;
		
		className = n.className;
		tagName   = n.tagName;
		id = n.id;
		
		while(id != "ehe_main")
		{
			if(tagName == "CODE")
			{
				in_code = n;
			}
			
			if(tagName == "PRE")
			{
				in_pre = n;
			}
			
			if(tagName == "BLOCKQUOTE")
			{
				in_blockquote = n;
			}
			
			if(tagName == "LI")
			{
				in_li = n;
			}
			
			if(tagName == "A")
			{	
				in_a = n;
			}
			
			if(tagName == "H1")
			{	
				in_h1 = n;
			}
			
			if(tagName == "H2")
			{	
				in_h2 = n;
			}
			
			n = n.parentNode;
			
			if(n == null)
			{
				break;
			}
			
			className = n.className;
			tagName   = n.tagName;
			id = n.id;
		}
	}
	
	set_editor_menu_able();
	
	// 变更B按钮
	var isBold = document.queryCommandState("Bold");
	
	if(isBold)
	{
		$("#bold_button").attr("clicked", "true");
	}
	else
	{
		$("#bold_button").attr("clicked", "false");
	}
	
	// 变更I按钮
	var isItalic = document.queryCommandState("Italic");
	
	if(isItalic)
	{
		$("#italic_button").attr("clicked", "true");
	}
	else
	{
		$("#italic_button").attr("clicked", "false");
	}
	
	// 变更U按钮
	var isUnderline = document.queryCommandState("Underline");
	
	if(isUnderline)
	{
		$("#underline_button").attr("clicked", "true");
	}
	else
	{
		$("#underline_button").attr("clicked", "false");
	}
	
	// 侦测链接
	var d 			= $("#link_window");
	var link_button	= $("#fw_inesrt_link");
	var a_href_obj	= $("#fw_link_href");
	var a_name_obj	= $("#fw_link_name");
	
	$("#ehe_main").find("a").removeAttr("style");
	
	if(in_a != null)
	{
		set_editor_menu_unable();
		
		$(in_a).css("outline", "1px dashed rgb(127,127,127)");
		
		// 有关链接面板的切换
		d.show();
		$(".link_button").attr("clicked", "true");
		
		$("#link_window").attr("data-state", "active");
		set_float_window_top($("#link_window"));
		
		if(link_button.attr("function") == "insert")
		{
			inesrt_a_href = a_href_obj.val();
			inesrt_a_name = a_name_obj.val();
			
			link_button.val("变更");
			link_button.attr("function", "change");
		}
		
		// 获取in_a的信息
		a_href_obj.val($(in_a).attr("href"));
		a_name_obj.val($(in_a).html());
	}
	else
	{
		if(link_button.attr("function") == "change")
		{
			a_href_obj.val(inesrt_a_href);
			a_name_obj.val(inesrt_a_name);
			
			$("#link_window").removeAttr("data-state");
			
			link_button.val("插入");
			link_button.attr("function", "insert");
		}
	}
	
	// 侦测行内代码
	if(in_code != null)
	{
		set_editor_menu_unable();
		$("#inner_code_button").attr("clicked", "true");
	}
	
	// 侦测标题
	$("#ehe_main").find("h1").removeAttr("data-edit");
	
	if(in_h1 != null)
	{
		$(in_h1).attr("data-edit", "unedit");
		
		set_editor_menu_unable();
		$("#h1_button").attr("clicked", "true");
	}
	
	$("#ehe_main").find("h2").removeAttr("data-edit");
	
	if(in_h2 != null)
	{
		$(in_h2).attr("data-edit", "unedit");
		
		set_editor_menu_unable();
		$("#h2_button").attr("clicked", "true");
	}
	
	// 侦测代码框
	if(in_pre != null)
	{
		set_editor_menu_unable();
		$("#code_button").attr("clicked", "true");
	}
	
	// 侦测列表
	if(in_li != null)
	{
		$("#blockquote_button").attr("clicked", "unable");
		$("#h1_button,#h2_button").attr("clicked", "unable");
	}
	
	// 侦测引用
	if(in_blockquote != null)
	{
		$("#blockquote_button").attr("clicked", "true");
		$("#h1_button,#h2_button").attr("clicked", "unable");
	}
	
}

// 使编辑器所有按钮失效
function set_editor_menu_unable(){
	var button			=	$(".ehe_menu_button");
	var link_button		=	$("#link_button");
	var picture_button	=	$("#picture_button");
	var math_button		=	$("#math_button");
	
	button.each(function(){
		if(
				$(this)[0] != link_button[0] && 
				$(this)[0] != picture_button[0] && 
				$(this)[0] != math_button[0]
		) 
		{
			$(this).attr("clicked", "unable");
		}
	});
	
	$(".fw").attr("data-state", "forbid");
}

// 使编辑器所有按钮生效
function set_editor_menu_able(){
	var button			=	$(".ehe_menu_button");
	var link_button		=	$("#link_button");
	var picture_button	=	$("#picture_button");
	var math_button		=	$("#math_button");
	
	button.each(function(){
		if(
				$(this)[0] != link_button[0] && 
				$(this)[0] != picture_button[0] && 
				$(this)[0] != math_button[0]
		) 
		{
			$(this).attr("clicked", "false");
		}
	});
	
	$(".fw").each(function(){
		if($(this).attr("data-state") != "active")
		{
			$(this).removeAttr("data-state");
		}
	});
}

// 重新设置按钮状态
function reset_editor_menu(){
	var button			=	$(".ehe_menu_button");
	button.each(function(){
		$(this).attr("clicked", "false");
	});
	$(".fw").each(function(){
		$(this).removeAttr("data-state");
	});
}

// 替换标签文本
function tag_handler(str){
	re = /</g;
	str = str.replace(re, "&lt;");
	re = />/g;
	str = str.replace(re, "&gt;");
	return str;
}