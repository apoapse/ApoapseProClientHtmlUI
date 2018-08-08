$(document).on("onReady", function ()
{
	$("#login_connect_form").submit(function ()
	{
		$("#status_bar").html("Encrypting password...");
		$("#status_bar").css({ background: "#97a524" });

		setTimeout(function ()
		{
			$("#status_bar").html("Connecting...");
		}, 1100);

		setTimeout(function ()
		{
			$("#status_bar").html("Connected.");
			$("#status_bar").css({ background: "#24a5a0" });

			let loginUserInfo = {};
			loginUserInfo.server = $("#login_input_server").val();
			loginUserInfo.username = $("#login_username").val();
			loginUserInfo.password = $("#login_password").val();

			ApoapseAPI.SendSignal("login", JSON.stringify(loginUserInfo));

			$("#login_container").animate({ width: 0 }, 900, function ()
			{
				$(this).hide();
			});
		}, 1400);





		return false;
	});

	$(".conv_as_list").click(function ()
	{
		$("#convs").hide();
		$("#conv_msgs").fadeIn(800);
		$(".conv_msg_submit_form").show();

		$("#main_content").scrollTop($("#main_content").height());	// scroll to bottom
		$("#global_path_title").html("Dev > <span>Visuels pour l'alpha</span>");
	});

	$("#conv_msg_submit_form").submit(function ()
	{
		$("#conv_msg_form_textarea").prop("disabled", true);
		$("#conv_msg_form_textarea input").prop("disabled", true);

		let msg = $("#conv_msg_form_textarea").val();
		$("#conv_msgs").append('<div class="conv_message"><div> Guillaume <span class="msg_send_date"> PRINT - 15:07 - 27 SEP</span ></div><table><tr><td><img style="background-image: url(ui_elements/GP_avatar.jpg);" /></td><td valign="top">' + msg + '</td></tr></table></div >');
		$("#main_content").scrollTop($("#main_content").height());	// scroll to bottom

		$("#status_bar").css({ background: "#97a524" });
		$("#status_bar").html("Encrypting message...");

		setTimeout(function ()
		{
			ApoapseAPI.SendSignal("send_msg", "");
			$("#status_bar").html("Sending...");

			setTimeout(function ()
			{
				$("#status_bar").html("Message sent.");

				$("#conv_msg_form_textarea").prop("disabled", false);
				$("#conv_msg_form_textarea input").prop("disabled", false);
				$("#conv_msg_form_textarea").val("");

				setTimeout(function ()
				{
					$("#status_bar").css({ background: "#24a5a0" });
					$("#status_bar").html("Connected.");

				}, 2200);

			}, 625);
		}, 800);

		//

		return false;
	});
});