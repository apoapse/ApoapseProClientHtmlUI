localUser = {};
rooms = {};
selectedRoom = {};
selectedThread = {};

var ViewEnum = {"room": 1, "thread": 2, "search": 3 }
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
