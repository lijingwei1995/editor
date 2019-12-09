/**
 * 	编辑器有关行内代码的函数
 */

var select_lic = null;

function effity_editor_inner_code(){
	// 编辑框初始绑定行内代码
	inner_lic_function();
	
	// 行内代码
	$("#inner_code_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			var t = $("#ehe_main");
			
			if(range_temp)
			{
				var select_content = range_temp.toString();
				select_content = tag_handler(select_content);
				
				if(select_content != "")
				{
					range_temp.deleteContents();
					
					var inner_code = document.createElement("pre");
					inner_code.innerHTML = select_content;
					
					range_temp.insertNode(inner_code);
					
					range_temp.setEndAfter(inner_code);
					range_temp.setStartBefore(inner_code);
				    var sel = rangy.getSelection();
				    sel.setSingleRange(range_temp);
				    
				    t.focus();
					document.execCommand("RemoveFormat");
					
					$(inner_code).replaceWith("<code>" + $(inner_code).html() + "</code>");
					
					t.blur();
					
					inner_lic_function();
				}
			}
		} else if($(this).attr("clicked") == "true") {
			// 判断具有焦点
			var t = $("#ehe_main");
			
			var lic = $(in_code);
			lic.replaceWith(lic.html());
			
			focus_judge();
			t.blur();
		}
	});
	
	// 代码菜单显示
	$("#lic_menu").mouseenter(function(){
		$(this).attr("show", "true");
	});
	
	$("#lic_menu").mouseleave(function(){
		$(this).attr("show", "false");
		setTimeout(function(){
			if($("#lic_menu").attr("show") == "false")
			{
				if(select_lic != null)
				{
					close_lic_menu();
				}
			}
		}, 200);
	});
	
	// 取消超链接
	$("#lic_cancel").click(function(){
		select_lic.replaceWith(select_lic.html());
		$("#lic_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});
	
	// 删除
	$("#lic_delete").click(function(){
		select_lic.remove();
		$("#lic_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});
}

// 这个函数是鼠标移入移出代码框时的操作
function inner_lic_function(){

	var lic = $("#ehe_main").find("code");
	
	lic.unbind();
	lic.mouseenter(function(){
		
		select_lic = $(this);
		
		update_lic_menu_position();
		
		var menu = $("#lic_menu");
		menu.show();
		
		$("#ehe_main").find("code").css({"outline" : "none"});
		select_lic.css({"outline" : "solid 2px rgb(166,200,255)"});
	});
	
	lic.mouseleave(function(){
		var menu = $("#lic_menu");
		
		menu.attr("show", "false");
		
		setTimeout(function(){
			if(menu.attr("show") == "false")
			{
				if(select_lic != null)
				{
					close_lic_menu();
				}
			}
		}, 300);
	});
}

// 这个函数用于更新链接菜单的位置
function update_lic_menu_position(){	
	if(select_lic != null)
	{
		var this_top   	= select_lic.offset().top,
			this_left  	= select_lic.offset().left,
			this_hight 	= select_lic.height(),
			this_width 	= select_lic.width(),
			top_top		= $("#editor_top").offset().top,
			bottom_top 	= $("#editor_bottom").offset().top;
	
		var menu = $("#lic_menu");
		var menu_left = this_left;
		
		var new_top = this_top + this_hight + 9;
		
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

// 关闭lic菜单
function close_lic_menu(){
	$("#lic_menu").hide();
	select_lic.css({"outline" : "none"});
	select_lic = null;
}