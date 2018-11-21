$(document).on("onReady", function ()
{
	function GenerateMessageInListHTML(messageData)
	{
		var htmlContent = "";
		var additionalClasses = "";

		if (!messageData.isRead)
		{
			additionalClasses += "unread";
		}

		htmlContent += '<article class="' + additionalClasses + '" data-id="' + messageData.internal_id + '" data-dbid="' + messageData.dbid + '" id="message_' + messageData.dbid +'">';
		htmlContent += '<img src="imgs/avatar_dcforum.jpg" class="avatar_large">';
		htmlContent += '<div class="author globalTextColor">' + messageData.author + '</div>';
		htmlContent += '<div class="datetime">' + messageData.sent_time + '</div>';
		htmlContent += '<div class="content">' + messageData.content + '</div>';
		htmlContent += '</article>';

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

		$("#thread_messages").html(htmlContent);
		$("#room").hide();
		$("#thread").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		currentPage = ViewEnum.thread;
		selectedThread = data.info;
		UpdateSpeedBar();
	});

	$(document).on("added_new_message", function (event, data)
	{
		data = JSON.parse(data);

		$("#thread_messages").append(GenerateMessageInListHTML(data));

		$("#thread").animate({ scrollTop: $('#thread').prop("scrollHeight")}, 1000);
	});

	$("#thread").on("mouseenter", ".unread", function()
	{
		var signalData = {};
		signalData.dbid = $(this).attr("data-dbid");
		
		$("#message_" + signalData.dbid).removeClass("unread");
		
		ApoapseAPI.SendSignal("mark_message_as_read", JSON.stringify(signalData));
	});

	function SendNewMsg()
	{
		var signalData = {};
		signalData.msg_content = $("#send_msg_editor").val();

		ApoapseAPI.SendSignal("send_new_message", JSON.stringify(signalData));
		$("#send_msg_editor").val("");
	}

	$("#send_msg_editor").keydown(function (event)
	{
		var enterSendMsg = $("#press_enter_to_send_checkbox").prop('checked');

		if (enterSendMsg && event.keyCode == 13 && !event.shiftKey)
		{
			SendNewMsg();
			event.preventDefault();
		}
	})
});