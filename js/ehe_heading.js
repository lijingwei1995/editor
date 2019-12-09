function effity_editor_heading(){
	// 插入h1
	$("#h1_button").click(function(){
		if($(this).attr("clicked") == "false")
		{	
			var t = $("#ehe_main");
			
			var h1 = document.createElement("h1");
			h1.innerHTML = "<span id=caret></span><br>";
			
			if(range_temp)
			{				
				var select_content = range_temp.toString();
				select_content = tag_handler(select_content);
				
				range_temp.deleteContents();
				range_temp.insertNode(h1);
				
				range_temp.setEndAfter(h1);
			    range_temp.setStartBefore(h1);
			    var sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);
			    
			    t.focus();
				document.execCommand("RemoveFormat");
				
				h1.innerHTML = select_content == "" ? "<span id=caret></span><br>" : select_content + "<span id=caret></span>";
				
				clear_empty_tag($("#ehe_main"));
			}
			else
			{
				t.append($(h1));
			}
			
			// 还原光标
			caret = document.getElementById("caret");
			range_temp.setEndAfter(caret);
		    range_temp.setStartAfter(caret);
		    var sel = rangy.getSelection();
		    sel.setSingleRange(range_temp);
		    
		    if(isFirefox)
		    {
		    	$(h1).attr("data-edit", "unedit");
		    	t.blur();
		    }
		    else
		    {
		    	t.focus();
		    }
		    
		    $(caret).remove();
			
			var str = t.html();
			var last_4_char = str.slice(-4);
			if(last_4_char != "<br>")
			{
				t.append("<br>");
			}
		}
		else if($(this).attr("clicked") == "true")
		{
			var t = $("#ehe_main");
			
			var h1 = $(in_h1);
			h1.replaceWith(h1.html());
			
			focus_judge();
			t.blur();
		}
	});
	
	// 插入h2
	$("#h2_button").click(function(){
		if($(this).attr("clicked") == "false")
		{			
			var t = $("#ehe_main");
			
			var h2 = document.createElement("h2");
			h2.innerHTML = "<span id=caret></span><br>";
			
			if(range_temp)
			{				
				var select_content = range_temp.toString();
				select_content = tag_handler(select_content);
				
				range_temp.deleteContents();
				range_temp.insertNode(h2);
				
				range_temp.setEndAfter(h2);
			    range_temp.setStartBefore(h2);
			    var sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);
			    
			    t.focus();
				document.execCommand("RemoveFormat");
				
				h2.innerHTML = select_content == "" ? "<span id=caret></span><br>" : select_content + "<span id=caret></span>";
				
				clear_empty_tag($("#ehe_main"));
			}
			else
			{
				t.append($(h2));
			}
			
			// 还原光标
			caret = document.getElementById("caret");
			range_temp.setEndAfter(caret);
		    range_temp.setStartAfter(caret);
		    var sel = rangy.getSelection();
		    sel.setSingleRange(range_temp);
		    
		    if(isFirefox)
		    {
		    	$(h2).attr("data-edit", "unedit");
		    	t.blur();
		    }
		    else
		    {
		    	t.focus();
		    }
		    
		    $(caret).remove();
			
			// 标题框初始时显示边框，编辑后鼠标离开就会自动隐藏
			// 这里需要先初始设定其为unedit，再为其添加一个事件
			if(select_content == "")
			{
				$(h2).attr("data-edit", "unedit");
				$(h2).click(function(){
					$(this).removeAttr("data-edit");
				});
			}
			
			var str = t.html();
			var last_4_char = str.slice(-4);
			if(last_4_char != "<br>")
			{
				t.append("<br>");
			}
		}
		else if($(this).attr("clicked") == "true")
		{
			var t = $("#ehe_main");
			
			var h2 = $(in_h2);
			h2.replaceWith(h2.html());
			
			focus_judge();
			t.blur();
		}
	});
}