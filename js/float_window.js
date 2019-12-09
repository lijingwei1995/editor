// 窗口拖拽脚本
$(window).ready(function(){
	// 拖拽初始化
	$(".fw").draggable({handle: ".fw_title"});
	
	// 拖拽窗口时将其置于顶层
	$(".fw").mousedown(function(){
		set_float_window_top($(this));
	});

	// 关闭窗口
	$(".fw_close_button").click(function(){
		$(this).parent().parent().hide();
		
		$("#" + $(this).attr("data-for")).attr("clicked", "false");
	});
	
	// Edge使用的代码编辑窗口
	$("#mw_code_cancel").click(function(){
		$("#code_window,#mw_mask").hide();
		$("#edit_pre").removeAttr("id");
	});
	$("#mw_code_save").click(function(){
		var new_content = $("#mw_code_content").val();
		$("#edit_pre").html(new_content==""?"\n":new_content);
		$("#code_window,#mw_mask").hide();
		$("#edit_pre").removeAttr("id");
	});
});

function set_float_window_top(t){
	$(".fw").css("z-index", "1500");
	t.css("z-index", "1501");
}


