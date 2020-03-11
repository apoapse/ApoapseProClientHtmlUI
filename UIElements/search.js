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

$(document).on("onReady", function ()
{
	$("#search_bar_link").click(function ()
	{
		var field = $("#searchbar input");

		$("#searchbar").show();
		field.focus();

		field.keydown(function (event)
		{
			if (event.keyCode == 13)
			{
				var searchText = field.val();

				if (searchText.length > 0)
				{
					var data = {};
					data.query = searchText;

					ApoapseAPI.SendSignal("search", JSON.stringify(data));
				}
				else
				{
					$("#searchbar").hide();
				}

				event.preventDefault();
			}
		});
	});

	$(document).on("DisplaySearchResults", function (event, data)
	{
		data = JSON.parse(data);
		SwitchView(ViewEnum.search);	//Todo: add a central controler that handle switching between "pages"
		var field = $("#searchbar input");
		var htmlContent = "";

		$("#search_results").show();
		$("#search_filter_button").show();
		field.val(data.query);
		field.blur();
		$("#searchbar").show();

		if (data.hasOwnProperty("attachments"))
		{
			htmlContent += '<h2>' + Localization.LocalizeString("@attachments") + '</h2>';
			htmlContent += '<div class="search_results_section">';
			$.each(data.attachments, function()
			{
				htmlContent += GenerateAttachment(this);
			});
			htmlContent += '</div>';
		}

		if (data.hasOwnProperty("threads"))
		{
			htmlContent += '<h2>' + Localization.LocalizeString("@threads") + '</h2>';
			htmlContent += '<div class="search_results_section">';
			$.each(data.threads, function()
			{
				htmlContent += GenerateListedThread(this);
			});
			htmlContent += '</div>';
		}

		if (data.hasOwnProperty("messages"))
		{
			htmlContent += '<h2>' + Localization.LocalizeString("@messages") + '</h2>';
			htmlContent += '<div class="search_results_section">';
			$.each(data.messages, function()
			{
				htmlContent += GenerateMessageInListHTML(this);
			});
			htmlContent += '</div>';
		}

		$("#search_results").html(htmlContent);
	});
});