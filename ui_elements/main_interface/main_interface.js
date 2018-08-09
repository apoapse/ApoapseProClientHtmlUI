

function DrawListItem(title, description)
{
	var html = '<table class="item_list"><tr><td class="item_name" style="font-weight: bold;">' + title + '</td><td>' + description + '</td></tr></table>';

}

$(document).on("show_setup_state", function (event, data)
{
	$("#register_user").fadeIn(500);
});

$(document).on("register_new_user_form", function (event, data)
{
	ApoapseAPI.SendSignal("register_user", JSON.stringify(data));

	$("#register_user").fadeOut(500);
});

/*---------------------------------------------*/
$(document).on("onReady", function ()
{
	$(".dialog_button").click(function ()
	{
		var dialog = $(this).attr("data-dialog-to-open");
		$("#dialog_" + dialog).fadeIn(500);
	});

	$(".close_dialog_button").click(function ()
	{
		$(".dialog").fadeOut(500);
	});

	$(".dialog form").submit(function()
	{
		var data = {};

		$(this).find("input[type=text], input[type=password], textarea, select").each(function ()
		{
			var fieldName = $(this).attr("name");

			data[fieldName] = $(this).val();
		});

		$(".dialog").fadeOut(500);
		$(this)[0].reset();

		var signalName = $(this).attr("data-submit-signal");
		ApoapseAPI.SendSignal(signalName, JSON.stringify(data));

		return false;
	});

	/*---------------------------------------------*/
	$(document).on("rooms_update", function (event, data)
	{
		data = JSON.parse(data);
		var htmlContent = "";
		
		$.each(data.rooms, function (key, value)
		{
			var classes = (value.isSelected) ? "selected" : "";
			
			htmlContent += '<div class="bar_item '+ classes + '" data-id="' + value.internal_id + '"><div class="vignette" style="background: white;"></div>' + value.name + '</div>';
		});

		$("#rooms_list").html(htmlContent);

		$("#rooms_list .bar_item").click(function()
		{
			$("#rooms_list .bar_item").removeClass("selected");
			$(this).addClass("selected");

			var signalData = {};
			signalData.internalId = $(this).attr("data-id");
			
			ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
		});
	});

	/*---------------------------------------------*/
	function GenerateThreadInListHTML(threadData)
	{
		var htmlContent = "";

		htmlContent += '<table class="item_list"><tr>';
		htmlContent += '<td class="item_name listed_thread" style="font-weight: bold;">' + threadData.name + '</td>';
		htmlContent += '<td><strong>TODO username:</strong> TODO message preview</td>';
		htmlContent += '</tr></table>';

		return htmlContent;
	}

	$(document).on("on_added_new_thread", function (event, data)
	{
		data = JSON.parse(data);

		$("#threads_list").prepend(GenerateThreadInListHTML(data));
	});

	$(document).on("threads_list_update", function (event, data)
	{
		data = JSON.parse(data);
		var htmlContent = "";

		$.each(data.threads, function (key, value)
		{
			htmlContent += GenerateThreadInListHTML(value);
		});

		$("#threads_list").html(htmlContent);
	});
});
