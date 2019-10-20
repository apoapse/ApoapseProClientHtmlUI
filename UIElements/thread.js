var rightPanelAttachments = {};
var rightPanelAttaChunkSize = 14;
var attachmentsLoaded = 0;
var loadedMessagesCount = 0;

function GenerateAttachment(data, isTemporary)
{
	var htmlContent = '';
	var additionalClasses = '';

	if (isTemporary)
		additionalClasses += 'temporary';

	htmlContent += '<div class="attachment_file clickable attachment_' + data.id + ' ' + additionalClasses + '" data-id="' + data.id + '">';
		htmlContent += '<div class="att_icon fa"></div>';
		htmlContent += '<div class="att_title">' + data.fileName + '</div>';

		if (data.hasOwnProperty("author") && data.hasOwnProperty("dateTime"))
		{
			htmlContent += '<span class="att_author">' + data.author + '<span class="att_date" data-tooltip="' + Localization.LocalizeDateTimeFull(data.dateTime) + '">' + Localization.LocalizeDateTimeRelative(data.dateTime) + '</span></span>';
		}

		if (!data.isAvailable && !isTemporary)
		{
			htmlContent += '<span class="att_status">' + Localization.LocalizeString("@attachment_not_available") + '</span>';
		}
		else
		{
			htmlContent += '<span class="att_status" style="display: none"></span>';
		}

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
				htmlContent += '<div class="globalTextColorHoverOnly add_tag_button" data-id="' + messageData.id + '"><span class="fas"></span>' + Localization.LocalizeString("@add_new_tag") + '</div>';
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
			htmlContent += GenerateAttachment(this, true);
		});

		$("#editor_attachments").html(htmlContent);
	});

	$(document).on("ChangeAttachmentStatus", function (event, data)
	{
		data = JSON.parse(data);
		var statusElement = $(".attachment_" + data.id + " .att_status");

		if (data.status == "uploading")
		{
			statusElement.html("Uploading...");
			statusElement.show();
		}
		else if (data.status == "downloading")
		{
			statusElement.html("Downloading...");
			statusElement.show();
		}
		else
			statusElement.hide();
	});

	function DisplayLeftPanelAttachments()
	{
		var htmlContent = '';
		var i = 0;
		var attLoadedCount = 0;
		$.each(rightPanelAttachments, function()
		{
			if (i >= attachmentsLoaded && attLoadedCount < rightPanelAttaChunkSize)
			{
				htmlContent += GenerateAttachment(this);
				attLoadedCount++;
				attachmentsLoaded ++;
			}

			i++;
		});

		$("#global_listed_attachments").append(htmlContent);

		$(".load_more_attachments").remove();
		if (attachmentsLoaded < rightPanelAttachments.length)
		{
			$("#global_listed_attachments").append('<div class="load_more_attachments">' + Localization.LocalizeString("@load_more_attachments") + '</div>');
		}
	}

	$(document).on("UpdateAttachments", function (event, data)
	{
		attachmentsLoaded = 0;
		var data = JSON.parse(data)
		if (data.hasOwnProperty("attachments"))
		{
			rightPanelAttachments = data.attachments;
			
			$(".sort_options .selected").removeClass("selected");
			$(".sort_options [data-dir='" + data.sorting.order + "']").addClass("selected");
			$("#attachments_sort_by").val(data.sorting.sortBy);
			
			$("#global_listed_attachments").html("");
			DisplayLeftPanelAttachments();
		}
	});

	function LoadMoreAttachments()
	{
		if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1)
		{
			DisplayLeftPanelAttachments()
		}
	}

	//$(window).resize(LoadMoreAttachments);
	$("#global_listed_attachments").on('scroll', LoadMoreAttachments);
	$(document).on('click', ".load_more_attachments", DisplayLeftPanelAttachments);

	$(document).on('click', '.attachment_file:not(.temporary)', function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("openAttachment", JSON.stringify(signalData));
	});

	$(document).on('click', '.attachment_file.temporary', function()
	{
		$(this).remove();
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("removeTempAttachment", JSON.stringify(signalData));
	});

	/*----------------------MESSAGES-----------------------*/
	function FillThread(data)
	{
		var htmlContent = "";

		if (loadedMessagesCount < data.totalMsgCount)
		{
			htmlContent += '<div class="load_more_messages">' + Localization.LocalizeString("@load_more_messages") + '</div>';
		}

		$.each(data.messages, function (key, value)
		{
			htmlContent += GenerateMessageInListHTML(value);
		});

		return htmlContent;
	}

	$(document).on("OnOpenThread", function (event, data)
	{
		SwitchView(ViewEnum.thread);
		data = JSON.parse(data);

		if (data.hasOwnProperty("messages"))
			loadedMessagesCount = data.messages.length;
		else
			loadedMessagesCount = 0;

		var content = FillThread(data);
		$("#thread_messages").html(content);
		
		$("#thread").show();
		$("#send_msg_editor").val(data.thread[0].unsentMessage);
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		selectedThread = data.thread[0];
		UpdateSpeedBar();
	});

	$(document).on("NewMessage", function (event, data)
	{
		data = JSON.parse(data);

		loadedMessagesCount++;
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

	/*---------------------------------------------*/
	function OnMessagesTopScroll()
	{
		if ($(this).scrollTop() == 0)
		{
			LoadMoreMessages()
		}
	}

	function LoadMoreMessages()
	{
		var signalData = {};
		signalData.loadedMsgCount = loadedMessagesCount;
		ApoapseAPI.SendSignal("loadNextMessagesChunk", JSON.stringify(signalData));
	}
	
	$("#thread").on("click", ".load_more_messages", function()
	{
		LoadMoreMessages();
	});
	
	//$("#thread").on('scroll', OnMessagesTopScroll);

	$(document).on("OnMessagesChunkLoaded", function (event, data)
	{
		$(".load_more_messages").fadeOut(1000);
		//$(".load_more_messages").delay(1001).remove();
		var currentTopElement = $('#thread .load_more_messages:first');

		data = JSON.parse(data);
		loadedMessagesCount += data.messages.length;
		$("#thread_messages").prepend(FillThread(data));

		$('#thread').scrollTop(currentTopElement.position().top - 120);
	});

	/*--------------------TAGS-------------------------*/
	$(document).on('click', '.tag', function()
	{
		var data = {};
		data.query = $(this).html();

		ApoapseAPI.SendSignal("search", JSON.stringify(data));
	});

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

	/*--------------------EDITOR-------------------------*/
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
			const unsentAttachmentsCount = $(".attachment_file.temporary").length;
			if ($("#send_msg_editor").val().length > 0 || unsentAttachmentsCount > 0)
				SendNewMsg();
				
			event.preventDefault();
		}
	});

	/*----------------------PRIVATE USER MESSAGES-----------------------*/
	$(document).on("OnOpenPrivateMsgThread", function (event, data)
	{
		SwitchView(ViewEnum.private_thread);

		$("#thread_messages").html("");

		data = JSON.parse(data);

		if (data.hasOwnProperty("messages"))
			loadedMessagesCount = data.messages.length;
		else
			loadedMessagesCount = 0;

		selectedUserPage = data;

		var content = FillThread(data);
		$("#thread_messages").html(content);
		
		$("#thread").show();

		$("#send_msg_editor").val(data.unsentMessage);
		$("#msg_editor").show();

		$("#thread").scrollTop($("#thread").prop("scrollHeight"));	// Scoll to botton at load

		selectedThread = {};
		selectedRoom.name = data.user.nickname;
		UpdateSpeedBar();
	});
});