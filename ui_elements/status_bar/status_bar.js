$(document).on("update_status_bar", function (event, data)
{
	let args = JSON.parse(data);

	$("#status_bar").html(Localization.LocalizeText(args.msg));

	if (args.is_error === "true")
		$("#status_bar").addClass("status_bar_error");
	else
		$("#status_bar").removeClass("status_bar_error");
});