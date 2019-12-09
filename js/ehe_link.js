/**
 * 	编辑器有关插入链接的函数
 */

var select_a = null;

function effity_editor_link(){
	// 编辑框初始绑定链接
	inner_a_function();
	
	// 链接按钮
	$("#link_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			$("#link_window").css({
				"right"	: "20px",
				"top"	: "105px"
			});
			
			set_float_window_top($("#link_window"));
			
			$("#link_window").show();
			
			$(this).attr("clicked", "true");
		}
		else if($(this).attr("clicked") == "true")
		{
			$("#link_window").hide();
			
			$(this).attr("clicked", "false");
		}
	});
	
	// 插入链接
	$("#fw_inesrt_link").click(function(){
		if($(this).attr("function") == "insert")
		{	
			var t = $("#ehe_main");
			
			var a = document.createElement("a");
			a.href = $("#fw_link_href").val();
			a.innerHTML = $("#fw_link_name").val();
			
			if(range_temp)
			{				
				range_temp.deleteContents();
				range_temp.insertNode(a);
			}
			else
			{
				t.append($(a));
			}
			
			// 设置光标
			range_temp.setEndAfter(a);
            range_temp.setStartAfter(a);
            var sel = rangy.getSelection();
            sel.setSingleRange(range_temp);
			t.focus();
			
			inner_a_function();
		}
		else
		{				
			$(in_a).attr("href", $("#fw_link_href").val());
			$(in_a).html($("#fw_link_name").val());
		}
	});
	
	// 菜单显示
	$("#a_menu").mouseenter(function(){
		$(this).attr("show", "true");
	});
	
	$("#a_menu").mouseleave(function(){
		$(this).attr("show", "false");
		setTimeout(function(){
			if($("#a_menu").attr("show") == "false")
			{
				if(select_a != null)
				{
					close_a_menu();
				}
			}
		}, 200);
	});
	
	// 取消超链接
	$("#a_cancel").click(function(){
		select_a.replaceWith(select_a.html());
		$("#a_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});
	
	// 删除
	$("#a_delete").click(function(){
		select_a.remove();
		$("#a_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});
}

// 以下为粘贴url
function url_paste(url){
	setTimeout(function(){url_after_paste(url)}, 300);
}

function url_after_paste(url){
	var a_href_obj = url;
	var a_name_obj = $("#fw_link_name");
	
	var a_href = a_href_obj.val();
	var a_name = a_name_obj.val();
	
	var re = /^https?://///;
	if(!re.test(a_href))
	{
		a_href = "http://" + a_href;
	}
	
	a_href_obj.val(a_href);
}

// 这个函数是鼠标移入移出代码框时的操作
function inner_a_function(){

	var a = $("#ehe_main").find("a");
	
	a.unbind();
	a.mouseenter(function(){
		
		select_a = $(this);
		
		update_a_menu_position();
		
		var menu = $("#a_menu");
		menu.show();
		
		$("#ehe_main").find("a").css({"background-color" : "transparent"});
		select_a.css({"background-color" : "#eff6fa"});
	});
	
	a.mouseleave(function(){
		var menu = $("#a_menu");
		
		menu.attr("show", "false");
		setTimeout(function(){
			if(menu.attr("show") == "false")
			{
				if(select_a != null)
				{
					close_a_menu();
				}
			}
		}, 300);
	});
}

// 这个函数有关链接的按键抬起事件
function keyup_link(event){	

}

// 这个函数用于更新链接菜单的位置
function update_a_menu_position(){	
	if(select_a != null)
	{
		var this_top   	= select_a.offset().top,
			this_left  	= select_a.offset().left,
			this_hight 	= select_a.height(),
			this_width 	= select_a.width(),
			top_top		= $("#editor_top").offset().top,
			bottom_top 	= $("#editor_bottom").offset().top;

		var menu = $("#a_menu");
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

// 关闭a菜单
function close_a_menu(){
	$("#a_menu").hide();
	select_a.css({"background-color" : "transparent"});
	select_a = null;
}