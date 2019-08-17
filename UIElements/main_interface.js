localUser = {};
rooms = {};
selectedRoom = {};
selectedThread = {};
users = {};
usergroups = {};

var ViewEnum = {"room": 1, "thread": 2, "search": 3, "private_thread": 4 }
currentPage = ViewEnum.room;

/*-----------------USERS----------------------*/
function HasPermission(user, permName)
{
	return user.permissions.includes(permName);
}

$(document).on("UpdateUserInfo", function (event, data)
{
	data = JSON.parse(data);
	localUser = data.local_user[0];
	usergroups = data.usergroups;

	$(".localUserNickname").html(localUser.nickname);
});

/*-----------------SPEEDBAR----------------------*/
function UpdateSpeedBar()
{
	var htmlContent = "";

	if (currentPage == ViewEnum.room || currentPage == ViewEnum.private_thread)
	{
		htmlContent += '<span class="current_page globalTextColor">' + selectedRoom.name + '</span>';
	}
	else if (currentPage == ViewEnum.thread)
	{
		htmlContent += '<span id="speedbar_room_link" class="globalTextColorHoverOnly">' + selectedRoom.name + '</span><span>></span><span class="current_page globalTextColor">' + selectedThread.name + '</span>';
	}

	$("#speedbar").html(htmlContent);
}

$(document).on("onReady", function ()
{
	$("#speedbar").on("click", "#speedbar_room_link", function()
	{
		var signalData = {};
		signalData.id = selectedRoom.id;

		ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
	});
});

/*---------------------------------------------*/
$(document).on("OnUpdateUserList", function (event, data)
{
	data = JSON.parse(data);
	users = data.users;

	var htmlContent = "";

	$.each(data.users, function (key, value)
	{
		var addClass = "";

		if (value.isOnline)
			addClass += "online ";

		if (value.unreadMsgCount > 0)
			addClass += "unread ";

		if (value.isSelected > 0)
			addClass += "selected ";

		htmlContent += '<div class="listed_user ' + addClass + '" data-id="' + value.id + '">' + value.nickname + '</div>';
	});

	$("#users_list").html(htmlContent);
});

$(document).on('click', '.listed_user', function()
{
	var signalData = {};
	signalData.id = $(this).attr("data-id");

	ApoapseAPI.SendSignal("LoadUserPage", JSON.stringify(signalData));
});

/*$(document).on("UpdateUnreadMessagesCount", function (event, data)
{
	data = JSON.parse(data);

	if (currentPage == ViewEnum.room && selectedRoom.dbid == data.roomDbId)
	{
		if (data.threadUnreadMsgCount > 0)
		{
			$("#thread_dbid_" + data.threadDbId + " .listed_thread_unread_mgs").show();
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
});*/


/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	var dropZone = document.getElementsByTagName("BODY")[0];

	dropZone.addEventListener('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';

		$("#dialog_mask").fadeIn(450);
		$("#dropfile_icon").fadeIn(450);
	});
	
	dropZone.addEventListener('drop', function(e) {
		e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files; // Array of all files
	
		for (var i=0, file; file=files[i]; i++) {
			console.log(file);
			var htmlContent = "";

			htmlContent += '<div class="attachment_file clickable"><div class="att_icon fa4"></div><div class="att_title">' + file.name + '</div><span class="att_author">' + localUser.nickname + '<span class="att_datetime">Dec 17</span></span><span class="att_size">3 MB</span></div>';

			$("#global_listed_attachments").prepend(htmlContent);

			/*var progress = 0;
			setInterval(function() {
				progress++;				
				$("#global_listed_attachments").first().children(".att_icon").html(progress);
			}, 60);*/

			//if (file.type.match(/image.*/)) {
			/*	var reader = new FileReader();
	
				reader.onload = function(e2) {
					// finished reading file data.
				}
	
				//reader.readAsDataURL(file); // start reading the file data.
			}*/
		}

		$("#dialog_mask").hide();
		$("#dropfile_icon").hide();
	});
});
