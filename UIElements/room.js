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
	function GenerateListedThread(threadData)
	{
		var htmlContent = "";
		htmlContent += '<div class="listed_thread clickable" data-id="' + threadData.id + '" id="listed_thread_' + threadData.id + '">';
		htmlContent += '<h2 class="globalTextColor">' + threadData.name + '<span class="listed_thread_unread_mgs">' + threadData.unreadMsgCount + '</span></h2>';

		if (threadData.msg_count > 0)
		{
			htmlContent += '<img src="' + threadData.msg_preview[0].author.avatar + '" class="avatar_large">';
			htmlContent += '<div class="msg_preview">' + threadData.msg_preview[0].message.substring(0, 250) + '</div>';
		}

		htmlContent += '</div>';
		
		return htmlContent;
	}

	$(document).on("OnOpenRoom", function (event, data)
	{
		$("#thread_messages").html("");
		$("#threads_list").html("");
		$("#msg_editor").hide();

		data = JSON.parse(data);
		var htmlContent = "";
		$("#room").show();

		$.each(data.threads, function (key, value)
		{
			htmlContent += GenerateListedThread(value);
		});
		$("#threads_list").html(htmlContent);

		currentPage = ViewEnum.room;
		selectedRoom = data.room[0];
		UpdateSpeedBar();
	});

	$(document).on("OnNewThreadOnCurrentRoom", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").append(GenerateListedThread(data));
	});

	$(document).on("UpdateThreadPreview", function (event, data)
	{
		data = JSON.parse(data);
		$("#listed_thread_" + data.id).empty().append(GenerateListedThread(data));
	});

	$("#create_thread_button").click(function ()
	{
		$(this).hide();
		$("#create_thread_form").show();
		$("#create_thread_name_field").focus();
	});

	$(document).on("create_new_thread", function (event, data)
	{
		$("#create_thread_form").hide();
		$("#create_thread_button").show();
	});

	$("#threads_list").on("click", ".listed_thread", function()
	{
		var signalData = {};
		signalData.id = $(this).attr("data-id");

		ApoapseAPI.SendSignal("loadThread", JSON.stringify(signalData));
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