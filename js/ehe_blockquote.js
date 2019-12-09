/**
 * 	编辑器有关引用的函数
 */

var mouse_in_blockquote = false;

function effity_editor_blockquote(){
	// 插入blockquote
	$("#blockquote_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			var t = $("#ehe_main");
			
			var blockquote = document.createElement("blockquote");
			
			if(range_temp)
			{				
				var select_content = range_temp.cloneContents();
				
				range_temp.deleteContents();
				range_temp.insertNode(blockquote);
				
				// 清除格式
				range_temp.setEndAfter(blockquote);
			    range_temp.setStartBefore(blockquote);
			    var sel = rangy.getSelection();
			    sel.setSingleRange(range_temp);
			    
			    t.focus();
				document.execCommand("RemoveFormat");
				
				// 插入选中内容
				blockquote.appendChild(select_content);
				
				// 过滤非法标签
				ehe_filter($("#ehe_main")[0], reserved_tag_ehe_main);
				
				// 重新绑定菜单
				bind_menu_function();
				
				// 插入光标
				var caret = document.createElement("span");
				caret.id = "caret";
				blockquote.appendChild(caret);
				
				// 若选中内容为空，插入光标
				if(select_content.childNodes.length == 0)
				{
					blockquote.appendChild(document.createElement("br"));
				}
				
				clear_empty_tag($("#ehe_main"));
			}
			else
			{
				blockquote.innerHTML = "<span id=caret></span><br>";
				t.append($(blockquote));
			}
			
			// 还原光标
			caret = document.getElementById("caret");
			range_temp.setEndAfter(caret);
		    range_temp.setStartAfter(caret);
		    var sel = rangy.getSelection();
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
			
			var blockquote = $(in_blockquote);
			blockquote.replaceWith(blockquote.html());
			
			focus_judge();
			t.blur();
		}
	});
}

function keydown_blockquote(event){
	// 回车事件
	if(isChrome)
	{
		if(in_blockquote != null && in_pre == null && in_li == null)
		{
			if(event.keyCode == 13)
			{
				var t = $(in_blockquote);
				
				var	range = getFirstRange(), 
	            	added = false,
	            	newline;
				
		        if (range) {
					var str = t.html();
					var last_4_char = str.slice(-4);
					if(last_4_char != "<br>")
					{
						t.append("<br>");
					}
					
		        	var str = t.html();
				    var last_char = str.slice(-1);
				    	
				    newline = document.createElement('br');
				    
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
	}
}