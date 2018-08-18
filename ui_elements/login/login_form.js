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

$(document).on("OnDisconnect", function ()
{
	$(".screen").hide();

	$("#login_connect_button").prop("disabled", false);
	$("#login_container").animate({ width: '100%' }, 900, function ()
	{
		$(this).show();
	});

	$("#login_form").show();
});

$(document).on("show_setup_state", function (event, data)
{
	data = JSON.parse(data);
	$("#login_form").hide();
	$("#install_screen").fadeIn(300);
	//$("#admin_create_account_username").val(data.savedUsername);
});

$(document).on("ShowFirstUserConnection", function ()
{
	$("#login_form").hide();
	$("#first_connection").fadeIn(300);
});

$(document).on("connected_and_authenticated", function ()
{
	$("#login_container").animate({ width: 0 }, 900, function ()
	{
		$(this).hide();
	});
});

$(document).on("apoapse_install_form", function (event, data)
{
	ApoapseAPI.SendSignal("apoapse_install", JSON.stringify(data));

	$("#install_screen").fadeOut(500);
});

$(document).on("user_first_connection_form", function (event, data)
{
	ApoapseAPI.SendSignal("user_first_connection", JSON.stringify(data));

	$("#first_connection").fadeOut(500);
});