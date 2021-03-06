const Discord = require ('discord.js');
const Listing = require ('./../modules/Listing');
const fs = require('fs');
const settings = require('./../settings.json');
const owner = settings.owner;

module.exports.run = async (bot, message, args) => {
   let roles = message.guild.roles;
   let scrimmers = message.guild.roles.find( r => r.name === "@everyone");
   let snipeChannel = message.channel;
   const filter = m => !m.author.bot;
   let game = new Listing();

   let raw = fs.readFileSync('./roles.json');
   let allowedRoles = JSON.parse(raw);

    let validation = function(serverRoles, userRoles){
        let val = false;
        serverRoles.forEach((role) => {
            userRoles.forEach((usr) => {
                if (role == usr){
                    val = true;
                }
            });
        });
        return val;
    }

   let editLast3 = null;

   let startMessage = new Discord.RichEmbed()
        .setAuthor("FortnitePH PRO Scrims", "https://i.imgur.com/xvTkWJv.png")
        .setTitle("__**Fortnite Philippines**__")
        .setThumbnail("https://i.imgur.com/eR5D1t0.png")
        .addField("Instructions :",`
	-Server: __**Asia | SG, JP**__
        -Load content. 
        -Wait in the snipe voice channel. 
        -Press ready on __**GO**__. 
        -If you're with a ps4 player, give the party leader to the pc player.
        -Enter the last 3 digits of your server.`)
        .setImage("https://i.imgur.com/xvTkWJv.png")
        .setColor("#E96D33")
        .addField("Hosted by" , message.author)
        .setFooter("Developed by the FortnitePH PRO Scrims Team")
	.setTimestamp()
        
    
    message.channel.send({embed: startMessage});    
    
    let time = 30;
    let editTime = "";

    let timeEmbed = new Discord.RichEmbed()
        .setTitle("**Next game in...**")
        .setDescription(time + "minutes")
        .setColor("#E96D33");
        

    setTimeout(async () => {
        editTime = await message.channel.send({embed: timeEmbed}).catch( (err) => {
            console.log("You can't edit the code");
        });
    }, 10);    

    let timeInterval = setInterval(()=> {
        if (time >= 2){
            time -= 1;
            timeEmbed.setDescription(time + " minutes");
        }else if (time === 1){
            time -= 1;
            timeEmbed.setDescription(time + " minutes");
            clearInterval(timeInterval);
        }
        editTime.edit({embed: timeEmbed}).catch((err) => {
            console.log("Cant edit timer, clearing interval");
            clearInterval(timeInterval);
        });
    },60000);

    let last3 = new Discord.RichEmbed()
        .setTitle ("**Servers**")
        .setColor ("#E96D33")

    setTimeout(async () => {
        editLast3= await message.channel.send({embed: last3});
    }, 10);
    
    const collector =snipeChannel.createMessageCollector(filter, {time: 300000});
	snipeChannel.overwritePermissions(
        scrimmers,
        { "SEND_MESSAGES": true}
    )

    collector.on('collect', m => {

        console.log(`Collected ${m.content} | ${m.author}`);       
        
        if (validation(allowedRoles.roles,m.member.roles.array()) || m.member.id === owner){
            if (m.content === "!start" || m.content === "!stop"){
                collector.stop();
                console.log("Collector Stoped");
                return;
            }
        }   
        if (game.data.length ===0 && m.content.length === 3){
            game.addID(m.content.toUpperCase(), m.author);
        }else if (m.content.length === 3){
            if (game.userPresent(m.author)){
                game.deleteUserEntry(m.author);
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author);
                }else {
                     game.addID(m.content.toUpperCase(), m.author);
                }
            } else {
                if (game.idPresent(m.content.toUpperCase())){
                    game.addUser(m.content.toUpperCase(), m.author);
                }else {
                    game.addID(m.content.toUpperCase(), m.author);
                }
            }
        }

    game.sort();

    let str = "";
    last3 = new Discord.RichEmbed()
        .setTitle("**Servers**")
        .setColor("#E96D33")

    for (var i =0; i < game.data.length; i++){
        str = "";
        for (var j = 0; j < game.data[i].users.length ; j++){
            str += game.data[i].users[j] + "\n";
        }
        last3.addField(`${game.data[i].id.toUpperCase()} - ${game.data[i].users.length} Players` , str, true);
    }    

    editLast3.edit({embed: last3}).catch((err) => {
        console.log("error you can't edit");
    });

    if (m.deletable){
        m.delete().catch((err) => {
            console.log("you can't erase");
            console.log(err);
        });
    }

    });

    collector.on('end', collected => {

        console.log(`Collected ${collected.size} items`);
        let endMessage = new Discord.RichEmbed()
			.setColor("#E60D0D")
            .setDescription("**No more codes accepted at this point, good luck!**")
            .setFooter("Chat blocked..." , "https://i.imgur.com/Hqvs7k7.png")
		message.channel.send({embed: endMessage});
		snipeChannel.overwritePermissions(
            scrimmers,
            { "SEND_MESSAGES": false}
        );
    });
}






module.exports.help = {
    name: "start"
}

