# Apoapse Pro Client HTML UI
The UI of the Apoapse Pro Client is made using web technologies relying on the Chromium Embedded Framework for rendering. For the client software, see the [Apoapse Pro Client repository](https://github.com/apoapse/ApoapseProClient).

![Apoapse Pro User Interface](https://apoapse.space/wp-content/uploads/2019/10/3_min.png)

## How to use
There is no compiling or packing required for the client to display the UI, the content of this repository just need to be placed in a folder called *ClientResources* alongside the client executable.

The Apoapse Pro Client UI requires a few third party libraries in order to run correctly. Here is their name and save location:
* [Moment.js](https://github.com/moment/moment) - root directory (moment-with-locales.js)
* [JQuery](https://jquery.com/) - root directory (jquery.min.js)
* [Font Awesome 5 free](https://fontawesome.com/) - fonts/font-awesome-5
* [Font Awesome 4 free](https://fontawesome.com/) - fonts/font-awesome-4
* [Inter UI](https://rsms.me/inter/) - fonts/InterUI-hinted

## Javascript / C++ communication
To communicate between the UI code and the C++ client code, the Apoapse Client integrates so called “signals” which are asynchronous events that can be called and received from both C++ and Javascript. A signal is recognizable by a name and can contain text data (usually formatted in JSON but no format is required).

## Javascript example
```js
// Receiving a signal from the C++ client
$(document).on("OnUpdatedServerSettings", function (event, dat)
{
	data = JSON.parse(dat);
	$(".company_name").html(data.server_name);
});

// Sending a signal to the C++ client
var signalData = {};
signalData.id = selectedRoom.id;

ApoapseAPI.SendSignal("loadRoomUI", JSON.stringify(signalData));
```

## C++ example
```cpp
// Receiving a command from the UI
std::string ApoapseClient::OnReceivedSignal(const std::string& name, const JsonHelper& json)
{
	return std::string();
}

// Sending a signal to the UI
JsonHelper ser;
ser.Insert("author.name", message);
ser.Insert("author.name", author->nickname);

global->htmlUI->SendSignal("NewMessage", ser.Generate());
```