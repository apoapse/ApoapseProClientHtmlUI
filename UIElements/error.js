$(document).on("OnServerError", function (event, data)
{
	data = JSON.parse(data);

	$("#error_message").html(Localization.LocalizeString("@error_" + data.name) + '<br><i style="font-size: 14px; color: gray,">' + data.name + '</i>');
	OpenDialog("error");
});