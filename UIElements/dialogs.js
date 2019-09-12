var isDialogOpen = false;

function OpenDialog(dialogName)
{
	$(".dialog").fadeOut(400);
	$("#dialog_" + dialogName).fadeIn(450);
	$("#dialog_mask").fadeIn(450);

	$(document).trigger("on_opened_dialog_" + dialog);
	isDialogOpen = true;
}

$(document).on("onReady", function ()
{
	$(".dialog_link").click(function ()
	{
		var dialogName = $(this).attr("data-dialog-to-open");
		OpenDialog(dialogName);
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
		if (isDialogOpen && $(this).hasAttr("data-send-cmd"))
		{
			CloseDialog(this);
		}
	});

	/*-------------------ADMIN PANEL--------------------------*/
	$(document).on("UpdateUserInfo", function (event, data)
	{
		if (HasPermission(localUser, "CREATE_USER"))
		{
			$("#admin_panel_add_user_tab_name").removeClass("disable");
			$("#admin_panel_add_user_tab_name").addClass("selected");

			$("#dialog_tab_add_user").show();

			$("#usergroup_select_list").html("");
			$.each(usergroups, function()
			{
				$("#usergroup_select_list").append($("<option />").val(this.name).text(this.name));
			});
		}
		else
		{
			$("#admin_panel_add_user_tab_name").addClass("disable");
			$("#dialog_tab_add_user").hide();
		}
	});

	$(document).on("validate_add_new_user", function (event, data)
	{
		ApoapseAPI.SendSignal("register_user", JSON.stringify(data));

		$("#add_new_user_form").trigger("reset");
	});

	$(document).on("OnAddNewUserLocal", function (event, data)
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