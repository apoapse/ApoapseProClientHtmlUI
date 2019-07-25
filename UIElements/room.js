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
			var unredMsgCount = "";

			if (value.is_selected)
			{
				classes += " globalTextColor selected";
				selectedRoom = value;
			}
			else
				classes += " globalTextColorHoverOnly";
			
			htmlContent += '<div class="listed_room  clickable ' + classes + '" data-id="' + value.id + '"><div>' + unredMsgCount + '</div>' + value.name + '</div>';
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
		htmlContent += '<div class="listed_thread clickable" data-id=' + threadData.id + '>';
		htmlContent += '<h2 class="globalTextColor">' + threadData.name + '<span class="listed_thread_unread_mgs"' + 0 + '</span></h2>';
		htmlContent += '</div>';
		return htmlContent;
	}

	$(document).on("OnOpenRoom", function (event, data)
	{
		data = JSON.parse(data);
		var htmlContent = "";

		$("#room").show();

		$.each(data.threads, function (key, value)
		{
			htmlContent += GenerateListedThread(value);
		});

		$("#threads_list").html(htmlContent);
	});

	$(document).on("OnNewThreadOnCurrentRoom", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").append(GenerateListedThread(data));
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

	/*---------------------------------------------*/
	function GenerateThreadInListHTML(threadData)
	{
		var unreadMsgCountStyle = (threadData.unreadMessagesCount > 0) ? "" : "display: none;";

		var htmlContent = "";
		htmlContent += '<div class="listed_thread clickable" id="thread_dbid_' + threadData.dbid + '" data-id=' + threadData.internal_id + '>';
		htmlContent += '<h2 class="globalTextColor">' + threadData.name + '<span class="listed_thread_unread_mgs" style="' + unreadMsgCountStyle + '">' + threadData.unreadMessagesCount + '</span></h2>';
		
		if (threadData.lastMsgAuthor.length > 0)
		{		
			htmlContent += '<img src="imgs/avatar_' + threadData.lastMsgAuthor + '.jpg" class="avatar_large">';
			htmlContent += '<div class="msg_preview">' + threadData.lastMsgText + '</div>';
		}

		htmlContent += '</div>';
		return htmlContent;
	}

	$(document).on("on_added_new_thread", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").prepend(GenerateThreadInListHTML(data));

		//$(document).trigger("OnThreadListUpdate");
	});

	/*$(document).on("OnOpenRoom", function (event, data)
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
*/
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