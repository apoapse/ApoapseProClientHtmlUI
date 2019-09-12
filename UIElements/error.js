$(document).on("OnServerError", function (event, data)
{
	data = JSON.parse(data);

	$("#error_message").html(data.name);
	OpenDialog("error");
});