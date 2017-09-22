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
		}
	};

var Localization =
	{
		localizedTextDefault: undefined,
		localizedTextLocale: undefined,

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
						Localization.OnLocalesLoaded();
				},
				error: function ()
				{
					ApoapseAPI.Log("Unable to load the localization file for " + locale); 
				}
			});
		},

		Initialize: function (locale)
		{
			if (locale == "en-us")
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
			webpageContent = webpageContent.replace(/(@\w+)/g, function (text) { return Localization.LocalizeString(text); });
			$("body").html(webpageContent);

			// Trigger the main ready event (outside of this API, the $(document).ready() event should never be used)
			$(document).trigger("onReady");
		},

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