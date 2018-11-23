function UpdateSpeedBar()
{
	var htmlContent = "";

	if (currentPage == ViewEnum.room)
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
		signalData.internalId = selectedRoom.internal_id;
		
		ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
	});
});