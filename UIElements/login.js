function ResetLoginScreen()
{
	$("#login_connect_button").prop("disabled", false);
	$("#login_connect_button").val("Connect");
}
$(document).on("login", function (event, data)
{
	$("#login_connect_button").prop("disabled", true);
	$("#login_form_password").val("");
	$("#login_connect_button").val("Connecting...");

	ApoapseAPI.SendSignal("login", JSON.stringify(data));
});

$(document).on("OnDisconnect", function ()
{
	ResetLoginScreen();
	$("#login").show();
	$("#login_form_container").show();
	$("#install_form_container").hide();
	$("#user_form_container").hide();
});

/*---------------------------------------------*/
$(document).on("OnReceivedServerInfo", function (event, data)
{
	data = JSON.parse(data);

	if (data.status == "setup_state")
	{	
		$("#login_form_container").hide();
		$("#install_form_container").show();
		$("#install_form_container").removeClass("hide");	$("#admin_form_username").val(data.previousUsername);
	}
	else if (data.status == "authenticated")
	{
		if (data.requirePasswordChange)
		{
			// First connection
			$("#login_form_container").hide();
			$("#user_form_container").show();
		}
		else
		{
			// connected and authenticated
			localUser = data.localUser;
		
			$("#login").fadeOut(600);
			ResetLoginScreen();
		
			$(".localUserNickname").html(localUser.nickname);
		}
	}
});

$(document).on("validate_install_form", function (event, data)
{
	$("#login_form_container").show();
	$("#install_form_container").hide();

	$("#login_form_container input").val("");
});

/*---------------------------------------------*/
$(document).on("validate_first_login_form", function (event, data)
{
	if (data.password == data.password_2)
	{
		ApoapseAPI.SendSignal("user_first_connection", JSON.stringify(data));

		/*$("#login_form_container").show();*/
	}
	else
	{
		// TODO: error passwords do not match
	}

	$("#user_form_container form").trigger("reset");
});