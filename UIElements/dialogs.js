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

var isDialogOpen = false;

function OpenDialog(dialogName)
{
	$(".dialog").fadeOut(400);
	$("#dialog_" + dialogName).fadeIn(450);
	$("#dialog_mask").fadeIn(450);

	$(document).trigger("on_opened_dialog_" + dialogName);
	isDialogOpen = true;
}

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
});