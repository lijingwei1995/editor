/**
 * 	编辑器有关代码框的函数
 */

var select_pre = null;

function effity_editor_code(){
	// 编辑框初始绑定代码框函数
	inner_pre_function();
	
	// 插入代码
	$("#code_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			// 判断具有焦点
			var t = $("#ehe_main");
			
			var pre = document.createElement("pre");
			pre.innerHTML = "<span id=caret></span><br>";
			
			if(range_temp)
			{
				var select_content = range_temp.toString();
				select_content = tag_handler(select_content);
				
				range_temp.deleteContents();
				range_temp.insertNode(pre);
				
				range_temp.setEndAfter(pre);
			    range_temp.setStartBefore(pre);
			    var sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);
			    
			    t.focus();
				document.execCommand("RemoveFormat");
				
				pre.innerHTML = select_content == "" ? "<span id=caret></span><br>" : select_content + "<span id=caret></span>";
			
				clear_empty_tag($("#ehe_main"));
			}
			else
			{
				t.append($(pre));
			}
			
			// 还原光标
			var caret = document.getElementById("caret");
			range_temp.setEndAfter(caret);
		    range_temp.setStartAfter(caret);
		    var sel = rangy.getSelection();
		    sel.setSingleRange(range_temp);
		    
		    if(!isEdge)
		    {
		    	t.focus();
		    }
		    else
		    {
		    	t.blur();
		    }
		    
		    $(caret).remove();
			
			// 尾行插入回车
			var str = t.html();
			var last_4_char = str.slice(-4);
			if(last_4_char != "<br>")
			{
				t.append("<br>");
			}
			
			inner_pre_function();
			
			
		} else if($(this).attr("clicked") == "true") {
			var t = $("#ehe_main");
			var pre = $(in_pre);
			
			ehe_filter(in_pre, ["#text"]);
			pre.replaceWith(pre.html());
			
			focus_judge();
			t.blur();
		}
	});
	
	// 代码菜单显示
	$("#pre_menu").mouseenter(function(){
		$(this).attr("show", "true");
	});
	
	$("#pre_menu").mouseleave(function(){
		$(this).attr("show", "false");
		setTimeout(function(){
			if($("#pre_menu").attr("show") == "false")
			{
				if(select_pre != null)
				{
					close_pre_menu();
				}
			}
		}, 300);
	});
	
	// 代码高亮选择的展示与隐藏
	$("#pre_code_color_menu").mouseenter(function(){
		$(this).attr("show", "true");
		var choose_menu = $("#pre_code_color_menu_choose");
		
		// 计算CSS
		var	height 		=	choose_menu.height(),
			this_top   	=	$(this).offset().top,
			bottom_top 	=	$("#editor_bottom").offset().top;

		
		if(bottom_top - height - this_top > 7)
		{
			$(this).css({
				"border-radius"	:	"2px 2px 0px 0px",
				"padding"		:	"5px 5px 8px 5px"
			});
			
			choose_menu.css({
				"bottom"		:	"auto",
				"top"			:	"23.5px",
				"border-radius"	:	"0px 2px 2px 2px"
			});
		}
		else
		{			
			$(this).css({
				"border-radius"	:	"0px 0px 2px 2px",
				"padding"		:	"8px 5px 5px 5px"
			});
			
			choose_menu.css({
				"top"			:	"auto",
				"bottom"		:	"21px",
				"border-radius"	:	"2px 2px 2px 0px"
			});
		}

		choose_menu.show();
	});
	
	$("#pre_code_color_menu_choose").mouseenter(function(){
		$("#pre_code_color_menu").attr("show", "true");
	});
	
	$("#pre_code_color_menu, #pre_code_color_menu_choose").mouseleave(function(){
		$("#pre_code_color_menu").attr("show", "false");
		setTimeout(function(){
			var menu = $("#pre_code_color_menu");
			if(menu.attr("show") == "false")
			{
				menu.css({
					"border-radius"	:	"2px",
					"padding"		:	"5px"
				});
				$("#pre_code_color_menu_choose").hide();
			}
		}, 200);
	});
	
	// 菜单1 : 高亮
	$(".no_highlight,.highlight").click(function(){
		var lang = $(this).attr("data-lang");
		select_pre.attr("data-lang", lang);
		select_pre.attr("class", lang);
		
		// 删除高亮
		highlight_no_color(select_pre);

		// 格式（行相关）处理
		pre_line_handler(select_pre);
		
		// 重新渲染
		select_pre.each(function(i, e) {hljs.highlightBlock(e)});
	});
	
	// 菜单2 : 更改是否显示序号
	$("input[name='show_number']").click(function(){
		show_number = $("input[name='show_number']:checked").val();
		select_pre.attr("show_number", show_number);
	});
	
	// 菜单3 : 删除
	$("#pre_delete").click(function(){
		select_pre.remove();
		$("#pre_menu").hide();
		$("#ehe_main").blur();
		focus_judge();
	});
}

// 这个函数更新按键时菜单位置
function keyup_code(){
	if(select_pre != null)
	{
		update_pre_menu_position();
	}
}

// 更新菜单位置
function update_pre_menu_position(){
	if(select_pre != null)
	{
		var this_top   	= select_pre.offset().top,
			this_left  	= select_pre.offset().left,
			this_hight 	= select_pre.height(),
			this_width 	= select_pre.width(),
			top_top		= $("#editor_top").offset().top,
			bottom_top 	= $("#editor_bottom").offset().top;
	
		var menu = $("#pre_menu");
		var menu_right = $(window).width() - this_left - this_width - 40;
		
		var new_top = this_top + this_hight + 17;
		
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
		menu.css("right", menu_right + "px");
	}
}

// 这个函数针对chrome更改回车事件
function keydown_code(event){
	// 回车事件
	//if(isChrome || isIE)
	//{
		if(in_pre != null)
		{
			if(event.keyCode == 13)
			{
				var t = $(in_pre);
				
				var	range = getFirstRange(), 
	            	added = false,
	            	newline;
				
		        if (range) {
		        	var str = t.html();
				    var last_char = str.slice(-1);
				    
				    if(last_char != '\n')
				    {
				    	t.append("\n");
				    }
				    	
				    newline = document.createTextNode('\r\n');
				    
		            range.insertNode(newline);              
		            range.setEndAfter(newline);
		            range.setStartAfter(newline);
		            var sel = rangy.getSelection();
		            sel.setSingleRange(range);
		            added = true;
		        } 
		
		        if (added) {
		            event.preventDefault();
		        }
			}
		}
	//}
}

// 这个函数是鼠标移入移出代码框时的操作
function inner_pre_function(){

	var pre = $("#ehe_main").find("pre");
	
	pre.unbind();
	
	pre.mouseenter(function(){
		
		if(select_pre != $(this) && select_pre != null)
		{
			select_pre.css({"outline" : "none"});
		}
		select_pre = $(this);
		
		// 传递代码是否显示序号信息
		var show_number = select_pre.attr("show_number");

		if(show_number != "true")
		{
			$("input[name='show_number'][value='false']").prop("checked", "checked");
		}
		else
		{
			$("input[name='show_number'][value='true']").prop("checked", "checked");
		}
		
		update_pre_menu_position();
		
		select_pre.css({"outline" : "solid 2px rgb(166,200,255)"});
	});
	
	pre.mouseleave(function(){
		var menu = $("#pre_menu");
		
		menu.attr("show", "false");
		setTimeout(function(){
			if(menu.attr("show") == "false")
			{
				if(select_pre != null)
				{
					close_pre_menu();
				}
			}
		}, 300);
	});
	
	if(isIE)
	{
		pre.bind("paste", function(event){
			event.preventDefault();
			pasteHtmlAtCaret(window.clipboardData.getData("text"));
		});
	}
	
	/*
	if(isEdge)
	{	
		pre.attr("contentEditable", "false");
		pre.attr("title", "单击以编辑代码");
		
		pre.click(function(){
			$(this).attr("id", "edit_pre");
			var edit_content = $(this).html();
			$("#mw_code_content").val(edit_content=="\n"?"":edit_content);
			$("#code_window,#mw_mask").show();
		});
	}
	*/
}

// 删除高亮
function highlight_no_color(obj){
	obj.children().each(function(){
		highlight_no_color($(this));
		
		var type = $(this)[0].tagName;
		if($(this)[0].tagName == "SPAN")
		{
	        $(this).replaceWith($(this).html()); 
		}
	});
}

// 关闭pre菜单
function close_pre_menu(){
	$("#pre_menu").hide();
	select_pre.css({"outline" : "none"});
	select_pre = null;
}

// 格式处理，由于浏览器粘贴时会将两行识别为段落，这里需要重新还原为换行符
function pre_line_handler(obj){
	var html = obj.html();

	re = /(<p>|<div>)/g;
	html = html.replace(re, "");
	re = /(<\/p>\n|\n<\/p>|<\/div>\n|\n<\/div>)/g;
	html = html.replace(re, "\n");
	re = /(<\/p>|<br><\/p>|<\/div>|<br><\/div>)/g;
	html = html.replace(re, "\n");
	re = /(<br>)/g;
	html = html.replace(re, "\n");
	
	obj.html(html);
}

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

