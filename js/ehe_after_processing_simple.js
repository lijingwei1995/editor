/*
 * 后处理，生成用于存储在数据库中的版本
 */
var ehe_result_database;

function ehe_after_processing_simple() {
	
	var r = $("#ehe_main").clone();
		
	// 执行粘贴处理
	ehe_math_handle(r);							// 删除math的src
	ehe_code_handle(r);							// 删除pre的class
	ehe_filter(r[0], reserved_tag_ehe_main);	// 过滤标签
	delete_comment(r);						    // 删除注释
	ehe_remove_attr(r);						    // 删除属性（包括样式）
	
	// PRE中变换BR为\n
	r.find("pre").each(function() {
		highlight_no_color($(this));
		var str = $(this).html();
		str = str.replace(/(<br>)/ig, "\n");
		$(this).html(str);
	});
	
	ehe_result_database = r.html();
}


// 处理编辑器里的公式
function ehe_math_handle(obj) {
	obj.find(".math").each(function(){
		$(this).removeAttr("src");
	});
}

function ehe_code_handle(obj){
	obj.find("pre").each(function(){
		$(this).removeAttr("class");
	});
}