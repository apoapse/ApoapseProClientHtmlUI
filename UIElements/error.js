/* ----------------------------------------------------------------------------
// Copyright (C) 2020 Apoapse
// Copyright (C) 2020 Guillaume Puyal
//
// Distributed under the Apoapse Pro Client Software License. Non-commercial use only.
// See accompanying file LICENSE.md
//
// For more information visit https://github.com/apoapse/
// And https://apoapse.space/
// ----------------------------------------------------------------------------*/

$(document).on("OnServerError", function (event, data)
{
	data = JSON.parse(data);

	$("#error_message").html(Localization.LocalizeString("@error_" + data.name) + '<br><i style="font-size: 14px; color: gray,">' + data.name + '</i>');
	OpenDialog("error");
});