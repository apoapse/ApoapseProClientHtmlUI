localUser = {};
rooms = {};
selectedRoom = {};
selectedThread = {};

var ViewEnum = {"room": 1, "thread": 2 }
currentPage = ViewEnum.room;

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	$(document).on("UpdateUnreadMessagesCount", function (event, data)
	{
		data = JSON.parse(data);

		if (currentPage == ViewEnum.room && selectedRoom.dbid == data.roomDbId)
		{
			if (data.threadUnreadMsgCount > 0)
			{
				$("#thread_dbid_" + data.threadDbId + " .listed_thread_unread_mgs").show();
				$("#thread_dbid_" + data.threadDbId + " .listed_thread_unread_mgs").removeClass("hide");
			}
			else
			{
				$("#thread_dbid_" + data.threadDbId + " .listed_thread_unread_mgs").hide();
			}
			
			$("#thread_dbid_" + data.threadDbId + " .listed_thread_unread_mgs").html(data.threadUnreadMsgCount);
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
	});

	/*---------------------------------------------*/

});
