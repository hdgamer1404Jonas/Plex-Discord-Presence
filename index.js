var PlexAPI = require("plex-api");
const yts = require("yt-search");
const fs = require("fs");

const DiscordRPC = require("discord-rpc");

//check if ./config.json exists, if not, create it with following content:
// {
//     "host": "YOUR HOST IP",
//     "port": "YOUR PORT",
//     "username": "YOUR PLEX USERNAME",
//     "password": "YOUR PLEX PASSWORD",
// }
if(!fs.existsSync("./config.json")) {
    fs.writeFileSync("./config.json", JSON.stringify({
        "host": "192.168.178.31",
        "port": "32400",
        "username": "YOUR PLEX USERNAME",
        "password": "YOUR PLEX PASSWORD",
    }, null, 4));
    console.log("Config file created, please fill it with your plex credentials and restart the script");
    process.exit();
}

const config = require("./config.json");

//check if the config.json file is filled in
if(config.host == "YOUR HOST IP" || config.port == "YOUR PORT" || config.username == "YOUR PLEX USERNAME" || config.password == "YOUR PLEX PASSWORD") {
    console.log("Please fill in the config.json file and restart the program");
    process.exit();
}

var client = new PlexAPI({
    hostname: config.host,
    port: config.port,
    username: config.username,
    password: config.password
});




const rpc = new DiscordRPC.Client({ transport: "ipc" });
const cooldown = 15 * 1000; // activity can only be set every 15 seconds

rpc.on("ready", () => {
    console.log("Ready!");

    // update the activity every 15 seconds
    setInterval(updateActivity, cooldown);
})


rpc.login({ clientId: "1034255589188063243" }).then(console.log("logged in!")).catch(console.error);



function updateActivity() {
    console.log("Updating activity");

    //get the current playing media song name
    client.query("/status/sessions").then(async function (result) {

        //check if the song is paused
        if (!result.MediaContainer.Metadata || result.MediaContainer.Metadata[0].Player.state != "paused") {
            console.log("Song playing");
            //search for the song name + artist name on youtube and get the link
            let link = "";
            await yts(result.MediaContainer.Metadata[0].grandparentTitle + " " + result.MediaContainer.Metadata[0].title, function (err, r) {
                if (err) throw err;
                link = r.videos[0].url;
                //get the thumbnail of the video as a link
                let thumbnail = r.videos[0].thumbnail;

                var activity = {
                    state: result.MediaContainer.Metadata[0].title,
                    details: result.MediaContainer.Metadata[0].grandparentTitle,
                    timestamps: {
                        //set the start time to the song duration
                        start: Date.now() - result.MediaContainer.Metadata[0].viewOffset
                    },
                    assets: {
                        large_image: thumbnail,
                    },
                    buttons: [
                        { label: "Watch on YouTube", url: link }
                    ]
                };
                rpc.request("SET_ACTIVITY", {pid: process.pid, activity: activity});
            });
        }else {
            console.log("No song playing");
            //reset the activity
            rpc.request("SET_ACTIVITY", {pid: process.pid, activity: {}})
        }
    })
}

