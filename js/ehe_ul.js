function effity_editor_ul(){
	$("#ul_button").click(function(){
		if($(this).attr("clicked") != "unable")
		{
			var t = $("#ehe_main");
			
			if (range_temp)
			{	
				var select_content = range_temp.cloneContents();
				
				range_temp.deleteContents();
				
				var ul = document.createElement("ul");
				var li = document.createElement("li");
				
				ul.appendChild(li);
				range_temp.insertNode(ul);
				
				// 清除格式
				range_temp.setEndAfter(ul);
			    range_temp.setStartBefore(ul);
			    var sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);
			    
			    t.focus();
				document.execCommand("RemoveFormat");
				
				// 插入选中内容
				li.appendChild(select_content);
				
				// 过滤非法标签
				ehe_filter($("#ehe_main")[0], reserved_tag_ehe_main);
				
				// 重新绑定菜单
				bind_menu_function();
				
				// 插入光标
				var caret = document.createElement("span");
				caret.id = "caret";
				li.appendChild(caret);
				
				// 若选中内容为空，插入光标
				if(select_content.childNodes.length == 0)
				{
					li.appendChild(document.createElement("br"));
				}
				
				clear_empty_tag($("#ehe_main"));
				
				// 还原光标
				caret = document.getElementById("caret");
				range_temp.setEndAfter(caret);
			    range_temp.setStartAfter(caret);
			    sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);

			    if(isFirefox)
			    {
			    	t.blur();
			    }
			    else
			    {
			    	t.focus();
			    }
			    
			    $(caret).remove();
			}
		}
	});
}