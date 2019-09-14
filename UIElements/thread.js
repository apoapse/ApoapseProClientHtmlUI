function GenerateAttachment(data)
{
	var htmlContent = '';

	htmlContent += '<div class="attachment_file clickable attachment_' + data.id +'" data-id="' + data.id + '">';
		htmlContent += '<div class="att_icon fa"></div>';
		htmlContent += '<div class="att_title">' + data.fileName + '</div>';

		if (data.hasOwnProperty("author") && data.hasOwnProperty("dateTime"))
		{
			htmlContent += '<span class="att_author">' + data.author + '<span class="att_datetime" data-tooltip="' + Localization.LocalizeDateTimeFull(data.dateTime) + '">' + Localization.LocalizeDateTimeRelative(data.dateTime) + '</span></span>';
		}
		htmlContent += '<span class="att_status"></span>';
		htmlContent += '<span class="att_size">' + data.fileSize +' KB</span>';
	htmlContent += '</div>';

	return htmlContent;
}

function ReplaceUrlsByLinks(text)
{
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1'>$1</a>"); 
}

function GenerateMessageInListHTML(messageData)
{
	var htmlContent = "";
	var additionalClasses = "";

	if (!messageData.is_read)
	{
		additionalClasses += " unread";
	}

	htmlContent += '<article class="' + additionalClasses + '" data-id="' + messageData.id + '">';
	htmlContent += '<img src="' + messageData.author.avatar + '" class="avatar_large">';
	htmlContent += '<div class="author globalTextColor">' + messageData.author.name + '</div>';
	htmlContent += '<div class="datetime" data-tooltip="' + Localization.LocalizeDateTimeFull(messageData.sent_time) + '">' + Localization.LocalizeDateTimeRelative(messageData.sent_time) + '</div>';
	htmlContent += '<div class="content">' + ReplaceUrlsByLinks(messageData.message) + '</div>';

	if (messageData.support_tags)
	{
		htmlContent += '<div class="tag_section">';
			htmlContent += '<div class="tags" id="tags_' + messageData.id + '">';
			$.each(messageData.tags, function (keyT, tag)
			{
				htmlContent += '<div class="globalTextColorHoverOnly tag">#' + tag + '</div>';
			});
			htmlContent += '</div>';
			htmlContent += '<div>';
				htmlContent += '<div class="globalTextColorHoverOnly add_tag_button" data-id="' + messageData.id + '"><span class="fas"></span>Add tag</div>';
				htmlContent += '<div class="globalTextColorHoverOnly add_tag_field" id="add_tag_field_' + messageData.id + '" style="display: none;"><span class="fas globalTextColor"></span><input type="text"></div>';
		htmlContent += '</div></div>';
	}

	if (messageData.hasOwnProperty("attachments"))
	{
		htmlContent += '<div class="attachments">';
		htmlContent += '<div class="attachments_desc globalTextColor">Attachments (' + messageData.attachments.length + ') TODO KB</div>';

		$.each(messageData.attachments, function()
		{
			htmlContent += GenerateAttachment(this);
		});

		htmlContent += '</div>';
	}

	htmlContent += '</article>';

	return htmlContent;
}

$(document).on("onReady", function ()
{
	$(document).on("OnDisconnect", function ()
	{
		$("#send_msg_editor").val("");
		$("#editor_attachments").html("");
	});

	/*----------------------ATTACHMENTS-----------------------*/
	$(document).on("OnDroppedFiles", function (event, data)
	{
		data = JSON.parse(data);

		var htmlContent = '';
		$.each(data.attachments, function()
		{
			htmlContent += GenerateAttachment(this);
		});

		$("#editor_attachments").html(htmlContent);
	});

	$(document).on("ChangeAttachmentStatus", function (event, data)
	{
		data = JSON.parse(data);
		var statusElement = $(".attachment_" + data.id + " .att_status");

		if (data.status == "uploading")
			statusElement.html("Uploading...");

		else if (data.status == "downloading")
			statusElement.html("Downloading...");

		else
			statusElement.html("");
	});

	$(document).on("UpdateAttachments", function (event, data)
	{
		data = JSON.parse(data);

		var htmlContent = '';
		$.each(data.attachments, function()
		{
			htmlContent += GenerateAttachment(this);
		});

		$("#global_listed_attachments").html(htmlContent);
	});


	$(document).on('click', '.attachment_file', function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("openAttachment", JSON.stringify(signalData));
	});

	/*----------------------MESSAGES-----------------------*/
	$(document).on("OnOpenThread", function (event, data)
	{
		$("#thread_messages").html("");

		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.messages, function (key, value)
		{
			htmlContent += GenerateMessageInListHTML(value);
		});

		SwitchView(ViewEnum.thread);

		$("#thread_messages").html(htmlContent);
		$("#room").hide();
		$("#thread").show();
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		
		selectedThread = data.thread[0];
		UpdateSpeedBar();
	});

	$(document).on("NewMessage", function (event, data)
	{
		data = JSON.parse(data);

		$("#thread_messages").append(GenerateMessageInListHTML(data));

		$("#thread").animate({ scrollTop: $('#thread').prop("scrollHeight")}, 1000);
	});

	$(document).on('click', 'article .content a', function()
	{
		var signalData = {};
		signalData.url = $(this).attr("href");
		ApoapseAPI.SendSignal("openURL", JSON.stringify(signalData));

		preventDefault();
	});

	/*---------------------------------------------*/
	$("#thread").on("mouseenter", ".unread", function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		if (currentPage == ViewEnum.thread)
			signalData.threadId = selectedThread.id;

		$(this).removeClass("unread");
				
		ApoapseAPI.SendSignal("mark_message_as_read", JSON.stringify(signalData));
	});

	/*--------------------TAGS-------------------------*/
	$(document).on('click', '.tag', function()
	{
		var data = {};
		data.query = $(this).html();

		ApoapseAPI.SendSignal("search", JSON.stringify(data));
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
		$("#editor_attachments").html("");
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
		$("#thread").show();
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		ViewEnum.thread(ViewEnum.private_thread);
		selectedThread = {};
		selectedRoom.name = data.user.nickname;
		UpdateSpeedBar();
	});
});