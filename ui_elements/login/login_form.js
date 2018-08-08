$(document).on("login", function (event, data)
{
	$("#login_connect_button").prop("disabled", true);
	$("#login_form_password").val("");
	ApoapseAPI.SendSignal("login", JSON.stringify(data));
});

$(document).on("create_admin_form", function (event, data)
{
	$("#create_admin_button").prop("disabled", true);

	if (data.password !== data.password_confirmation)
	{
		ApoapseAPI.UpdateStatusBar("@password_does_not_match_status", true);

		$("#administrator_password").val("");
		$("#administrator_password_confirmation").val("");
		$("#create_admin_button").prop("disabled", false);
		return false;
	}

	ApoapseAPI.SendSignal("create_admin", JSON.stringify(data));
});

$(document).on("login_form_enable_back", function ()
{
	$("#login_connect_button").prop("disabled", false);
	$("#login_container").animate({ width: '100%' }, 900, function ()
	{
		$(this).show();
	});

	$("#login_form").show();
});

$(document).on("show_setup_state", function ()
{
	$("#login_form").hide();
	$("#setup_state_form").fadeIn(300);
});

$(document).on("connected_and_authenticated", function ()
{
	$("#login_container").animate({ width: 0 }, 900, function ()
	{
		$(this).hide();
	});
});