# Plex-Discord-Presence
Display the current song youre listening to on plex in discord

## How to set up
1. Clone this repository into any folder on your computer. It has to be the same computer, discord is installed on. I only tested it on Windows, idk if it works on other operating systems.
2. run ``npm install`` or installPackages.bat to install all packages used.
3. run ``node index.js`` or start.bat, on the first start, it will create an config file, in which you need to fill in your plex credentials.
4. run ``node index.js`` or start.bat again and if you did everything right, as soon as you start playing a song, it will be displayed in discord.

**Note:**
Due to discords limitations, the status can only be updated every 15 seconds.

## Example Image
<br/><img src="https://i.imgur.com/YPzyg6X.png">
