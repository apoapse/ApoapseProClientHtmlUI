/* ----------------------------------------------------------------------------
// Copyright (C) 2020 Apoapse
// Copyright (C) 2020 Guillaume Puyal
//
// Distributed under the Apoapse Pro Client Software License. Non-commercial use only.
// See accompanying file LICENSE.md
//
// For more information visit https://github.com/apoapse/
// And https://apoapse.space/
// ----------------------------------------------------------------------------*/

function GenerateListedThread(threadData)
{
	var htmlContent = "";
	htmlContent += '<div class="listed_thread clickable" data-id="' + threadData.id + '" id="listed_thread_' + threadData.id + '">';
	htmlContent += '<h2 class="globalTextColor">' + threadData.name;

	if (threadData.unreadMsgCount > 0)
	{
		htmlContent += '<span class="listed_thread_unread_mgs globalTextColorBackground">' + threadData.unreadMsgCount + '</span>';
	}
	htmlContent += '</h2>';

	if (threadData.msg_count > 0)
	{
		htmlContent += '<img src="' + threadData.msg_preview[0].author.avatar + '" class="avatar_large">';
		htmlContent += '<div class="msg_preview">' + threadData.msg_preview[0].message.substring(0, 250) + '</div>';

		if (threadData.msg_preview[0].hasOwnProperty("attachments"))
		{
			htmlContent += '<div class="att_preview">';

			$.each(threadData.msg_preview[0].attachments, function()
			{
				htmlContent += GenerateAttachment(this);
			});

			htmlContent += '</div>';
		}
	}

	htmlContent += '</div>';
	
	return htmlContent;
}

$(document).on("onReady", function ()
{
	/*-----------------ROOMS----------------------*/
	$(document).on("rooms_update", function (event, data)
	{
		data = JSON.parse(data);
		rooms = data.rooms;

		var htmlContent = "";
		
		$.each(data.rooms, function (key, value)
		{
			var classes = "";
			
			if (value.unreadMsgCount > 0)
				classes += " unread";

			if (value.is_selected)
			{
				classes += " globalTextColor selected";
				selectedRoom = value;
			}
			else
				classes += " globalTextColorHoverOnly";
			
			htmlContent += '<div class="listed_room  clickable ' + classes + '" data-id="' + value.id + '" id="room_link_' + value.id + '">' + value.name + '</div>';
		});

		$("#rooms_list").html(htmlContent);
	});

	$(document).on('click', '.listed_room', function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
	});

	/*-----------------THREADS----------------------*/
	$(document).on("OnOpenRoom", function (event, data)
	{	
		console.log("OnOpenRoom");
		data = JSON.parse(data);

		SwitchView(ViewEnum.room);
		selectedRoom = data.room[0];

		if (selectedRoom.threadsLayout == "single")
			return;

		$("#thread_messages").html("");
		$("#threads_list").html("");
		$("#room").show();
		$("#create_thread_button").show();

		var htmlContent = "";

		if (data.hasOwnProperty("threads"))
		{
			$.each(data.threads, function (key, value)
			{
				htmlContent += GenerateListedThread(value);
			});
		}
		else
		{
			htmlContent += '<div class="empty_page center_horizontal" id="no_threads">' + Localization.LocalizeString("@empty_create_thread");
			htmlContent += '<input class="create_thread_button globalTextColorBackground" type="button" value="' + Localization.LocalizeString("@create_thread") + '"></div>';
		}

		$("#threads_list").html(htmlContent);

		$("#threads_list").show();
		UpdateSpeedBar();
	});

	$(document).on("OnNewThreadOnCurrentRoom", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list #no_threads").remove();
		$("#threads_list").prepend(GenerateListedThread(data));
	});

	$(document).on("UpdateThreadPreview", function (event, data)
	{
		data = JSON.parse(data);
		$("#listed_thread_" + data.id).empty().append(GenerateListedThread(data));
	});

	$("#room").on("click", ".create_thread_button", function()
	{
		$("#create_thread_button").hide();
		$("#create_thread_form").show();
		$("#create_thread_name_field").focus();
	});

	$(document).on("create_new_thread", function (event, data)
	{
		if (data.name.length > 0)
		{
			var signalData = {};
			signalData.name = data.name;

			ApoapseAPI.SendSignal("cmd_create_thread", JSON.stringify(signalData));
		}

		$("#create_thread_form").hide();
		$("#create_thread_button").show();
		$("#create_thread_name_field").val("");
	});

	/*-------------------OPEN THREAD--------------------------*/
	$("#threads_list").on("click", ".listed_thread", function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("loadThread", JSON.stringify(signalData));
	});

	$("#threads_list ").on("click", ".listed_thread .attachment_file", function(e)
	{
		e.stopPropagation();

		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("openAttachment", JSON.stringify(signalData));
	});

	/*-------------------UNREAD--------------------------*/
	$(document).on("UpdateThreadUnreadMsgCount", function (event, data)
	{
		data = JSON.parse(data);

		var thread = data.thread[0];
		$("#listed_thread_" + thread.id + " .listed_thread_unread_mgs").html(thread.unreadMsgCount);
	});
	/*$(document).on("UpdateUnreadMsgCount", function (event, data)
	{
		data = JSON.parse(data);
		console.log(data);
		if (data.roomUnreadMsgCount > 0)
		{
			$("#room_link_" + data.roomId).addClass("unread");
		}
		else
		{
			$("#room_link_" + data.roomId).removeClass("unread");
		}	
	});*/
});