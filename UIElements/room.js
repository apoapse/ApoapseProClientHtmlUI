$(document).on("rooms_update", function (event, data)
{
	data = JSON.parse(data);
	rooms = data.rooms;

	var htmlContent = "<h2>rooms</h2>";
	
	$.each(data.rooms, function (key, value)
	{
		var classes = "";

		if (classes.isSelected)
			classes += " globalTextColor selected";
		else
			classes += " globalTextColorHoverOnly";
		
		htmlContent += '<div class="listed_room  clickable ' + classes + '"><div>' + value.unreadMessagesCount + '</div>' + value.name + '</div>';
		
		//htmlContent += '<div class="bar_item '+ classes + '" data-id="' + value.internal_id + '" id="room_in_bar_' + value.dbid + '">
		//<div class="vignette" style="background: white;"></div>' + value.name + '<div class="room_in_list_unread_count">' + value.unreadMessagesCount + '</div></div>';
	});

	$("#panel_left").html(htmlContent);

	/*if (Object.keys(rooms).length > 0)
	{
		$("#create_new_thread_button").show();
	}*/

	/*$("#panel_left .listed_room").click(function()
	{
		$("#rooms_list .bar_item").removeClass("selected");
		$(this).addClass("selected");
		$("#create_new_thread_button").show();

		var signalData = {};
		signalData.internalId = $(this).attr("data-id");
		
		ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
	});*/
});