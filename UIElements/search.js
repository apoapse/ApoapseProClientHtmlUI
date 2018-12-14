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
					$("#search_results").show();
					field.blur();

					//Todo: add a central controler that handle switching between "pages"
					currentPage = ViewEnum.search;
					$("#thread").hide();
					$("#room").hide();
				}
				else
				{
					$("#searchbar").hide();
				}

				event.preventDefault();
			}
		});
	});
});