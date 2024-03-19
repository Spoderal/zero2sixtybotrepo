

const {EmbedBuilder, AttachmentBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const ranks = require("../data/ranks.json");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { resolve } = require("path");
const {emotes} = require("../common/emotes")
const outfits = require("../data/characters.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderstats")
    .setDescription("Check the leaderboard")
    .addSubcommand((cmd) =>
      cmd.setName("cash").setDescription("See the richest users")
    )
    .addSubcommand((cmd) =>
      cmd.setName("skill").setDescription("See the highest skilled users")
    )
    .addSubcommand((cmd) =>
    cmd.setName("prestige").setDescription("See the highest prestige users")
  )
    .addSubcommand((cmd) =>
      cmd.setName("pvp").setDescription("See who has the best PVP rank")
    ),

  async execute(interaction) {
    await interaction.deferReply();
    let leaderboardtype = interaction.options.getSubcommand();

    let users = await User.find({});
    if (!users?.length) {
      return await interaction.editReply(
        "The cash leaderboard is currently empty!"
      );
    }

    let embed;
    if (leaderboardtype == "cash") {

      let embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor(colors.discordTheme.green)
      .setDescription("View the top 10 richest users!")
      .setThumbnail("https://i.ibb.co/St08xH4/leaderboard-cash.png")
      
      let filteredUsers = users
      .filter((value) => value.cash > 0)
      .sort((b, a) => a.cash - b.cash)

     filteredUsers = filteredUsers.slice(0 ,10)
      console.log(filteredUsers.length)
      for (let i = 0; i < filteredUsers.length; i++) {
        let user = filteredUsers[i];
        let userfetch = await interaction.client.users.fetch(user.id).catch(() => {});
        embed.addFields({name: `#${i + 1} ${userfetch.username}`, value: `Cash: ${emotes.cash} ${toCurrency(user.cash)}`});

      }
      await interaction.editReply({ embeds: [embed] });

    } else if (leaderboardtype == "skill") {
      let canvas = createCanvas(3840, 2400);
      let ctx = canvas.getContext("2d");

      let leaderbg = await loadImage("https://i.ibb.co/DGBFZnh/leaderboard-skill.png");
      ctx.drawImage(leaderbg, 0, 0, canvas.width, canvas.height);
      await registerFont(resolve("./assets/images/DaysOne-Regular.ttf"), { family: "Days One" })



      let filteredUsers = users
      .filter((value) => value.skill > 0)
      .sort((b, a) => a.skill - b.skill)

      filteredUsers.slice(0 ,10)
      
      let top1 = await interaction.client.users.fetch(filteredUsers[0].id).catch(() => {});
      let top2 = await interaction.client.users.fetch(filteredUsers[1].id).catch(() => {});
      let top3 = await interaction.client.users.fetch(filteredUsers[2].id).catch(() => {});
      let top4 = await interaction.client.users.fetch(filteredUsers[3].id).catch(() => {});
      let top5 = await interaction.client.users.fetch(filteredUsers[4].id).catch(() => {});
      let top6 = await interaction.client.users.fetch(filteredUsers[5].id).catch(() => {});
      let top7 = await interaction.client.users.fetch(filteredUsers[6].id).catch(() => {});
      let top8 = await interaction.client.users.fetch(filteredUsers[7].id).catch(() => {});
      let top9 = await interaction.client.users.fetch(filteredUsers[8].id).catch(() => {});
       let top10 = await interaction.client.users.fetch(filteredUsers[9].id).catch(() => {});
      ctx.font = "150px Days One";
      ctx.fillStyle = "#48dcfe";

      if(top1 !== undefined){
        let username = truncate(top1.username, 20)
        ctx.fillText(`${username} - ${filteredUsers[0].skill}`, 310, 560);  


        ctx.font = "250px Days One";
        ctx.fillStyle = "#ffffff";
        let helmet = filteredUsers[0].helmet || "default";
        let fit = filteredUsers[0].outfit
        let acthelmet = outfits.Helmets[helmet.toLowerCase()].Image;
        let outfit = outfits.Outfits[fit.toLowerCase()].Image;
        let helmimg = await loadImage(acthelmet);
       let outfitimg = await loadImage(outfit);

       ctx.drawImage(outfitimg, 2050, 35, 2000, 2000);
      ctx.drawImage(helmimg, 2050, 35, 2000, 2000);
      ctx.textAlign = "center";

        ctx.fillText(`${username}`, 3060, 2240);  
        ctx.textAlign = "left";

      }
      ctx.font = "150px Days One";
      ctx.fillStyle = "#fed700";
      if(top2 !== undefined){
        let username = truncate(top2.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[1].skill}`, 310, 720);  

      }
      ctx.font = "150px Days One";
      ctx.fillStyle = "#c0c0c0";
  

      if(top3 !== undefined){
        let username = truncate(top3.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[2].skill}`, 310, 900);  

      }
      ctx.font = "120px Days One";
      ctx.fillStyle = "#cd8032";
      if(top4 !== undefined){
        let username = truncate(top4.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[3].skill}`, 410, 1107);  

      }
      if(top5 !== undefined){
        let username = truncate(top5.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[4].skill}`, 410, 1315);  

      }
      if(top6 !== undefined){
        let username = truncate(top6.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[5].skill}`, 410, 1500);  

      }
      if(top7 !== undefined){
        let username = truncate(top7.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[6].skill}`, 410, 1700);  

      }
      if(top8 !== undefined){
        let username = truncate(top8.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[7].skill}`, 410, 1900);  

      }
      if(top9 !== undefined){
        let username = truncate(top9.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[8].skill}`, 410, 2094);  

      }
      if(top10 !== undefined){
        let username = truncate(top10.username, 20)
        ctx.fillText(`${username} - ${filteredUsers[9].skill}`, 410, 2300);  

      }

      
      
      let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        name: "lb-image.png",
      });
      return await interaction.editReply({
        embeds: [],
        files: [attachment],
        fetchReply: true,
      });
      
    } 
    else if (leaderboardtype == "prestige") {
      let canvas = createCanvas(3840, 2400);
      let ctx = canvas.getContext("2d");

      let leaderbg = await loadImage("https://i.ibb.co/4dj3MXF/prestige-leaderstats-template-1.png");
      ctx.drawImage(leaderbg, 0, 0, canvas.width, canvas.height);
      await registerFont(resolve("./assets/images/DaysOne-Regular.ttf"), { family: "Days One" })



      let filteredUsers = users
      .filter((value) => value.prestige >= 0)
      .sort((b, a) => a.prestige - b.prestige)

      filteredUsers.slice(0 ,10)
      
      let top1 = await interaction.client.users.fetch(filteredUsers[0].id).catch(() => {});
      let top2 = await interaction.client.users.fetch(filteredUsers[1].id).catch(() => {});
      let top3 = await interaction.client.users.fetch(filteredUsers[2].id).catch(() => {});
      let top4 = await interaction.client.users.fetch(filteredUsers[3].id).catch(() => {});
      let top5 = await interaction.client.users.fetch(filteredUsers[4].id).catch(() => {});
      let top6 = await interaction.client.users.fetch(filteredUsers[5].id).catch(() => {});
      let top7 = await interaction.client.users.fetch(filteredUsers[6].id).catch(() => {});
      let top8 = await interaction.client.users.fetch(filteredUsers[7].id).catch(() => {});
      let top9 = await interaction.client.users.fetch(filteredUsers[8].id).catch(() => {});
       let top10 = await interaction.client.users.fetch(filteredUsers[9].id).catch(() => {});
      ctx.font = "150px Days One";
      ctx.fillStyle = "#48dcfe";

      if(top1 !== undefined){
        let username = truncate(top1.username, 20)
        ctx.fillText(`${username} - ${filteredUsers[0].prestige}`, 310, 560);  


        ctx.font = "250px Days One";
        ctx.fillStyle = "#ffffff";
        let helmet = filteredUsers[0].helmet || "default";
        let fit = filteredUsers[0].outfit
        let acthelmet = outfits.Helmets[helmet.toLowerCase()].Image;
        let outfit = outfits.Outfits[fit.toLowerCase()].Image;
        let helmimg = await loadImage(acthelmet);
       let outfitimg = await loadImage(outfit);

       ctx.drawImage(outfitimg, 2050, 35, 2000, 2000);
      ctx.drawImage(helmimg, 2050, 35, 2000, 2000);
      ctx.textAlign = "center";

        ctx.fillText(`${username}`, 3060, 2240);  
        ctx.textAlign = "left";

      }
      ctx.font = "150px Days One";
      ctx.fillStyle = "#fed700";
      if(top2 !== undefined){
        let username = truncate(top2.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[1].prestige}`, 310, 720);  

      }
      ctx.font = "150px Days One";
      ctx.fillStyle = "#c0c0c0";
  

      if(top3 !== undefined){
        let username = truncate(top3.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[2].prestige}`, 310, 900);  

      }
      ctx.font = "120px Days One";
      ctx.fillStyle = "#cd8032";
      if(top4 !== undefined){
        let username = truncate(top4.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[3].prestige}`, 410, 1107);  

      }
      if(top5 !== undefined){
        let username = truncate(top5.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[4].prestige}`, 410, 1315);  

      }
      if(top6 !== undefined){
        let username = truncate(top6.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[5].prestige}`, 410, 1500);  

      }
      if(top7 !== undefined){
        let username = truncate(top7.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[6].prestige}`, 410, 1700);  

      }
      if(top8 !== undefined){
        let username = truncate(top8.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[7].prestige}`, 410, 1900);  

      }
      if(top9 !== undefined){
        let username = truncate(top9.username, 10)
        ctx.fillText(`${username} - ${filteredUsers[8].prestige}`, 410, 2094);  

      }
      if(top10 !== undefined){
        let username = truncate(top10.username, 20)
        ctx.fillText(`${username} - ${filteredUsers[9].prestige}`, 410, 2300);  

      }

      
      
      let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        name: "lb-image.png",
      });
      return await interaction.editReply({
        embeds: [],
        files: [attachment],
        fetchReply: true,
      });
      
    } 
    else if (leaderboardtype == "pvp") {
      embed = new EmbedBuilder()
        .setTitle("PVP Leaderboard")
        .setColor(colors.blue);

      let filteredUsers = users
        .filter((value) => value.pvprank.Wins > 0)
        .sort((b, a) => a.pvprank.Wins - b.pvprank.Wins)
        .slice(0, 40);
        let pvpdb = require("../data/ranks.json")

        let pvpfilter2 = filteredUsers.sort((b, a) => pvpdb[a.pvprank.Rank.toLowerCase()].rank - pvpdb[b.pvprank.Rank.toLowerCase()].rank)

      if (!pvpfilter2?.length) {
        return await interaction.editReply(
          "The PVP leaderboard is currently empty!"
        );
      }

      let currentUserPosition = 0;
      for (let i = 0; i < pvpfilter2?.length; i++) {
        const user = await interaction.client.users
          .fetch(pvpfilter2[i].id)
          .catch(() => {});
        if (!user?.username) continue;
        pvpfilter2[i].tag = `${user.username}#${user.discriminator}`;
        currentUserPosition =
        pvpfilter2[i].id == interaction.user.id ? i + 1 : 0;
      }

      const onlyTaggedUsers = pvpfilter2.filter((u) => u.tag).slice(0, 10);
      if (!onlyTaggedUsers?.length) {
        return await interaction.editReply(
          "The PVP leaderboard is currently empty!"
        );
      }

      if (currentUserPosition > 0) {
        embed.setFooter({
          text: `Your position is #${currentUserPosition} on the PVP leaderboard!`,
        });
      }

      let desc = "";
      for (let i = 0; i < onlyTaggedUsers.length; i++) {
        let pvpemote =
          ranks[onlyTaggedUsers[i].pvprank.Rank.toLowerCase()].emote;
        desc += `${i + 1}. ${onlyTaggedUsers[i].tag} - ${pvpemote} ${
          onlyTaggedUsers[i].pvprank.Wins
        }\n`;
      }

      embed.setDescription(desc);
      await interaction.editReply({ embeds: [embed] });
    }

  },
};


function truncate(str, maxlength) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}