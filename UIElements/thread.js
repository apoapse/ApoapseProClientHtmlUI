$(document).on("onReady", function ()
{
	function GenerateMessageInListHTML(messageData)
	{
		var htmlContent = "";
		var additionalClasses = "";

		if (!messageData.is_read)
		{
			additionalClasses += " unread";
		}

		htmlContent += '<article class="' + additionalClasses + '" data-id="' + messageData.id + '">';
		htmlContent += '<img src="imgs/avatar_' + messageData.author + '.jpg" class="avatar_large">';
		htmlContent += '<div class="author globalTextColor">' + messageData.author + '</div>';
		htmlContent += '<div class="datetime">' + messageData.sent_time + '</div>';
		htmlContent += '<div class="content">' + messageData.message + '</div>';

		if (messageData.support_tags)
		{
			htmlContent += '<div class="tag_section">';
				htmlContent += '<div class="tags" id="tags_' + messageData.id + '">';
				$.each(messageData.tags, function (keyT, tag)
				{
					htmlContent += '<div class="globalTextColorHoverOnly">#' + tag + '</div>';
				});
				htmlContent += '</div>';
				htmlContent += '<div>';
					htmlContent += '<div class="globalTextColorHoverOnly add_tag_button" data-id="' + messageData.id + '"><span class="fas"></span>Add tag</div>';
					htmlContent += '<div class="globalTextColorHoverOnly add_tag_field" id="add_tag_field_' + messageData.id + '" style="display: none;"><span class="fas globalTextColor"></span><input type="text"></div>';
			htmlContent += '</div></div>';
		}
		
		htmlContent += '</article>';

		return htmlContent;
	}

	$(document).on("OnOpenThread", function (event, data)
	{
		$("#thread_messages").html("");

		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.messages, function (key, value)
		{
			htmlContent += GenerateMessageInListHTML(value);
		});

		$("#thread_messages").html(htmlContent);
		$("#room").hide();
		$("#thread").show();
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		currentPage = ViewEnum.thread;
		selectedThread = data.thread[0];
		UpdateSpeedBar();
	});

	$(document).on("NewMessage", function (event, data)
	{
		data = JSON.parse(data);

		$("#thread_messages").append(GenerateMessageInListHTML(data));

		$("#thread").animate({ scrollTop: $('#thread').prop("scrollHeight")}, 1000);
	});

	/*---------------------------------------------*/
	$("#thread").on("mouseenter", ".unread", function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");
		signalData.threadId = selectedThread.id;

		$(this).removeClass("unread");
				
		ApoapseAPI.SendSignal("mark_message_as_read", JSON.stringify(signalData));
	});

	/*---------------------------------------------*/
	function SendNewMsg()
	{
		var signalData = {};
		signalData.message = $("#send_msg_editor").val();

		if (currentPage == ViewEnum.thread)
			ApoapseAPI.SendSignal("cmd_new_message", JSON.stringify(signalData));
		else
			ApoapseAPI.SendSignal("cmd_direct_message", JSON.stringify(signalData));

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
	});

	/*---------------------------------------------*/
	$(document).on("AddTag", function (event, data)
	{
		data = JSON.parse(data);

		$("#tags_" + data.msgId).append('<div class="globalTextColorHoverOnly">#' + data.name + '</div>');
	});

	$("#thread_messages").on("click", ".add_tag_button", function()
	{
		button = $(this);
		button.hide();

		var field = $("#add_tag_field_" + button.attr("data-id"));
		field.show();
		field.children("input").focus();

		field.children("input").keydown(function (event)
		{
			if (event.keyCode == 13)
			{
				field.hide();
				button.show();

				var tagName = field.children("input").val();

				if (tagName.length > 0)
				{
					field.children("input").val("");

					var data = {};
					data.name = tagName;
					data.item_type = "msg";
					data.msg_id = button.attr("data-id");

					ApoapseAPI.SendSignal("AddTag", JSON.stringify(data));
				}

				event.preventDefault();
			}
		});
	});

	/*----------------------PRIVATE USER MESSAGES-----------------------*/
	$(document).on("OnOpenPrivateMsgThread", function (event, data)
	{
		$("#thread_messages").html("");

		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.messages, function (key, value)
		{
			htmlContent += GenerateMessageInListHTML(value);
		});

		$("#thread_messages").html(htmlContent);
		$("#room").hide();
		$("#thread").show();
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		currentPage = ViewEnum.private_thread;
		selectedThread = {};
		selectedRoom.name = data.user.nickname;
		UpdateSpeedBar();
	});
});