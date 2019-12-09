var last_math = "";
var select_math = null;
var edit_math = null;// 编辑时记录的元素

var inesrt_math_display = "";
var insert_math_content = "";

function effity_editor_math(){
	// 窗口 - 初始渲染
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"math_preview_content"]);
	
	// 主编机器菜单栏 - 公式按钮
	$("#math_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			$("#math_window").css({
				"right"	: "20px",
				"top"	: "105px"
			});
			
			set_float_window_top($("#math_window"));
			
			$("#math_window").show();
			
			$(this).attr("clicked", "true");
		}
		else if($(this).attr("clicked") == "true")
		{
			$("#math_window").hide();
			
			$(this).attr("clicked", "false");
		}
	});
	
	// 窗口 - 公式编辑框
	$("#math_content").keyup(function(){
		update_math();
	});
	$("#math_content").mouseup(function(){
		update_math();
	});
	$("#math_content").bind("paste", function(){
		setTimeout(update_math, 300);
	});

	// 窗口 - 插入公式 & 修改公式
	$("#fw_inesrt_math").click(function(){
		var math_display = $("input[name='math_display']:checked").val();
		var math_content = $("#math_content").val();
		var t            = $("#ehe_main");

		if(math_content == "")
			return;
		
		if($(this).attr("function") == "insert")	
		{	
			var math = document.createElement("img");
			math.className = "math";
			math.setAttribute("data-display", math_display);
			math.setAttribute("data-content", math_content);
			math.src = generate_svg($("#math_preview_content").find("svg"));
			
			if(range_temp)
			{				
				range_temp.deleteContents();
				range_temp.insertNode(math);
			}
			else
			{
				t.append($(math));
			}
			
			// 设置光标
			range_temp.setEndAfter(math);
            range_temp.setStartAfter(math);
            var sel = rangy.getSelection();
            sel.setSingleRange(range_temp);
			t.focus();
						
			inner_math_function();
		}
		else
		{	
			edit_math.removeAttr("width");
			edit_math.removeAttr("height");
			edit_math.removeAttr("style");
			edit_math.css("outline", "1px dashed rgb(127,127,127)");
			
			edit_math.attr("data-display", math_display);
			edit_math.attr("data-content", math_content);
			edit_math.attr("src", generate_svg($("#math_preview_content").find("svg")));
		}
	});

	// 菜单 - 编辑公式
	$("#math_edit").click(function(){
		edit_math_function();
	});
	
	// 菜单 - 删除
	$("#math_delete").click(function(){
		select_math.remove();
		$("#math_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});

	// 菜单 - 菜单显示
	$("#math_menu").mouseenter(function(){
		$(this).attr("show", "true");
	});
	$("#math_menu").mouseleave(function(){
		$(this).attr("show", "false");
		setTimeout(function(){
			if($("#math_menu").attr("show") == "false")
			{
				if(select_math != null)
				{
					close_math_menu();
				}
			}
		}, 200);
	});
}

// 这个函数是鼠标移入元素时的操作
function inner_math_function(){

	var math = $("#ehe_main").find(".math");
	
	math.unbind();
	math.mouseenter(function(){
		
		select_math = $(this);
		
		update_math_menu_position();
		
		var menu = $("#math_menu");
		menu.show();
		
		$("#ehe_main").find(".math").css({
			"background-color" : "transparent"
			
		});
		select_math.css({"background-color" : "#eff6fa"});
	});
	math.mouseleave(function(){
		var menu = $("#math_menu");
		
		menu.attr("show", "false");
		setTimeout(function(){
			if(menu.attr("show") == "false")
			{
				if(select_math != null)
				{
					close_math_menu();
				}
			}
		}, 300);
	});
	
	// 鼠标点击公式进入编辑状态
	math.click(function(){
		edit_math_function();
	});
}

// 这个函数用于更新菜单的位置
function update_math_menu_position(){	
	if(select_math != null)
	{
		var this_top   = select_math.offset().top,
			this_left  = select_math.offset().left,
			this_hight = select_math.height(),
			this_width = select_math.width(),
			top_top		= $("#editor_top").offset().top,
			bottom_top = $("#editor_bottom").offset().top;

		var menu = $("#math_menu");
		var menu_left = this_left;		
		var new_top = this_top + this_hight + 7;
		
		if(new_top < top_top) // 顶部边界
		{
			
			menu.hide();
		}
		else
		{
			menu.show();
			
			if(new_top > bottom_top + 3) // 底部边界
			{
				new_top = bottom_top + 3;
			}
		}
		
		menu.attr("show", "true");
		menu.css("top", new_top + "px");
		menu.css("left", menu_left + "px");
	}
}

// 关闭菜单
function close_math_menu(){
	$("#math_menu").hide();
	select_math.css({"background-color" : "transparent"});
	select_math = null;
}

// 检查数学更新
function update_math(){
	var new_math = $("#math_content").val();
	
	if(new_math != last_math)
	{
		render_math();
	}

	last_math = new_math;
}

// 重新渲染数学预览
function render_math(){
	$("#math_preview_content").html("\\["+$("#math_content").val()+"\\]");
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"math_preview_content"]);
}

// 生成svg
function generate_svg(svg_resource){
	var math_svg = svg_resource.clone();
	
	math_svg.find("use").each(function(){
		var use = $($(this).attr("href")).clone();
		
		var x = $(this).attr("x") ? $(this).attr("x") : 0;
		var y = $(this).attr("y") ? $(this).attr("y") : 0;
		
		use.attr("transform", "translate(" + x + "," + y + ")");				
		if($(this).attr("transform")) // 判断其他变换
		{
			use.wrap("<g></g>");
			var p = use.parent();
			p.attr("transform", $(this).attr("transform"));
			$(this).replaceWith(p.outerHTML());
		}
		else
		{
			$(this).replaceWith(use.outerHTML());
		}
	});
	
	if(isFirefox || isChrome)
	{
		math_svg.attr("xmlns", "http://www.w3.org/2000/svg");
		return "data:image/svg+xml;utf8," + math_svg.outerHTML();
	}
	
	if(isIE || isEdge)
	{
		var str = math_svg.outerHTML();
		
		re = /xmlns:NS[0-9]*=""/g;
		str = str.replace(re, "");
		re = /NS[0-9]*:/g;
		str = str.replace(re, "");

		return "data:image/svg+xml," + encodeURIComponent(str);
	}
}

// 编辑公式
function edit_math_function(){
	// 选择标定
	edit_math = select_math;
	$("#ehe_main").find(".math").css("outline", "none");
	edit_math.css("outline", "1px dashed rgb(127,127,127)");
	
	// 窗口样式
	$("#math_window").css({
		"right"	: "20px",
		"top"	: "105px"
	});
	$("#math_window").show();
	$(".fw").attr("data-state", "forbid");
	set_editor_menu_unable();
	$("#math_window").attr("data-state", "active");
	set_float_window_top($("#math_window"));

	$("#fw_inesrt_math").attr("function", "change");
	$("#fw_inesrt_math").val("变更");
	
	// 菜单隐藏
	$("#math_menu").hide();
	
	// 数据传递
	insert_math_display = $("input[name='math_display']:checked").val();
	insert_math_content = $("#math_content").val();
	$("#math_content").val(select_math.attr("data-content"));
	$("#math_display_" + select_math.attr("data-display")).prop("checked", "checked");
	$("#math_content").focus();
	
	// 重新渲染
	render_math();

	
	//focus_judge();
}