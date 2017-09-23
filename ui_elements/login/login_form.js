$(document).on("onReady", function ()
{
	$("#login_connect_form").submit(function ()
	{
		$("#login_connect_button").prop("disabled", true);

		let loginUserInfo = {};
		loginUserInfo.server = $("#login_input_server").val();
		loginUserInfo.username = $("#login_username").val();
		loginUserInfo.password = $("#login_password").val();

		ApoapseAPI.SendSignal("login", JSON.stringify(loginUserInfo));

		return false;
	});
});