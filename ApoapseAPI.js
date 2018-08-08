var ApoapseAPI =
	{
		SendSignal: function (name, data, callbackEvent)
		{
			if (typeof data === 'undefined')
			{
				data = '';
			}

			$.ajax({
				type: "POST",
				url: "http://apoapse/signal/" + name,
				data: data,
				//dataType: "json",
				success: function (result)
				{
					if (typeof callbackEvent !== 'undefined')
					{
						if (result !== '')
							$(document).trigger(callbackEvent, result);
						else
							$(document).trigger(callbackEvent);
					}
				}
			});
		},

		Log: function (msg)
		{
			this.SendSignal("apoapse_log", msg);
		},

		UpdateStatusBar: function(msg, isError)
		{
			var args = {};
			args.msg = msg;
			args.is_error = isError === true;

			$(document).trigger("update_status_bar", JSON.stringify(args));
		}
	};

var Localization =
	{
		localizedTextDefault: undefined,
		localizedTextLocale: undefined,
		localeStr: "",

		ReadLocalizationFile: function (locale, isDefaultLoc)
		{
			$.ajax({
				type: "GET",
				url: "http://apoapse/resources/localization/" + locale + ".json",
				dataType: "json",
				success: function (result)
				{
					if (isDefaultLoc)
					{
						localizedTextDefault = result;
					}
					else
					{
						localizedTextLocale = result;
					}

					if (!isDefaultLoc)	// The non-default locale is always the last to be loaded
					{
						Localization.OnLocalesLoaded();
						localeStr = locale;
					}
				},
				error: function ()
				{
					ApoapseAPI.Log("Unable to load the localization file for " + locale); 
				}
			});
		},

		Initialize: function (locale)
		{
			if (locale === "en-us")
			{
				this.ReadLocalizationFile("en-us", false);
			}
			else
			{
				this.ReadLocalizationFile("en-us", true);
				this.ReadLocalizationFile(locale, false);
			}
		},

		OnLocalesLoaded: function (preferredLocale)
		{
			// Read the whole webpage to replace the localized text with the right local value
			let webpageContent = $("body").html();
			webpageContent = Localization.LocalizeText(webpageContent);
			$("body").html(webpageContent);

			// Trigger the main ready event (outside of this API, the $(document).ready() event should never be used)
			$(document).trigger("onReady");
		},

		// Use to localize a text which can include unlocalized alias
		LocalizeText: function (text)
		{
			return text.replace(/(@\w+)/g, function (str) { return Localization.LocalizeString(str); });
		},

		// Use to localize an alias (aliases must start with the @ character)
		LocalizeString: function (alias)
		{
			var nakedAlias = alias.substring(1, alias.length);	// We remove the @ at the start
			var value = localizedTextLocale[nakedAlias];

			if (typeof value === 'undefined')
			{
				ApoapseAPI.Log("LocalizeString: Unable to find in the locale file the alias for " + alias);

				if (typeof localizedTextDefault !== 'undefined')
					value = localizedTextDefault[nakedAlias];

				if (typeof value === 'undefined')
				{
					value = alias;
				}
			}

			return value;
		}
	};

$(document).ready(function ()
{
	Localization.Initialize("en-us");	// #TODO get the locale from user preferences
});

// Check if attribute exist/is present
$.fn.hasAttr = function (name)
{
	return (this.attr(name) !== undefined);
};

$(document).on("onReady", function ()
{
	$("form").submit(function ()
	{
		if ($(this).hasAttr("data-js-event"))
		{
			var eventName = $(this).attr("data-js-event");
			var data = {};

			$(this).find("input[type=text], input[type=password], textarea, select").each(function ()
			{
				var fieldName = $(this).attr("name");

				data[fieldName] = $(this).val();
			});

			$(document).trigger(eventName, data);

			return false;
		}
	});
});