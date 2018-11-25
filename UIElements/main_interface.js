localUser = {};
rooms = {};
selectedRoom = {};
selectedThread = {};

var ViewEnum = {"room": 1, "thread": 2 }
currentPage = ViewEnum.room;

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	$(".dialog_link").click(function ()
	{
		var dialog = $(this).attr("data-dialog-to-open");
		$(".dialog").fadeOut(400);
		$("#dialog_" + dialog).fadeIn(450);
		$("#dialog_mask").fadeIn(450);

		$(document).trigger("on_opened_dialog_" + dialog);
	});

	function CloseDialog()
	{
		$(".dialog").fadeOut(400);
		$("#dialog_mask").fadeOut(400);
	}

	$(".dialog_close_button").click(function ()
	{
		CloseDialog();
	});

	$("#dialog_mask").click(function(e) {
		CloseDialog();
	});

	/*---------------------------------------------*/
	/*$(document).on("UpdateUnreadMessagesCount", function (event, data)
	{
		data = JSON.parse(data);

		if (currentPage == ViewEnum.room && selectedRoom.dbid == data.roomDbId)
		{
			$("#thread_dbid_" + data.threadDbId + " .thread_in_list_unread_count").html(data.threadUnreadMsgCount);
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
	});*/

	/*---------------------------------------------*/
	/*$(document).on("on_opened_dialog_invite_user", function ()
	{
		ApoapseAPI.SendSignal("request_random_password", "", function(event, data)
		{
			data = JSON.parse(data);

			$("#registerUserPasswordField").val(data.randomPassword);
		});
	});

	$(document).on("clear_temporary_password", function ()
	{
		$("#registerUserPasswordField").val("");	// We make sure the UI do not keep the temporary password
	});*/

	/*---------------------------------------------*/


	/*---------------------------------------------*/
});
