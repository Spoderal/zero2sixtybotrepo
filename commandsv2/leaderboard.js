const db = require("quick.db")
const Discord = require("discord.js")
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderstats')
    .setDescription("Check the leaderboard")
,
    async execute(interaction) {
        
      interaction.reply({content: `Please wait...`})
      let client = interaction.client
      let racewins = db.all().filter(data => data.ID.startsWith(`dwins`)).sort((a, b) => b.data - a.data)
      let time = db.all().filter(data => data.ID.startsWith(`timetrialtime`)).sort((a, b) => a.data - b.data)
     
      var content = "";
      var content2 = "";
      var i = 0;
      var b = 0;
      var indexnumb = 0;
      var indexnum = 0;
      var indexnum2 = 0;

      
      racewins.length = 10
      time.length = 10
      for (b in racewins) {
        let user = await client.users.fetch(racewins[b].ID.split("_")[1])
           let wins = racewins[b].data.toLocaleString()
           let num = ++indexnumb
           content2 += `${num} - ${user.tag} : **${wins}**\n`
           
           
           
          }
          for (i in time) {
            let user = await client.users.fetch(time[i].ID.split("_")[1])
               let wins = time[i].data.toLocaleString()
               let num = ++indexnum2
               content += `${num} - ${user.tag} : **${wins}s**\n`
               
               
               
              }
     
          if(content2 == ""){
            content2 = "None yet"
          }

          if(content == ""){
            content = "None yet"
          }
 
  const embed = new Discord.MessageEmbed()/*MessageEmbed*/
  .setTitle(`Global Leaderboard`)
  .addField("Time Trial Times", `${content}`, true)
  .setThumbnail("https://i.ibb.co/7WJrz2R/arrow.png")
  .setColor("#60b0f4")
  await interaction.channel.send({embeds: [embed]})
    }
    
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }