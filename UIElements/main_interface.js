rooms = {};
selectedRoom = {};
selectedThread = {};

var ViewEnum = {"room": 1, "thread": 2 }
currentPage = ViewEnum.room;

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	/*$(".dialog_button").click(function ()
	{
		var dialog = $(this).attr("data-dialog-to-open");
		$("#dialog_" + dialog).fadeIn(500);

		$(document).trigger("on_opened_dialog_" + dialog);
	});

	$(".close_dialog_button").click(function ()
	{
		$(".dialog").fadeOut(400);
	});*/

	/*---------------------------------------------*/
	/*$(document).on("UpdateUnreadMessagesCount", function (event, data)
	{
		data = JSON.parse(data);

		if (currentPage == ViewEnum.room && selectedRoom.dbid == data.roomDbId)
		{
			$("#thread_dbid_" + data.threadDbId + " .thread_in_list_unread_count").html(data.threadUnreadMsgCount);
		}
		else if (currentPage == ViewEnum.thread && data.threadDbId == selectedThread.dbId)
		{
			if (data.status == "marked_as_read")
			{
				$("#message_" + data.messageDbId).removeClass("unread");
			}
			else if (data.status == "marked_as_unread")
			{
				$("#message_" + data.messageDbId).addClass("unread");
			}
		}

		$("#room_in_bar_" + data.roomDbId + " .room_in_list_unread_count").html(data.roomUnreadMsgCount);
	});*/

	/*---------------------------------------------*/
	/*$(document).on("on_opened_dialog_invite_user", function ()
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
	});*/

	/*---------------------------------------------*/


	/*---------------------------------------------*/
	function GenerateThreadInListHTML(threadData)
	{
		var htmlContent = "";

		htmlContent += '<table class="item_list listed_thread" id="thread_dbid_' + threadData.dbid + '" data-id=' + threadData.internal_id + '><tr>';
		htmlContent += '<td class="item_name" style="font-weight: bold;">' + threadData.name + '</td>';
		htmlContent += '<td><strong>' + threadData.lastMsgAuthor + '</strong> <span class="thread_msg_preview_content">' + threadData.lastMsgText + '</span><div class="thread_in_list_unread_count">' + threadData.unreadMessagesCount + '</div></td>';
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
		currentPage = ViewEnum.room;
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
		var additionalClasses = "";

		if (!messageData.isRead)
		{
			additionalClasses += "unread";
		}

		htmlContent += '<div class="conv_message ' + additionalClasses + '" data-id="' + messageData.internal_id + '" data-dbid="' + messageData.dbid + '" id="message_' + messageData.dbid +'">';
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

	$("#thread_msgs").on("mouseenter", ".unread", function()
	{
		var signalData = {};
		signalData.dbid = $(this).attr("data-dbid");
		
		$("#message_" + signalData.dbid).removeClass("unread");
		
		ApoapseAPI.SendSignal("mark_message_as_read", JSON.stringify(signalData));
	});
});
