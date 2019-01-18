const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setTitle("**Bot Information**")
    .addField("Bot name", bot.user.username)
    .addField("The count commands are:",`!solo: To start a countdown in the solo snipes vc.","!duo: To start a countdown in the duo snipes vc.","!squad: To start a countdown in the squad snipes vc.`)
    .addField("The start commands are:",`!start: Allows players to type in their game codes.","!stop: Manually locks the game code text channel (shouldn't be necessary).`)
    .addField("The warning commands are:",`!1m-solo, !1m-duo, !1m-squad: To inform the players that the next scrim is starting in 1 minute. 5m-solo, 5m-duo, 5m-squad: To inform the players that the next scrim is starting in 5 minutes. 10m-solo, 10m-duo, 10m-squad: To inform the players that the next scrim is starting in 10 minutes. !now: To inform the players that the scrim game will be starting now.`)
    .addField("Note Commands:",`!notes: Is to post/advertise when needed. Set it up using !setnotes.`)
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Created at", bot.user.createdAt)
    .setFooter("Developed by the FortnitePH PRO Scrims Team", "https://i.imgur.com/UsGfZXn.png")

    message.channel.send(botembed);
    
}

module.exports.help = {
  name:"bot-info"
}
