$(document).on("onReady", function ()
{
	function GenerateMessageInListHTML(messageData)
	{
		var htmlContent = "";
		var additionalClasses = "";

		if (!messageData.isRead)
		{
			additionalClasses += " unread";
		}

		htmlContent += '<article class="' + additionalClasses + '" data-id="' + messageData.internal_id + '" data-dbid="' + messageData.dbid + '" id="message_' + messageData.dbid +'">';
		htmlContent += '<img src="imgs/avatar_' + messageData.author + '.jpg" class="avatar_large">';
		htmlContent += '<div class="author globalTextColor">' + messageData.author + '</div>';
		htmlContent += '<div class="datetime">' + messageData.sent_time + '</div>';
		htmlContent += '<div class="content">' + messageData.content + '</div>';
		htmlContent += '<div class="tag_section">';
			htmlContent += '<div class="tags" id="tags_' + messageData.internal_id + '"></div>';
			htmlContent += '<div>';
				htmlContent += '<div class="globalTextColorHoverOnly add_tag_button" data-id="' + messageData.internal_id + '"><span class="fas"></span>Add tag</div>';
				htmlContent += '<div class="globalTextColorHoverOnly add_tag_field" id="add_tag_field_' + messageData.internal_id + '" style="display: none;"><span class="fas globalTextColor"></span><input type="text"></div>';
		htmlContent += '</div></div>';
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

	/*---------------------------------------------*/
	$("#thread").on("mouseenter", ".unread", function()
	{
		var signalData = {};
		signalData.dbid = $(this).attr("data-dbid");
		
		$("#message_" + signalData.dbid).removeClass("unread");
		
		ApoapseAPI.SendSignal("mark_message_as_read", JSON.stringify(signalData));
	});

	/*---------------------------------------------*/
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
	});

	/*---------------------------------------------*/
	function AddTag(tagName, messageId)
	{
		$("#tags_" + messageId).append('<div class="globalTextColorHoverOnly">#' + tagName + '</div>');
	}

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
					AddTag(tagName, button.attr("data-id"));
					field.children("input").val("");

				}

				event.preventDefault();
			}
		});
	});
});