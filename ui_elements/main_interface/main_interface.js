rooms = {};
selectedRoom = {};
selectedThread = {};

var ViewEnum = {"room": 1, "thread": 2 }
currentPage = ViewEnum.room;

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	$("form").submit(function()
	{
		var data = {};

		$(this).find("input[type=text], input[type=password], textarea, select").each(function ()
		{
			var fieldName = $(this).attr("name");

			data[fieldName] = $(this).val();
		});

		$(".dialog").fadeOut(500);
		$(this)[0].reset();

		var signalName = $(this).attr("data-submit-signal");
		ApoapseAPI.SendSignal(signalName, JSON.stringify(data));

		return false;
	});
});

/*---------------------------------------------*/
function DrawListItem(title, description)
{
	var html = '<table class="item_list"><tr><td class="item_name" style="font-weight: bold;">' + title + '</td><td>' + description + '</td></tr></table>';
}

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	function UpdateSpeedBar()
	{
		if (currentPage == ViewEnum.thread)
		{
			$("#global_path_title").html('<span id="title_room_link" data-room-id="' + selectedRoom.internal_id +'">' + selectedRoom.name + '</span> > <span class="selected_title">' + selectedThread.name + '</span>');
		}
		else if (currentPage == ViewEnum.room)
		{
			$("#global_path_title").html("<span>" + selectedRoom.name + "</span>");
		}

		$("#title_room_link").click(function()
		{
			var signalData = {};
			signalData.internalId = $(this).attr("data-room-id");
			
			ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
		});
	}

	$(".dialog_button").click(function ()
	{
		var dialog = $(this).attr("data-dialog-to-open");
		$("#dialog_" + dialog).fadeIn(500);

		$(document).trigger("on_opened_dialog_" + dialog);
	});

	$(".close_dialog_button").click(function ()
	{
		$(".dialog").fadeOut(400);
	});

	/*---------------------------------------------*/
	$(document).on("on_opened_dialog_invite_user", function ()
	{
		ApoapseAPI.SendSignal("request_random_password", "", function(event, data)
		{
			data = JSON.parse(data);

			$("#registerUserPasswordField").val(data.randomPassword);
		});
	});

	$(document).on("clear_temporary_password", function ()
	{
		$("#registerUserPasswordField").val("");	// We make sure the UI do not keep the temporary password
	});

	/*---------------------------------------------*/
	$(document).on("rooms_update", function (event, data)
	{
		data = JSON.parse(data);
		rooms = data.rooms;

		var htmlContent = "";
		
		$.each(data.rooms, function (key, value)
		{
			var classes = (value.isSelected) ? "selected" : "";
			
			htmlContent += '<div class="bar_item '+ classes + '" data-id="' + value.internal_id + '"><div class="vignette" style="background: white;"></div>' + value.name + '</div>';
		});

		$("#rooms_list").html(htmlContent);

		if (Object.keys(rooms).length > 0)
		{
			$("#create_new_thread_button").show();
		}

		$("#rooms_list .bar_item").click(function()
		{
			$("#rooms_list .bar_item").removeClass("selected");
			$(this).addClass("selected");
			$("#create_new_thread_button").show();

			var signalData = {};
			signalData.internalId = $(this).attr("data-id");
			
			ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
		});
	});

	/*---------------------------------------------*/
	function GenerateThreadInListHTML(threadData)
	{
		var htmlContent = "";

		htmlContent += '<table class="item_list listed_thread" id="thread_dbid_' + threadData.dbid + '" data-id=' + threadData.internal_id + '><tr>';
		htmlContent += '<td class="item_name" style="font-weight: bold;">' + threadData.name + '</td>';
		htmlContent += '<td><strong>' + threadData.lastMsgAuthor + '</strong> <span class="thread_msg_preview_content">' + threadData.lastMsgText + '</span></td>';
		htmlContent += '</tr></table>';

		return htmlContent;
	}

	$(document).on("on_added_new_thread", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").prepend(GenerateThreadInListHTML(data));

		$(document).trigger("OnThreadListUpdate");
	});

	$(document).on("OnOpenRoom", function (event, data)
	{
		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.threads, function (key, value)
		{
			htmlContent += GenerateThreadInListHTML(value);
		});

		$("#threads_list").html(htmlContent);

		$(document).trigger("OnThreadListUpdate");

		selectedRoom = data.room;
		UpdateSpeedBar();
	});

	$(document).on("OnThreadListUpdate", function (event)
	{
		currentPage = ViewEnum.room;
		
		$("#threads_list").show();
		$("#thread_msgs").hide();
		$("#thread_msg_submit_form").hide();
	});

	$(document).on("updateThreadMsgPreview", function (event, data)
	{
		data = JSON.parse(data);

		$("#thread_dbid_" + data.dbid + " strong").html(data.lastMsgAuthor);
		$("#thread_dbid_" + data.dbid + " .thread_msg_preview_content").html(data.lastMsgText);
	});

	$("#threads_list").on("click", ".listed_thread", function()
	{
		var signalData = {};
		signalData.internalId = $(this).attr("data-id");
		
		ApoapseAPI.SendSignal("loadThread", JSON.stringify(signalData));
	});


	/*---------------------------------------------*/
	function GenerateMessageInListHTML(messageData)
	{
		var htmlContent = "";

		htmlContent += '<div class="conv_message" data-id="' + messageData.internal_id + '">';
		htmlContent += '<div> ' + messageData.author + ' <span class="msg_send_date"> PRINT - ' + messageData.sent_time + '</span ></div>';
		htmlContent += '<table><tr><td><img style="background-image: url(ui_elements/GP_avatar.jpg);" /></td><td valign="top">' + messageData.content + '</td></tr></table>';
		htmlContent += '</div>';

		return htmlContent;
	}

	$(document).on("open_thread", function (event, data)
	{
		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.messages, function (key, value)
		{
			htmlContent += GenerateMessageInListHTML(value);
		});

		$("#thread_msgs").html(htmlContent);
		$("#threads_list").hide();
		$("#thread_msgs").show();
		$("#thread_msg_submit_form").show();
		$("#create_new_thread_button").hide();

		$("#thread_msgs").scrollTop($("#thread_msgs").prop("scrollHeight"));	// Scoll to botton at load

		currentPage = ViewEnum.thread;
		selectedThread = data.info;
		UpdateSpeedBar();
	});

	$(document).on("added_new_message", function (event, data)
	{
		data = JSON.parse(data);

		$("#thread_msgs").append(GenerateMessageInListHTML(data));

		$("#thread_msgs").animate({ scrollTop: $('#thread_msgs').prop("scrollHeight")}, 1000);
	});
});
