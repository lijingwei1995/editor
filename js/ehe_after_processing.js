/*
 * 后处理，生成用于存储在数据库中的版本
 */
var ehe_result_database;
var para_num;

function ehe_after_processing(){
	
	var r = $("#ehe_main").clone();
		
	// 执行粘贴处理
	ehe_heading_clear(r[0], reserved_tag_ehe_main);
	ehe_math_handle(r);							// 删除math的src
	ehe_code_handle(r);							// 删除pre的class
	ehe_filter(r[0], reserved_tag_ehe_main);	// 过滤标签
	delete_comment(r);						    // 删除注释
	ehe_remove_attr(r);						    // 删除属性（包括样式）
	
	// 保护公式
	r.find(".math").each(function(){
		$(this).wrap("<span></span>");
		var p = $(this).parent();
		p.attr({
			"class" 		: 	"math",
			"data-display"	:	$(this).attr("data-display"),
			"data-content"	:	$(this).attr("data-content")
		});
		p.html("");
	});
	
	// PRE中变换BR为\n
	r.find("pre").each(function(){
		highlight_no_color($(this));
		var str = $(this).html();
		str = str.replace(/(<br>)/ig, "\n");
		$(this).html(str);
	});
	
	// 用正则表达式处理html，来解析换行与空格
	var str = r.html();
	var arr = new Array();
	
	// 将&nbsp;换为空格
	str = str.replace(/(&nbsp;|&#160;)/ig, " ");
	
	// 将<div>标签换成<div>标签
	str = str.replace(/<p>/ig, "<div>");
	str = str.replace(/<\/p>/ig, "</div>");
	
	// 将(块元素+BR)变为(块元素+BRBR)
	arr = ["blockquote", "ul", "ol", "pre", "table"];
	for(var i = 0; i < arr.length; i++){
		str = str.replace(new RegExp("(<\/"+arr[i]+">)\\s*<br\\s?\/?>", "ig"), "$1<br><br>");
	}
	// 将已保护的块公式<span class="math"><br>变为<span class="math"><br><br>
	str = str.replace(new RegExp("(<span((?!inline)[^>])*\\s*\/?></span>)\\s*<br\\s?\/?>", "ig"), "$1<br><br>");
	
	// 将A, B,STRONG,I,EM,U,SUB,SUP与之相邻的<br>和<div>组合置换到外面
	for(var j = 0; j < 8; j++)// 重复n次
	{
		// 置换B,STRONG,I,EM,U,SUB,SUP
		arr = ["b", "strong", "i", "em", "u", "sub", "sup"];
		for(var i = 0; i < arr.length; i++){
			str = str.replace(new RegExp("(<"+arr[i]+">)\\s*(((<div>|<\/div>|<br\\s?\/?>)\\s*)+)", "ig"), "$2$1");
			str = str.replace(new RegExp("(((<div>|<\/div>|<br\\s?\/?>)\\s*)+)(<\/"+arr[i]+">)", "ig"), "$4$1");
			str = str.replace(new RegExp("<"+arr[i]+">\\s*<\/"+arr[i]+">", "ig"), "");
		}
		
		// 置换A
		str = str.replace(new RegExp("(<a(\\s+href=\"[^\"]*\")?>)\\s*(((<div>|<\/div>|<br\\s?\/?>)\\s*)+)", "ig"), "$3$1");
		str = str.replace(new RegExp("(((<div>|<\/div>|<br\\s?\/?>)\\s*)+)(<\/a>)", "ig"), "$4$1");
	}
	
	// <br>后含有任何<div>或</div>及其组合的，变为<br>
	str = str.replace(/<br\s?\/?>\s*((<div>|<\/div>)+\s*)+/ig, "<br>");
	
	// 将任何<div>或</div>及其组合，变为<br>
	str = str.replace(/((<div>|<\/div>)+\s*)+/ig, "<br>");
	
	// 删除空A标签
	str = str.replace(new RegExp("<a(\\s+href=\"[^\"]*\")?>\\s*<\/a>", "ig"), "");
	
	// 为BLOCKQUOTE,LI,TH,TD内添加<div></div>
	arr = ["blockquote", "li", "th[^>]*", "td[^>]*"];
	for(var i = 0; i < arr.length; i++){
		str = str.replace(new RegExp("<"+arr[i]+">",   "ig"), "$&<div>");
		str = str.replace(new RegExp("<\/"+arr[i]+">", "ig"), "</div>$&");
	}
	
	// 为主体内添加<div></div>
	str = "<div>" + str + "</div>";
	
	// 将Heading外面添加</div><div>
	arr = ["h1", "h2", "h3", "h4", "h5", "h6"];
	for(var i = 0; i < arr.length; i++){
		str = str.replace(new RegExp("<"+arr[i]+">",   "ig"), "</div>$&");
		str = str.replace(new RegExp("<\/"+arr[i]+">", "ig"), "$&<div>");
	}
	
	// <img> 变为 </div><div><img></div><div>
	str = str.replace(new RegExp("<img\\s*(src=\"[^\"]*\")?>", "ig"), "</div><div>$&</div><div>");
	
	// 将多行<br>变为</div><div>
	str = str.replace(/(<br\s?\/?>\s*){2,}/ig, "</div><div>");
	
	// 删除单BR，容器元素的开头，块元素的后面
	arr = ["div", "blockquote", "li", "th", "td"]; // 容器元素
	for(var i = 0; i < arr.length; i++){
		str = str.replace(new RegExp("(<"+arr[i]+">)\\s*<br\\s?\/?>", "ig"), "$1");
	}
	arr = ["blockquote", "ul", "ol", "pre", "table"]; // 块元素
	for(var i = 0; i < arr.length; i++){
		str = str.replace(new RegExp("(<\/"+arr[i]+">)\\s*<br\\s?\/?>", "ig"), "$1");
	}
	// img 特殊处理
	//str = str.replace(new RegExp("(<img\\s*(src=\"[^\"]*\")?>)\\s*<br\\s?\/?>", "ig"), "$1");
	
	// 删除多余的<div>'只含标签'</div>
	str = str.replace(new RegExp("<div>\\s*(<\/?(br|b|strong|u|i|em|sub|sup)\\s?\/?>\\s*)*<\/div>", "ig"), "");
	
	// 分段处理
	r.html(str);
	
	// 还原公式
	r.find(".math").each(function(){
		$(this).append("<img>");
		var c = $(this).children();
		c.attr({
			"class" 		: 	"math",
			"data-display"	:	$(this).attr("data-display"),
			"data-content"	:	$(this).attr("data-content")
		});
		$(this).replaceWith(c);
	});
	
	ehe_heading_clear(r[0], reserved_tag_ehe_main);
	
	var i = 1;
	r.children("div").each(function(){
		$(this).attr("class", "paragraph");
		$(this).attr("pid", i);
		i++;
	})
	para_num = i;
	
	ehe_result_database = r.html();
}

// 删除h1...h6里的标签
// *注意，它会同时删除pre里面的span
function ehe_heading_clear(p, reserved_tag){
	for (var i = 0; i < p.childNodes.length; i++){
		var node = p.childNodes[i];
		
		// 获得标签名
		var nodeName = node.nodeName;
		
		// 不保留的标签
		if($.inArray(nodeName, reserved_tag) == -1)
		{
			ehe_heading_clear(node, reserved_tag);
			
			i += node.childNodes.length - 1;
	        $(node).replaceWith($(node).html());
	        continue;
		}
		else if($.inArray(nodeName, ["H1", "H2", "H3", "H4", "H5", "H6"]) != -1) 
		{
			var new_reserved_tag = ["#text"];
			ehe_heading_clear(node, new_reserved_tag);
		}
		// 保留但不作处理的标签
		else if(nodeName != "#text")
		{
			ehe_heading_clear(node, reserved_tag);
		}
	}
}

// 处理编辑器里的公式
function ehe_math_handle(obj){
	obj.find(".math").each(function(){
		$(this).removeAttr("src");
	});
}

function ehe_code_handle(obj){
	obj.find("pre").each(function(){
		$(this).removeAttr("class");
	});
}