var tmi = require('tmi.js');
var chan = "derogativs";
var whichChan;
var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "dero_Bot",
		password: "oauth:mw708o7xnt8ixbgug7u2hct1ub1be0"
	},
	channels: [chan]
};

var client = new tmi.client(options);
var skinGiveaway = ["AWP Dragon Lore", "Karambit doppler", "Ak-47 Vulcun", "M4A1 Masterpiece"];
var giveaway = true;
var bannedWords = ["noob", "penis", "uninstall", "!drop"];
var winningNum = 2;

client.connect();

client.api({

    url: 'https://api.twitch.tv/kraken/streams/' + chan 

}, (err, res, body) => {

    // online

    if(body.stream) {

        console.log(body.stream.viewers);
        if(body.stream.viewers >= 10000){
        	client.slow(chan, 120);
        }
    }

    // offline

    else {
    	console.log("Stream is offline");
    }

})

client.on('chat', function(channel, user, message, self){
	var random = Math.floor(Math.random() * 3);

	if(bannedWords.indexOf(message.toLowerCase()) == -1){
		if(message == "hello"){
			client.action(chan, "Get off my lawn " + user['display-name'] + "!");
		}
		else if(message == "!clear" && user.username == "derogativ"){
			client.clear("derogativ");
		}
		else if(message == "!startGiveaway" && user.username == "derogativ"){
			client.action(chan, "Giveaway has started type '!drop' to participate.");
			giveaway = true;
		}
		else if(message == "!endGiveaway" && user.username == "derogativ"){
			client.action("derogativ", "Giveaway has ended.");
			giveaway = false;
		}
		if(giveaway){
			var userNum = Math.floor(Math.random() * 4);
			bannedWords.splice(2, 3);
			if(message == "!drop" && userNum == winningNum){
				//checks whether the skin name starts with a vowel, fixes grammar if so
				if(['a', 'e', 'i', 'o', 'u'].indexOf(skinGiveaway[random].substring(0,1).toLowerCase()) == -1){
					client.action(chan, user['display-name'] + " received a " + skinGiveaway[random] + "!");
				}
				else{
					client.action(chan, user['display-name'] + " received an " + skinGiveaway[random] + "!");
				}
			}
		}
	}
	else{
		client.timeout("derogativ", user['display-name'], 180, "You have been timed out for saying a banned word.");
	}	
});


client.on('connected', function(address, port){
	console.log(client.getOptions());
	console.log("Address: " + address + ". Port: " + port);
	client.action(chan, "Giveaway has started type '!drop' to participate.");
});
