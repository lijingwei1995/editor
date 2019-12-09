/* 保留的标签 - 全局 */
var reserved_tag_ehe_main = [
                    "#text",
                    "BR",
                    "P", "DIV", "BLOCKQUOTE",
                    "H1", "H2", "H3", "H4", "H5", "H6", 
                    "UL", "OL", "LI", 
                    "A", "IMG", 
                    "B", "STRONG", "I", "EM", "U", "SUB", "SUP", 
                    "PRE", "CODE",
                    "TABLE", "THEAD", "TBODY",
                    "TH", "TR", "TD",
                    "VIDEO"
                    ];


/* 保留的属性 */
var reserved_attr = [
                     "class",								// 保留站内定义的一些属性
                     "href", "src",							// 资源属性
                     "height", "width",						// 图片宽高属性
                     "data-align",							// 图片居中属性
                     "colspan", "rowspan",					// 表格布局属性
                     "data-lang", "data-show-number",		// 代码框属性
                     "data-content", "data-display"			// 数学公式属性
                     ];

/* 保留的类 */
var reserved_class = [
                      "math"
                      ];

/*
 * 下面这个标记用来判定是否有粘贴事件，
 * 从而防止keyup等再次执行analysis_artical()，
 * 在粘贴事件的前后分别赋值。
 */
function ehe_paste(t){
	setTimeout(function(){ehe_after_paste(t)}, 300);
}

function ehe_after_paste(t){
	// 过滤标签
	ehe_filter(t[0], reserved_tag_ehe_main);
	
	// 创建一个光标
	var caret = document.createElement("span");
	caret.id = "caret";
	range = getFirstRange(); 
	range.insertNode(caret);
	
	// 删除注释
	delete_comment(t);
	
	// 链接变换
	ehe_detect_link(t);
	
	// 还原光标
	caret = document.getElementById("caret");
	range.setEndAfter(caret);
    range.setStartAfter(caret);
    var sel = rangy.getSelection();
    sel.setSingleRange(range);
    t.focus();
    $(caret).remove();
	
	// 删除属性（包括样式），但保留以下
	ehe_remove_attr(t);
	
	// 绑定菜单
	bind_menu_function();
}

/*
 * 当用户从word或其他地方粘贴文章到编辑器时，
 * 有可能出现形如<!-- -->的注释框，
 * 用正则表达式检测文本，若存在，则将其删除。
 */
function delete_comment(obj){
	var html = obj.html();
	re = /<!--[\s\S]*?-->/g;
	if(re.test(html)){
		html = html.replace(re, "");
		obj.html(html);
		obj.blur();
	}
}

/*
 * 过滤标签，
 * 只保留最开始定义的reserved_tag数组中的标签。
 */
function ehe_filter(p, reserved_tag){

	for (var i = 0; i < p.childNodes.length; i++){
		
		var node = p.childNodes[i];
		
		// 获得标签名
		var nodeName = node.nodeName;
		
		// 不保留的标签
		if($.inArray(nodeName, reserved_tag) == -1)
		{	        
			i--;
			$(node).replaceWith($(node).html());
			continue;
		}
		// 引用框不可包含引用框和标题
		else if(nodeName == "BLOCKQUOTE"){
			var new_reserved_tag = [
			                "#text",
			                "BR",
			                "P", "DIV", 
			                "UL", "OL", "LI", 
			                "A", "IMG", "B", "STRONG", "I", "EM", "U",
			                "SUB", "SUP",
			                "CODE", "PRE",
			                "TABLE", "THEAD", "TBODY",
			                "TH", "TR", "TD",
			                "VIDEO"
			                ];
			
			ehe_filter(node, new_reserved_tag);
		}
		// 列表UL，OL删除BR
		else if($.inArray(nodeName, ["UL", "OL"]) != -1)
		{
			ehe_filter(node, reserved_tag);
			
			for (var j = 0; j < node.childNodes.length; j++){
				var node_child = node.childNodes[j];
				
				if(node_child.nodeName == "BR") // 删除UL或OL中，且不在LI里的<br>
				{
					j--;
					$(node_child).remove();
				}
			}
		}
		// 列表LI不可包含引用框、段落和标题
		else if(nodeName == "LI")
		{
			var new_reserved_tag = [
			                "#text",
			                "BR",
			                "UL", "OL", "LI", 
			                "A", "IMG", "B", "STRONG", "I", "EM", "U",
			                "SUB", "SUP",
			                "CODE", "PRE",
			                "TABLE", "THEAD", "TBODY",
			                "TH", "TR", "TD",
			                "VIDEO"
			                ];
			
			ehe_filter(node, new_reserved_tag);
		}
		// 代码框只能包含换行和高亮
		else if(nodeName == "PRE")
		{
			var new_reserved_tag = ["#text", "BR", "SPAN"];
			ehe_filter(node, new_reserved_tag);
		}
		// 表格不能包含引用、段落和标题
		else if($.inArray(nodeName, ["TR", "TH", "TD"]) != -1)
		{
			var new_reserved_tag = [
			                "#text",
			                "BR",
			                "UL", "OL", "LI", 
			                "A", "IMG", "B", "STRONG", "I", "EM", "U",
			                "SUB", "SUP",
			                "CODE", "PRE",
			                "TABLE", "THEAD", "TBODY",
			                "TH", "TR", "TD",
			                "VIDEO"
			                ];
			
			ehe_filter(node, new_reserved_tag);
		}
		// 以下标签，若含有块元素，则删除本身，否则删除其中的样式标签
		else if($.inArray(nodeName, [
			                            "A", "CODE",
			                            "H1", "H2", "H3", "H4", "H5", "H6"
			                            ]) != -1)
		{
			var flag = false;
		
			for (var j = 0; j < node.childNodes.length; j++){ // 查看子元素有无块元素
				var node_child = node.childNodes[j];		
				if($.inArray(node_child.nodeName, [
				                                   "#text",
				                                   "BR",
				                                   "A", "B", "STRONG", "I", "EM", "U", "SUB", "SUP",
				                                   "SPAN"
				                                   ]) == -1)
				{
					flag = true;
					break;
				}
			}
			
			if(flag)
			{
				i--;
				$(node).replaceWith($(node).html());
				continue;
			}
			else
			{
				if($.inArray(nodeName, [
				                        "CODE",
			                            "H1", "H2", "H3", "H4", "H5", "H6"
			                            ]) != -1)
				{
					var new_reserved_tag = ["#text"];
					ehe_filter(node, new_reserved_tag);
				}
				else
				{
					var new_reserved_tag = ["#text", "BR"];
					ehe_filter(node, new_reserved_tag);
				}
			}
		}
		// 其他保留但不作处理的标签
		else if(nodeName != "#text")
		{
			ehe_filter(node, reserved_tag);
		}
	}
}


/*
 * 过滤属性，
 * 删除从其他网站/文档带来的诸如class，id，style之类的属性，
 * 但要保留一些必要属性，这些属性在reserved_attr数组中定义。
 */
function ehe_remove_attr(obj){
	obj.find("*").each(function() {
		var attributes = $.map(this.attributes, function(item) { 
			return item.name; 
		}); 
	     
		var tag = $(this); 
		$.each(attributes, function(i, item) { 
			if($.inArray(item, reserved_attr) == -1)
			{
				tag.removeAttr(item); 
			}
		});
		
		// 删除其余class（.math,.hljs-*除外）
		var className = tag.attr("class");
		
		var re = /^hljs-.*/;
		var isHljs = re.test(className);
		
		if($.inArray(className, reserved_class) == -1 && !isHljs)
		{
			tag.removeAttr("class"); 
		}
	});
}

/*
 * 寻找所有text节点
 */
function ehe_detect_link(obj){
	handle_lt_and_gt(obj[0]);
	ehe_detect_link_children(obj[0]);
}

/*
 * 将符合URL的字符串变为链接
 */
function ehe_detect_link_children(p){
	var detect_tag = [
	                    "P", "DIV", "BLOCKQUOTE",
	                    "UL", "OL", "LI", 
	                    "TABLE", "THEAD", "TBODY",
	                    "TH", "TR", "TD"
	                    ];
	
	for (var i = 0; i < p.childNodes.length; i++) {
		
	    var node = p.childNodes[i];
	    
	    if (node.nodeName == "#text")
	    {
	    	var detect_text = document.createElement("span");
	    	
	    	p.insertBefore(detect_text, node);
	        
	    	re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
	    	var str = node.nodeValue.replace(re, "<a href='$&'>$&</a>");
	    	
	        $(detect_text).html(str);
	        
	        p.removeChild(node);
	        $(detect_text).replaceWith($(detect_text).html());
	    }
	    else if ($.inArray(node.nodeName, detect_tag) != -1)
	    {
	    	ehe_detect_link_children(node);
	    }
	}
}

function handle_lt_and_gt(p){
	for (var i = 0; i < p.childNodes.length; i++) {
		
	    var node = p.childNodes[i];
	    
	    if (node.nodeName == "#text")
	    {
	    	var str = node.nodeValue;
	    	re = /</g;
	    	str = str.replace(re, "&#60;");
	    	re = />/g;
	    	str = str.replace(re, "&#62;");
	    	node.nodeValue = str;
	    }
	    else if (node.nodeName != "A")
	    {
	    	handle_lt_and_gt(node);
	    }
	}
}

// 绑定所有菜单函数
function bind_menu_function(){
	inner_pre_function();
	inner_a_function();
	inner_lic_function();
	inner_math_function();
}

// 过滤空标签
function clear_empty_tag(obj){
	// 单标签
	obj.find("blockquote,pre,h1,h2,h3,h4,h5,h6").each(function(){
		if(judge_blank($(this).html()))
		{
			$(this).replaceWith("");
		}
	})

	// 列表标签
	obj.find("ol,ul").each(function(){
		var re = /^\s*<li>\s*<\/li>\s*$/ig;
		if(re.test($(this).html())){
			$(this).replaceWith("");
		}
	});
}