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
						callbackEvent(null, result);
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
						Localization.OnLocalesLoaded(locale);
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
			if (locale === "en")
			{
				this.ReadLocalizationFile("en", false);
			}
			else
			{
				this.ReadLocalizationFile("en", true);	// Load the default locale first
				this.ReadLocalizationFile(locale, false);
			}
		},

		OnLocalesLoaded: function (preferredLocale)
		{
			// Read the whole webpage to replace the localized text with the right local value
			let webpageContent = $("body").html();
			webpageContent = Localization.LocalizeText(webpageContent);
			$("body").html(webpageContent);

			moment.locale(preferredLocale);	// Set the locale for the dates

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
		},

		LocalizeDateTimeRelative: function (dateTime)	// ISO 8601
		{
			return moment(dateTime).fromNow();
		},

		LocalizeDateTimeFull: function (dateTime)	// ISO 8601
		{
			return moment(dateTime).format("LLL");
		}
	};

$(document).ready(function ()
{
	Localization.Initialize(g_locale);
});

// Check if attribute exist/is present
$.fn.hasAttr = function (name)
{
	return (this.attr(name) !== undefined);
};

$(document).on("onReady", function ()
{
	// Update the relative date times
	window.setInterval(function()
	{
		$("[data-date-raw]").each(function()
		{
			var date = $(this).attr("data-date-raw");
			$(this).html(Localization.LocalizeDateTimeRelative(date));
		});
	}, 1000 * 60);

	// Forms
	$("form").submit(function (event)
	{
		var data = {};

		$(this).find("input[type=text], input[type=password], textarea, select, input[type=checkbox]:checked, input[type=radio]:checked").each(function ()
		{
			var fieldName = $(this).attr("name");

			data[fieldName] = $(this).val();
		});

		if ($(this).hasAttr("data-submit-signal"))
		{
			$(".dialog").fadeOut(500);
			$(this)[0].reset();
	
			var signalName = $(this).attr("data-submit-signal");
			ApoapseAPI.SendSignal(signalName, JSON.stringify(data));
		}
		else if ($(this).hasAttr("data-send-cmd"))
		{
			$(this)[0].reset();

			var signalName = "cmd_" +  $(this).attr("data-send-cmd");

			ApoapseAPI.SendSignal(signalName, JSON.stringify(data));
		}

		if ($(this).hasAttr("data-js-event"))
		{
			var eventName = $(this).attr("data-js-event");

			$(document).trigger(eventName, data);
		}

		return false;
	});

	$(".simple_signal_link").click(function()
	{
		var signalName = $(this).attr("data-signal-to-call");
		ApoapseAPI.SendSignal(signalName, "");
	});
});