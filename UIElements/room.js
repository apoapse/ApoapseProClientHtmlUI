$(document).on("onReady", function ()
{
	$(document).on("listed_rooms_update", function (event, data)
	{
		data = JSON.parse(data);
		rooms = data.rooms;

		var htmlContent = "";
		
		$.each(data.rooms, function (key, value)
		{
			var classes = "";

			if (value.isSelected)
				classes += " globalTextColor selected";
			else
				classes += " globalTextColorHoverOnly";
			
			htmlContent += '<div class="listed_room  clickable ' + classes + '" data-id="' + value.internal_id + '" id="room_in_bar_' + value.dbid + '"><div>' + value.unreadMessagesCount + '</div>' + value.name + '</div>';
		});

		$("#rooms_list").html(htmlContent);

		/*if (Object.keys(rooms).length > 0)
		{
			$("#create_new_thread_button").show();
		}*/

		$("#rooms_list .listed_room").click(function()
		{
			$("#rooms_list .selected").addClass("globalTextColorHoverOnly");
			$("#rooms_list .listed_room").removeClass("selected");
			$("#rooms_list .listed_room").removeClass("globalTextColor");
			$(this).addClass("selected");
			$(this).addClass("globalTextColor");

			var signalData = {};
			signalData.internalId = $(this).attr("data-id");
			
			ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
		});
	});

	/*---------------------------------------------*/
	$("#add_new_room").click(function ()
	{
		$(this).hide();
		$("#add_new_room_form").show();
		$("#create_room_name_field").focus();
	});

	$(document).on("create_new_room", function (event, data)
	{
		if (data.name.length > 0)
		{
			$("#create_room_name_field").val("");
			ApoapseAPI.SendSignal("create_new_room", JSON.stringify(data));
		}

		$("#add_new_room_form").hide();
		$("#add_new_room").show();
	});

	/*---------------------------------------------*/
	function GenerateThreadInListHTML(threadData)
	{
		var htmlContent = "";

		/*htmlContent += '<table class="item_list listed_thread" id="thread_dbid_' + threadData.dbid + '" data-id=' + threadData.internal_id + '><tr>';
		htmlContent += '<td class="item_name" style="font-weight: bold;">' + threadData.name + '</td>';
		htmlContent += '<td><strong>' + threadData.lastMsgAuthor + '</strong> <span class="thread_msg_preview_content">' + threadData.lastMsgText + '</span><div class="thread_in_list_unread_count">' + threadData.unreadMessagesCount + '</div></td>';
		htmlContent += '</tr></table>';
*/

		htmlContent += '<div class="listed_thread clickable" id="thread_dbid_' + threadData.dbid + '" data-id=' + threadData.internal_id + '>';
		htmlContent += '<h2 class="globalTextColor">' + threadData.name + '</h2>';
		htmlContent += '<img src="imgs/avatar_dcforum.jpg" class="avatar_large">';
		htmlContent += '<div class="msg_preview">' + threadData.lastMsgText + '</div>';
		htmlContent += '</div>';

		return htmlContent;
	}

	$(document).on("on_added_new_thread", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").prepend(GenerateThreadInListHTML(data));

		//$(document).trigger("OnThreadListUpdate");
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
		
		$("#room").show();
		$("#thread").hide();
	});

	$(document).on("updateThreadMsgPreview", function (event, data)
	{
		data = JSON.parse(data);

		//$("#thread_dbid_" + data.dbid + " strong").html(data.lastMsgAuthor);
		//$("#thread_dbid_" + data.dbid + " .thread_msg_preview_content").html(data.lastMsgText);
	});

	$("#threads_list").on("click", ".listed_thread", function()
	{
		var signalData = {};
		signalData.internalId = $(this).attr("data-id");

		ApoapseAPI.SendSignal("loadThread", JSON.stringify(signalData));
	});
});