localUser = {};
rooms = {};
selectedRoom = {};
selectedThread = {};
selectedUserPage = {};
users = {};
usergroups = {};

var ViewEnum = {"room": 1, "thread": 2, "search": 3, "private_thread": 4 }
currentPage = ViewEnum.room;

function SwitchView(newView)
{
	// Save unread messages
	var unsentMsgContent = $("#send_msg_editor").val();
	if (currentPage == ViewEnum.thread || currentPage == ViewEnum.private_thread)
	{
		var signalData = {};
		if (currentPage == ViewEnum.thread)
		{
			signalData.roomId = selectedRoom.id;
			signalData.threadId = selectedThread.id;
		}
		else
		{
			signalData.userId = selectedUserPage.user.id;
		}

		signalData.msgContent = unsentMsgContent;
		ApoapseAPI.SendSignal("SaveUnsentMessage", JSON.stringify(signalData));
	}

	// Set current page
	currentPage = newView;

	// Reset html containers
	$("#room").hide();
	$("#thread").hide();
	$("#thread_messages").html("");
	$("#threads_list").html("");
	$("#msg_editor").hide();
	$("#search_results").hide();
	$("#searchbar").hide();
	$("#search_filter_button").hide();
	$("#send_msg_editor").val("");
}

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

	if (localUser.avatar.length > 0)
		$(".localUserAvatar").attr("src", localUser.avatar);
});

/*-----------------SETTINGS----------------------*/
$(document).on("OnUpdatedServerSettings", function (event, data)
{
	data = JSON.parse(data);

	$(".company_name").html(data.server_name.substring(0, 22) + '<span class="fas"></span>');
});

$(document).on("SetClientGlobalSettings", function (event, data)
{
	data = JSON.parse(data);

	$("#login_form_container input[name=server]").val(data.default_server);
	$("#login_form_container input[name=username]").val(data.default_username);
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

		if (value.isLocalUser)
			addClass += "local_user ";

		if (value.isSelected > 0)
			addClass += "selected ";

		htmlContent += '<div class="listed_user ' + addClass + '" data-id="' + value.id + '">' + value.nickname + '</div>';
	});

	$("#users_list").html(htmlContent);
});

$(document).on('click', '#users_list .listed_user:not(.local_user)', function()
{
	var signalData = {};
	signalData.id = $(this).attr("data-id");
	$(this).addClass("selected");

	ApoapseAPI.SendSignal("LoadUserPage", JSON.stringify(signalData));
});

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	ApoapseAPI.SendSignal("OnUIReady", "{}");

	var dropZone = document.getElementsByTagName("BODY")[0];

	dropZone.addEventListener('dragover', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';

		$("#dialog_mask").fadeIn(450);
		$("#dropfile_icon").fadeIn(450);
	});
	
	dropZone.addEventListener('drop', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		
		$("#dialog_mask").hide();
		$("#dropfile_icon").hide();
		ApoapseAPI.SendSignal("OnFilesDropped");
	});

	dropZone.addEventListener('dragend ', function(e)
	{
		e.stopPropagation();
		e.preventDefault();

		$("#dialog_mask").hide();
		$("#dropfile_icon").hide();
	});

	dropZone.addEventListener('dragleave ', function(e)
	{
		e.stopPropagation();
		e.preventDefault();

		$("#dialog_mask").hide();
		$("#dropfile_icon").hide();
	});

	$("#dialog_mask").click(function(e) {
		$("#dropfile_icon").hide();
	});

	/*---------------------------------------------*/
	$(".file_input").click(function()
	{
		var signalData = {};
		signalData.name = $(this).find("input").attr("name");

		ApoapseAPI.SendSignal("OpenFileDialog", JSON.stringify(signalData));
	});

	$(document).on("OnFileDialogPathSet", function (event, data)
	{
		console.log(data);
		data = JSON.parse(data);
		
		$('.file_input input[name="' + data.name + '"]').val(data.filepath);
	});
});

/*-----------------ATTACHMENTS----------------------*/
function SortAttachments()
{
	var obj = {};
	obj.sortBy = $("#attachments_sort_by").val();
	obj.order = $(".sort_options .selected").attr("data-dir");

	ApoapseAPI.SendSignal("SortAttachments", JSON.stringify(obj));
}

$(document).on('change', '#attachments_sort_by', function()
{
	SortAttachments()
});

$(document).on('click', '.sort_options div', function()
{
	$(".sort_options .selected").removeClass("selected");
	$(this).addClass("selected");

	SortAttachments();
});
