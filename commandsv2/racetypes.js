const {
   MessageActionRow,
   MessageButton,
   MessageEmbed,
   MessageCollector,
   MessageSelectMenu,
 } = require("discord.js");
 const db = require("quick.db");
 const { SlashCommandBuilder } = require("@discordjs/builders");
 
 module.exports = {
   data: new SlashCommandBuilder()
     .setName("races")
     .setDescription("See details for each race type"),
   async execute(interaction) {
     const row2 = new MessageActionRow().addComponents(
       new MessageSelectMenu()
         .setCustomId("select")
         .setPlaceholder("No race selected")
         .addOptions([
           {
             label: "PVP",
             description: "Information about PVP racing",
             value: "pvp_race",
             customId: "pvp",
           },
           {
            label: "botrace",
            description: "Information about bot racing",
            value: "bot_race",
            customId: "botrace",
          },
          {
            label: "qm",
            description: "Information about quarter mile racing",
            value: "qm_race",
            customId: "qmrace",
          },
          {
            label: "hm",
            description: "Information about half mile racing",
            value: "hm_race",
            customId: "hmrace",
          },
          {
            label: "squadrace",
            description: "Information about squad racing",
            value: "squad_race",
            customId: "squadrace",
          },
          {
            label: "timetrial",
            description: "Information about time trials",
            value: "tt_race",
            customId: "ttrace",
          },
          {
            label: "drift (EVENT)",
            description: "Information about drifting",
            value: "driftrace",
            customId: "drift",
          },
          {
            label: "driftpvp (EVENT)",
            description: "Information about drifting against players",
            value: "dpvp_race",
            customId: "driftpvp",
          },
          {
            label: "wanted",
            description: "Information about escaping the police",
            value: "police_race",
            customId: "police",
          },
          {
            label: "pinkslips",
            description: "Information about betting your car against other users",
            value: "pinkslip_race",
            customId: "pinkslip",
          },
          {
            label: "cashcup",
            description: "Information about cashcup races",
            value: "cash_race",
            customId: "cash",
          },
          {
            label: "betrace",
            description: "Information about bet racing",
            value: "bet_race",
            customId: "bet",
          },
          {
            label: "trainrace",
            description: "Information about the race for new players",
            value: "train_race",
            customId: "tr",
          },
         ])
     );

     let rpemote = "<:rp:983968476060336168>"
        let cashemote = "<:zecash:983966383408832533>"
     let embed = new MessageEmbed();
     embed.setTitle("Race Menu");
     embed.setFooter('Prefix is "/"');
     embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
     embed.setDescription(`Here you can check out the race types and their rewards!\n\n
          
          <:boost:983813400289234978> = You can use nitrous in this race

          Choose an item from the drop down menu below, there are many different types such as drifting, pink slips, and more!

       `);
 
     embed.setColor("#60b0f4");
 
     interaction.reply({ embeds: [embed], components: [row2] })
       .then((msg) => {
         const filter = (interaction2) =>
         interaction2.isSelectMenu() &&
         interaction2.user.id === interaction.user.id;
 
         const collector = interaction.channel.createMessageComponentCollector({
           filter,
           time: 1000 * 30,
         });
 
         collector.on("collect", async (collected) => {
           const value = collected.values[0];
           if (value === "pvp_race") {
            embed.fields = []
             embed.setTitle("PVP Racing");
             embed.setFooter('Prefix is "/"');
             embed.setDescription(`Race against other players!`);
             embed.addField(`Rewards`, `$500\n10 RP`)
             embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
             embed.setColor("#60b0f4");
 
             await interaction.editReply({ embeds: [embed], components: [row2] });
           } 
           else if (value === "bot_race") {
              embed.fields = []
            embed.setTitle("Bot Racing");
            embed.setFooter('Prefix is "/"');
            embed.setDescription(`Race against bots for practice!\n<:boost:983813400289234978>`);
            embed.addField(`Tier 1`, `${cashemote} $50\n${rpemote} 1`, true)
            embed.addField(`Tier 2`, `${cashemote} $150\n${rpemote} 1`, true)
            embed.addField(`Tier 3`, `${cashemote} $350\n${rpemote} 2`, true)
            embed.addField(`Tier 4`, `${cashemote} $450\n${rpemote} 3`, true)
            embed.addField(`Tier 5`, `${cashemote} $550\n${rpemote} 4\n<:zbarns:941571059600195594> 1`, true)
            embed.addField(`Tier 6`, `${cashemote} $750\n${rpemote} 5\n<:zbarns:941571059600195594> 2`, true)
            embed.addField(`Tier 7`, `${cashemote} $1050\n${rpemote} 10\n<:zbarns_u:958540705964371978> 1`, true)

            embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
            embed.setColor("#60b0f4");

            await interaction.editReply({ embeds: [embed], components: [row2] });
          } 
          else if (value === "qm_race") {
            embed.fields = []
          embed.setTitle("Quarter Mile Racing");
          embed.setFooter('Prefix is "/"');
          embed.setDescription(`Race bots on the quarter mile track and earn keys for import crates!\n<:boost:983813400289234978>`);
          embed.addField(`Tier 1`, `${cashemote} $75\n${rpemote} 1\n<:ckey:993011409132728370> 2`, true)
          embed.addField(`Tier 2`, `${cashemote} $225\n${rpemote} 2\n<:ckey:993011409132728370> 4`, true)
          embed.addField(`Tier 3`, `${cashemote} $275\n${rpemote} 3\n<:rkey:993011407681486868> 1`, true)
          embed.addField(`Tier 4`, `${cashemote} $375\n${rpemote} 4\n<:rkey:993011407681486868> 2`, true)
          embed.addField(`Tier 5`, `${cashemote} $475\n${rpemote} 5\n<:rkey:993011407681486868> 3`, true)
          embed.addField(`Tier 6`, `${cashemote} $675\n${rpemote} 6\n<:rkey:993011407681486868> 5`, true)
          embed.addField(`Tier 7`, `${cashemote} $850\n${rpemote} 7\n<:ekey:993011410210672671> 1`, true)

          embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
          embed.setColor("#60b0f4");

          await interaction.editReply({ embeds: [embed], components: [row2] });
        } 
        else if (value === "train_race") {
          embed.fields = []
        embed.setTitle("Training Track Racing");
        embed.setFooter('Prefix is "/"');
        embed.setDescription(`Race beginner bots on the track **for new users**!\n<:boost:983813400289234978>`);
        embed.addField(`Tier 1`, `${cashemote} $150\n${rpemote} 1`, true)
            embed.addField(`Tier 2`, `${cashemote} $250\n${rpemote} 2`, true)
            embed.addField(`Tier 3`, `${cashemote} $350\n${rpemote} 3`, true)
        embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
        embed.setColor("#60b0f4");

        await interaction.editReply({ embeds: [embed], components: [row2] });
      } 
        else if (value === "hm_race") {
         embed.fields = []
       embed.setTitle("Half Mile Racing");
       embed.setFooter('Prefix is "/"');
       embed.setDescription(`Race bots on the half mile track!\n<:boost:983813400289234978>`);
       embed.addField(`Tier 1`, `${cashemote} $150\n${rpemote} 2`, true)
       embed.addField(`Tier 2`, `${cashemote} $300\n${rpemote} 3 ${rpemote}`, true)
       embed.addField(`Tier 3`, `${cashemote} $450\n${rpemote} 4`, true)
       embed.addField(`Tier 4`, `${cashemote} $650\n${rpemote} 4`, true)
       embed.addField(`Tier 5`, `${cashemote} $750\n${rpemote} 5`, true)
       embed.addField(`Tier 6`, `${cashemote} $900\n${rpemote} 6\n<:wheelspin:985048616865517578> 1\nChance at <:bankupgrade:974153111298007131> 1`, true)
       embed.addField(`Tier 7`, `${cashemote} $1250\n${rpemote} 10\n<:wheelspin:985048616865517578> 2`, true)

       embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
       embed.setColor("#60b0f4");

       await interaction.editReply({ embeds: [embed], components: [row2] });
     } 
     else if (value === "squad_race") {
      embed.fields = []
    embed.setTitle("Squad Racing");
    embed.setFooter('Prefix is "/"');
    embed.setDescription(`Race squads to take their cars!\n<:boost:983813400289234978>`);
    embed.addField(`Rewards`, `$600`)
    embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
    embed.setColor("#60b0f4");

    await interaction.editReply({ embeds: [embed], components: [row2] });
  } 
else if (value === "tt_race") {
   embed.fields = []
 embed.setTitle("Time Trial");
 embed.setFooter('Prefix is "/"');
 embed.setDescription(`Test your cars limits by doing a time trial!`);
 embed.addField(`Rewards`, `$300 - time`)
 embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
 embed.setColor("#60b0f4");

 await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "driftrace") {
   embed.fields = []
 embed.setTitle("Drifting");
 embed.setFooter('Prefix is "/"');
 embed.setDescription(`Drift freely and earn money for it!`);
 embed.addField(`Easy`, `${cashemote} $200\n${rpemote} 2\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track`, true)
 embed.addField(`Medium`, `${cashemote} $450\n${rpemote} 4\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track`, true)
 embed.addField(`Hard`, `${cashemote} $800\n${rpemote} 6\n<:zeronotor:962785804202176574> Car Drift Rating * 5 - time to complete track`, true)

 embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
 embed.setColor("#60b0f4");

 await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "dpvp_race") {
   embed.fields = []
 embed.setTitle("PVP Drifting");
 embed.setFooter('Prefix is "/"');
 embed.setDescription(`Drift against other players!`);
 embed.addField(`Rewards`, `$500\n10 RP`)
 embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
 embed.setColor("#60b0f4");

 await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "police_race") {
   embed.fields = []
 embed.setTitle("Wanted");
 embed.setFooter('Prefix is "/"');
 embed.setDescription(`Get away from the cops, but if you don't get away suffer a loss!`);
 embed.addField(`Tier 1`, `${cashemote} $400`, true)
 embed.addField(`Tier 2`, `${cashemote} $700`, true)
 embed.addField(`Tier 3`, `${cashemote} $1000`, true)
 embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
 embed.setColor("#60b0f4");

 await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "pinkslip_race") {
  embed.fields = []
embed.setTitle("Pinkslips");
embed.setFooter('Prefix is "/"');
embed.setDescription(`Race another user to steal their car!*`);
embed.addField(`Rewards`, `The winner gets the losers car`)
embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
embed.setColor("#60b0f4");

await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "cash_race") {
  embed.fields = []
embed.setTitle("Cashcup");
embed.setFooter('Prefix is "/"');
embed.setDescription(`Rise up the ranks of cash cup, and earn more money from each tier!`);
embed.addField(`Rewards`, `Cash cup tier * $75`)
embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
embed.setColor("#60b0f4");

await interaction.editReply({ embeds: [embed], components: [row2] });
} 
else if (value === "bet_race") {
  embed.fields = []
embed.setTitle("Bet racing");
embed.setFooter('Prefix is "/"');
embed.setDescription(`Bet against the odds! Careful, the bot chooses any car from the game, so you could be racing a miata or a mclaren speedtail.`);
embed.addField(`Rewards`, `The amount you bet * 1.5`)
embed.setThumbnail("https://i.ibb.co/mXxfHbH/raceimg.png");
embed.setColor("#60b0f4");

await interaction.editReply({ embeds: [embed], components: [row2] });
} 
         });
       });
   },
 };
 