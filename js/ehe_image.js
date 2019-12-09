/**
 * 	编辑器有关插入图片的函数
 */

function effity_editor_image(){
	// 图片按钮
	$("#picture_button").click(function(){
		if($(this).attr("clicked") == "false")
		{
			$("#picture_window").css({
				"right"	: "20px",
				"top"	: "105px"
			});
			
			set_float_window_top($("#picture_window"));
			
			$("#picture_window").show();
			
			$(this).attr("clicked", "true");
		}
		else if($(this).attr("clicked") == "true")
		{
			$("#picture_window").hide();
			
			$(this).attr("clicked", "false");
		}
	});
	
	// 上传图片
	$("#eiu_upload").click(function(){
		var form   = $("#editor_img_upload_form");
		var choose = $("#eiu_left");
		var input  = $("#eiu_input");
		
		form.ajaxSubmit({
			dataType:'json',
			success:function(data){
				if(data["state"] == "s")
				{
					input.val("");
					choose.attr("img", data["img"]);
					choose.html("<img id=eiu_img src=upload/img/"+data["img"]+">");
					/*
					setTimeout(function(){ // 改变choose框的宽度
						var image = choose.children("img");
						var img_width = image.width();
						var img_height = image.height();
						var rate = img_width / img_height;
						rate = rate < 1 ? 1 : rate;
						rate = rate > 2 ? 2 : rate;
						choose.width(90 * rate);
					},300);
					*/
				}
				else if(data["state"] == "f")
				{
					alert("未选择文件!");
				}
				else if(data["state"] == "f1")
				{
					alert("文件类型错误!");
				}
				else if(data["state"] == "f2")
				{
					alert("文件过大!");
				}
				else if(data["state"] == "f3")
				{
					alert("出于安全因素考虑，未登录用户不可上传图片!");
				}
            }
		});
	});
	
	// 插入图片
	$("#eiu_insert").click(function(){
		var img = $("#eiu_left").attr("img");		
		var t   = $("#ehe_main");
		
		if(img != "")
		{
			var image = document.createElement("img");
			image.src = "upload/img/" + img;
			
			if(range_temp)
			{				
				range_temp.deleteContents();
				range_temp.insertNode(image);
			}
			else
			{
				t.append($(image));
			}
			
			t.blur();
			
			inner_a_function();
		}
		else
		{
			alert("未选择图片!");
		}
	});
}