const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const pvpranks = require("../data/ranks.json");
const titledb = require("../data/titles.json");
const emotes = require("../common/emotes").emotes;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const outfits = require("../data/characters.json")
const outfitdb = require("../data/characters.json")
const { createCanvas, loadImage, registerFont } = require("canvas");
const lodash = require("lodash");

const { resolve } = require("path");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a profile")
    .addSubcommand((cmd) =>
      cmd
        .setName("view")
        .setDescription("View a profile")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("View the profile of another user")
            .setRequired(false)
        )
    )
    .addSubcommand((cmd) => cmd
    .setName("edit")
    .setDescription("Edit your profile")
    .addStringOption((option) => option
    .setName("helmet")
    .setDescription("Change your helmet")
    .setRequired(false)
    )
    .addStringOption((option) => option
    .setName("outfit")
    .setDescription("Change your outfit")
    .setRequired(false)
    )
    .addStringOption((option) => option
    .setName("accessory")
    .setDescription("Change your accessory")
    .setRequired(false)
    )
    .addStringOption((option) => option
    .setName("showcase")
    .setDescription("Change your showcased car on your profile and garage")
    .setRequired(false)
    )
    ),
  async execute(interaction) {
    let command = interaction.options.getSubcommand();

    if (command == "view") {

      await interaction.reply(`${emotes.loading} Please wait...`)

      let user = interaction.options.getUser("user") || interaction.user;
      let userdata = await User.findOne({ id: user.id });
      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
      let helmet = userdata.helmet || "default";
      let title = userdata.title || "noob racer";
      if (!title || title == null || title == undefined) {
        title = "noob racer";
      }
      title = titledb[title.toLowerCase()].Title;
      let skill = userdata.skill;
      let dragwins = userdata.dragwins || 0
      let streetwins = userdata.streetwins || 0
      let trackwins = userdata.trackwins || 0
      let eventwins = userdata.eventwins || 0
      let dragloss = userdata.dragloss || 0
      let streetloss = userdata.streetloss || 0
      let trackloss = userdata.trackloss || 0
      let eventloss = userdata.eventloss || 0

      let cars = userdata.cars;
      let finalprice = 0;

      for (let car in cars) {
        let car2 = cars[car];
        let price = cardb.Cars[car2.Name.toLowerCase()]?.Price;
        if (price) finalprice += Number(price);
      }



      let pvprank = userdata.pvprank;
      let pvpname = pvprank.Rank || "Silver";

      if (pvpname == undefined) {
        pvpname = "Silver";
      }





      let pvpindb = pvpranks[pvpname.toLowerCase()];
      let achievements = userdata.achievements;
 
      let achivarr = [];
      for (let ach in achievements) {
        let achiev = achievements[ach];
        let achindb = achievementsdb.Achievements[achiev.name.toLowerCase()];
        achivarr.push(`${achindb.Image}`);
      }
      if (achivarr.length == 0) {
        achivarr = ["No achievements"];
      }
      
      let cash = userdata.cash;
      finalprice += cash;

      finalprice = toCurrency(finalprice)
      
      let acthelmet = outfits.Helmets[helmet.toLowerCase()].Image;
      let outfit = outfits.Outfits[userdata.outfit.toLowerCase()].Image;

      let showcase = userdata.showcase

      registerFont(resolve("./assets/images/DaysOne-Regular.ttf"), { family: "Days One" })

      let canvas = createCanvas(1280, 720);
      let ctx = canvas.getContext("2d");
      let bg = await loadImage("https://i.ibb.co/6YdrpSL/profile-image-2.png");
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
       let helmimg = await loadImage(acthelmet);
       let outfitimg = await loadImage(outfit);

       ctx.drawImage(outfitimg, 25, 35, 200, 200);
      ctx.drawImage(helmimg, 25, 35, 200, 200);
      if(userdata.accessory !== "None"){
        let acc = outfits.Accessories[userdata.accessory.toLowerCase()].Image

        let accimg = await loadImage(acc)
        ctx.drawImage(accimg, 25, 35, 200, 200);

      }

      ctx.font = "30px Days One";
      ctx.fillStyle = "#ffffff";
      if(showcase && showcase !== null && showcase !== undefined){
        let showcasedimg2 = showcase.Image || showcase.Livery || cardb.Cars[showcase.Name.toLowerCase()].Image
        let showcasedimg = await loadImage(`${showcasedimg2}`)
        ctx.drawImage(showcasedimg, 850, 15, 410, 250);
        ctx.font = "20px Days One";

        ctx.fillText(`P: ${showcase.Speed}`, 720, 50);
        ctx.fillText(`A: ${showcase.Acceleration}s`, 720, 80);
        ctx.fillText(`W: ${showcase.WeightStat}`, 720, 110);
        ctx.fillText(`H: ${showcase.Handling}`, 720, 140);

      }
      else {
        ctx.fillText("/showcase", 950, 140);

      }

      ctx.font = "40px Days One";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(user.username, 25, 300);

      ctx.font = "20px Days One";
      
      ctx.fillText(finalprice, 170, 360);
      
      let pvpimg = await loadImage(pvpindb.icon)
      ctx.fillText(`${streetwins}/${streetloss}`, 220, 465);
      ctx.fillText(`${dragwins}/${dragloss}`, 200, 525);
      ctx.fillText(`${trackwins}/${trackloss}`, 210, 580);
      ctx.fillText(`${eventwins}/${eventloss}`, 210, 640);

      ctx.font = "28px Days One";

      let prestige = userdata.prestige
      ctx.fillText(`Skill: ${skill}`, 250, 70);
      ctx.fillText(`PVP Rank: ${pvprank.Wins}`,  250, 150);
      ctx.fillText(`Prestige: ${prestige}`,  250, 220);

      ctx.drawImage(pvpimg, 450, 130, 25, 25)

      if(achivarr.includes("https://i.ibb.co/4fTVjPX/ach-fusionmaster.png")){
        let achiev = await loadImage("https://i.ibb.co/4fTVjPX/ach-fusionmaster.png")
        ctx.drawImage(achiev, 400, 570, 50, 50)
      }

      if(achivarr.includes("https://i.ibb.co/Zf8bGrN/achievement-rich.png")){
        let achiev = await loadImage("https://i.ibb.co/Zf8bGrN/achievement-rich.png")
        ctx.drawImage(achiev, 450, 570, 50, 50)
      }

      if(achivarr.includes("https://i.ibb.co/4Py8NZ6/achievement-richer.png")){
        let achiev = await loadImage("https://i.ibb.co/4Py8NZ6/achievement-richer.png")
        ctx.drawImage(achiev, 500, 570, 50, 50)
      }
      if(achivarr.includes("https://i.ibb.co/ZK046Gf/achievement-richest.png")){
        let achiev = await loadImage("https://i.ibb.co/ZK046Gf/achievement-richest.png")
        ctx.drawImage(achiev, 500, 570, 50, 50)
      }
      if(achivarr.includes("https://i.ibb.co/n3XDmjg/ach-timemaster.png")){
        let achiev = await loadImage("https://i.ibb.co/n3XDmjg/ach-timemaster.png")
        ctx.drawImage(achiev, 500, 570, 50, 50)
      }
      if(achivarr.includes("https://i.ibb.co/Hh0qSBh/achievement-bugsmasher.png")){
        let achiev = await loadImage("https://i.ibb.co/Hh0qSBh/achievement-bugsmasher.png")
        ctx.drawImage(achiev, 650, 570, 50, 50)
      }
      if(achivarr.includes("https://i.ibb.co/vkfr887/ACH-driftking.png")){
        let achiev = await loadImage("https://i.ibb.co/vkfr887/ACH-driftking.png")
        ctx.drawImage(achiev, 550, 570, 50, 50)
      }
      if(achivarr.includes("https://i.ibb.co/0hTDFp9/ach-legacy.png")){
        let achiev = await loadImage("https://i.ibb.co/0hTDFp9/ach-legacy.png")
        ctx.drawImage(achiev, 600, 570, 50, 50)
      }

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Outfits")
          .setStyle("Secondary")
          .setEmoji("<:racer_outfit_default:1191492617318432858>")
          .setCustomId("helmets"),
      );

      let row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setEmoji("◀️")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("▶️")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("first")
          .setEmoji("⏮️")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("last")
          .setEmoji("⏭️")
          .setStyle("Secondary")
      );
      let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        name: "stats-image.png",
      });
      let msg;
      if (user == interaction.user) {
        msg = await interaction.editReply({
          files: [attachment],
          content: "",
          components: [row],
          fetchReply: true,
        });
      } else {
        msg = await interaction.editReply({        
             files: [attachment],
          content: "",
          fetchReply: true, });
      }

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
      });
      let helmlist = [];

      for (let helm in userdata.outfits) {
        let helmet = userdata.outfits[helm];
        helmlist.push(helmet);
      }

     

      helmlist = lodash.chunk(
        helmlist.map((a) => a),
        10
      );


      let page = 0;
      let vispage = 1;
      let items;
      let embed = new EmbedBuilder()
      collector.on("collect", async (i) => {
        if (i.customId == "helmets") {
          items = helmlist;

          let displayhelms = [];

          for (let h in helmlist[page]) {
            let helm = helmlist[page][h];
            if(outfits.Accessories[helm.Name.toLowerCase()]){
              displayhelms.push(
                `${outfits.Accessories[helm.Name.toLowerCase()].Emote} ${
                  outfits.Accessories[helm.Name.toLowerCase()].Name
                }`
              );

            }
            else if(outfits.Outfits[helm.Name.toLowerCase()]){
              displayhelms.push(
                `${outfits.Outfits[helm.Name.toLowerCase()].Emote} ${
                  outfits.Outfits[helm.Name.toLowerCase()].Name
                }`
              );

            }
            else if(outfits.Helmets[helm.Name.toLowerCase()]){
              displayhelms.push(
                `${outfits.Helmets[helm.Name.toLowerCase()].Emote} ${
                  outfits.Helmets[helm.Name.toLowerCase()].Name
                }`
              );

            }
          }

          embed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle("Your Outfits")
            .setFooter({ text: `Page ${vispage}` })
            .setDescription(`${displayhelms.join("\n")}`);

          interaction.editReply({
            embeds: [embed],
            components: [row, row2],
            fetchReply: true,
          });
        } else if (i.customId == "next") {
          page++;
          vispage++;

          if (page > items.length)
            return interaction.editReply({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in helmlist[page]) {
              let helm = helmlist[page][h];
              if(outfits.Accessories[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Accessories[helm.Name.toLowerCase()].Emote} ${
                    outfits.Accessories[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Outfits[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Outfits[helm.Name.toLowerCase()].Emote} ${
                    outfits.Outfits[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Helmets[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Helmets[helm.Name.toLowerCase()].Emote} ${
                    outfits.Helmets[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Outfits")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            interaction.editReply({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } 
        } else if (i.customId == "previous") {
          page--;
          vispage--;

          if (page > items.length)
            return interaction.editReply({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              if(outfits.Accessories[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Accessories[helm.Name.toLowerCase()].Emote} ${
                    outfits.Accessories[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Outfits[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Outfits[helm.Name.toLowerCase()].Emote} ${
                    outfits.Outfits[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Helmets[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Helmets[helm.Name.toLowerCase()].Emote} ${
                    outfits.Helmets[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Outfits")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            interaction.editReply({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } 
        } else if (i.customId == "first") {
          page = 0;
          vispage = 1;

          if (page > items.length)
            return interaction.editReply({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              if(outfits.Accessories[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Accessories[helm.Name.toLowerCase()].Emote} ${
                    outfits.Accessories[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Outfits[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Outfits[helm.Name.toLowerCase()].Emote} ${
                    outfits.Outfits[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Helmets[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Helmets[helm.Name.toLowerCase()].Emote} ${
                    outfits.Helmets[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Outfits")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            interaction.editReply({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } 
        } else if (i.customId == "last") {
          page = items.length;
          vispage = items.length += 1;

          if (page > items.length)
            return interaction.editReply({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              if(outfits.Accessories[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Accessories[helm.Name.toLowerCase()].Emote} ${
                    outfits.Accessories[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Outfits[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Outfits[helm.Name.toLowerCase()].Emote} ${
                    outfits.Outfits[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
              else if(outfits.Helmets[helm.Name.toLowerCase()]){
                displayhelms.push(
                  `${outfits.Helmets[helm.Name.toLowerCase()].Emote} ${
                    outfits.Helmets[helm.Name.toLowerCase()].Name
                  }`
                );
  
              }
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Outfits")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            interaction.editReply({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } 
        }
      });
    } 
    else if (command == "edit"){
      let helmet = interaction.options.getString("helmet");
      let outfit = interaction.options.getString("outfit");
      let accessory = interaction.options.getString("accessory");
      let showcase = interaction.options.getString("showcase");

      let userdata = await User.findOne({ id: interaction.user.id });
      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
      let outfits = userdata.outfits;
      if(helmet){
        if(!outfitdb.Helmets[helmet.toLowerCase()]){
          return await interaction.reply("That helmet doesn't exist!")
        }
        let helmetinoutfits = outfits.filter((outfit) => outfit.Name.toLowerCase() == helmet.toLowerCase())
        if(helmetinoutfits.length == 0){
          return await interaction.reply("You don't have that helmet!")
        }
        userdata.helmet = helmet;
      }
      if(outfit){
        if(!outfitdb.Outfits[outfit.toLowerCase()]){
          return await interaction.reply("That outfit doesn't exist!")
        }
        let helmetinoutfits = outfits.filter((outfit) => outfit.Name.toLowerCase() == outfit.toLowerCase())
        if(helmetinoutfits.length == 0){
          return await interaction.reply("You don't have that outfit!")
        }
        userdata.outfit = outfit;
      }
      if(accessory){
        if(!outfitdb.Accessories[accessory.toLowerCase()]){
          return await interaction.reply("That accessory doesn't exist!")
        }
        let helmetinoutfits = outfits.filter((outfit) => outfit.Name.toLowerCase() == accessory.toLowerCase())
        if(helmetinoutfits.length == 0){
          return await interaction.reply("You don't have that helmet!")
        }
        userdata.accessory = accessory;
      }
      if(showcase){
 
        let car = userdata.cars.filter((car) => car.ID.toLowerCase() == showcase.toLowerCase())[0]
        if(!car){
          return await interaction.reply("You don't have that car!")
        }
        userdata.showcase = car;
      }
      await userdata.save();
      await interaction.reply("Updated your profile!")

    }
  },
};
