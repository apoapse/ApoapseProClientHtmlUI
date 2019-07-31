var isDialogOpen = false;

$(document).on("onReady", function ()
{
	$(".dialog_link").click(function ()
	{
		var dialog = $(this).attr("data-dialog-to-open");
		$(".dialog").fadeOut(400);
		$("#dialog_" + dialog).fadeIn(450);
		$("#dialog_mask").fadeIn(450);

		$(document).trigger("on_opened_dialog_" + dialog);
		isDialogOpen = true;
	});

	$(".close_dialog_on_click").click(function ()
	{
		CloseDialog();
	});

	function CloseDialog(button)
	{
		$(".dialog").fadeOut(400);
		$("#dialog_mask").fadeOut(400);
		$(".dialog form").trigger("reset"); /* TODO: might cause performances issues */
		isDialogOpen = false;

		if (button !== undefined)
		{
			var dialog = $(button).closest(".dialog").attr("id");

			$(document).trigger("on_closed_" + dialog);
		}
	}

	$(".dialog_close_button").click(function ()
	{
		CloseDialog(this);
	});

	$("#dialog_mask").click(function(e) {
		CloseDialog(this);
	});

	$("form").submit(function (event)
	{
		if (isDialogOpen)
		{
			CloseDialog(this);
		}
	});

	/*---------------------------------------------*/
	$(document).on("validate_add_new_user", function (event, data)
	{
		ApoapseAPI.SendSignal("register_user", JSON.stringify(data));

		$("#add_new_user_form").trigger("reset");
	});

	$(document).on("OnAddedNewUser", function (event, data)
	{
		data = JSON.parse(data);

		$("#add_new_user_tempUsernamefield").val(data.username);
		$("#add_new_user_temppasswordfield").val(data.temp_password);
		$("#new_user_info_form").show();
	});

	$(document).on("on_closed_dialog_settings", function (event, data)
	{
		$("#new_user_info_form").hide();
	});
});