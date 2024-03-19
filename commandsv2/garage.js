const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");
const { SlashCommandBuilder, StringSelectMenuBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const {emotes} = require("../common/emotes");
const itemdb = require("../data/items.json");
const { numberWithCommas } = require("../common/utils");
const {GET_STARTED_MESSAGE} = require("../common/constants");
const housedb = require("../data/houses.json")
const eggsdb = require("../data/eggdb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("garage")
    .setDescription("Check your garage")
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(false)
        .setDescription("The user to view the garage of")
    )
    .addStringOption((option) =>
      option
        .setName("filtertag")
        .setRequired(false)
        .setDescription("Filter your garage by tag")
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.user;

    let udata = await User.findOne({ id: user.id });
    let filtertag = interaction.options.getString("filtertag");

    if(!udata){
      return interaction.reply({content: GET_STARTED_MESSAGE, ephemeral: true})
    }

    let ucars = udata.cars.reverse();
    let cars = udata.cars;
    let parts = udata.parts.reverse();
    let items = udata.items.reverse();
    let houses = udata.houses;
    let garagelimit = udata.garageLimit;
    let page = 1


    if (filtertag) {
      ucars = udata.cars.filter((car) => car.Tag && car.Tag == filtertag);
    }


    let displayparts = []
    for(let part of parts){

      if(!displayparts.includes(part)){
      displayparts.push(part)
      }
    }

    let displayhouses = houses.map((house) => {
      let houseindb = housedb[house.Name.toLowerCase()];
      if(houseindb){
        return `${houseindb.Emote} ${houseindb.Name}`;

      }
    });

    let hlist = displayhouses;

    let hquantities = hlist.reduce((obj, n) => {
      obj[n] = (obj[n] || 0) + 1;
      return obj;
    }, {});


    let displayitems = items.map((item) => {
      let itemindb = itemdb[item.toLowerCase()];
      if(itemindb){
        return `${itemindb.Emote} ${itemindb.Name}`;

      }
    });
    let list2 = displayitems;
    let quantities2 = list2.reduce((obj, n) => {
      obj[n] = (obj[n] || 0) + 1;
      return obj;
    }, {});

    let displayitems2 = Object.entries(quantities2).map(([n, count]) => `${n} x${count}`);
    let displayhouses2 = Object.entries(hquantities).map(([n, count]) => `${n} x${count}`);
    
    let displayparts2 = lodash.chunk(displayparts, 6);
    displayitems2 = lodash.chunk(displayitems2, 10);
    displayhouses2 = lodash.chunk(displayhouses2, 10);
    cars = lodash.chunk(ucars, 6);
    let showcase = udata.showcase;
    let itempage = cars;
    let embed = new EmbedBuilder()
      .setTitle(`<a:icon_car:1203820291348766750> Displaying cars for ${user.username}`)
      .setDescription(`Garage Limit: ${ucars.length}/${garagelimit}`)
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
      .setFooter({ text: `Pages 1/${itempage.length}` });
    if (showcase && showcase.Image) {
      embed.setThumbnail(`${showcase.Image}`);
    }
    else {
      let image = cars[0][0].Image || cars[0][0].Livery || cars.Cars[cars[0][0].Name.toLowerCase()].Image;
      embed.setThumbnail(`${image}`)
    }

    for (let car of cars[0]) {
      let favorite = car.Favorite ? "⭐" : "";
      let tag = car.Tag ? `🏷️ ${car.Tag}` : "";
      let spe = car.Speed;
      let acc =(Math.round(car.Acceleration * 10) / 10).toFixed(1)
      let weigh = Math.floor(car.WeightStat);
      let hand = Math.floor(car.Handling);
      let hp = ((spe / acc) + ((hand / 10) - (weigh / 100))) / 4;
      hp = Math.round(hp);
      let xessence = car.Xessence || 0
      embed.addFields({
        name: `${car.Emote} ${car.Name} ${favorite}`,
        value: `${tag}\nID: \`${car.ID}\`\n${emotes.speed} Power: ${spe}\n${emotes.acceleration} Acceleration: ${acc}s\n${emotes.weight} Weight: ${weigh}\n${emotes.handling} Handling: ${hand}\n🛣️ Miles: ${numberWithCommas(car.Miles)}\n${emotes.gas} Gas: ${car.Gas}/${car.MaxGas}\n${emotes.xessence} Xessence: ${xessence}`,
        inline: true,
      });
    }

    let row = new ActionRowBuilder().addComponents(
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
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("eggs")
        .setEmoji("🥚")
        .setLabel("Eggs")
        .setStyle("Secondary")
    );

    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cars")
        .setEmoji("🚗")
        .setLabel("Cars")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("parts")
        .setEmoji("⚙️")
        .setLabel("Parts")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("items")
        .setEmoji("🪛")
        .setLabel("Items")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("houses")
        .setEmoji("🏠")
        .setLabel("Houses")
        .setStyle("Secondary")
    );
    let row3 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("filter")
        .addOptions([
          {
            label: "Favorites",
            value: "favorites",
          },
        ])
        .setPlaceholder("Filter by"),
      
    )

    if (udata.parts.length == 0) {
      row2.components[1].setDisabled(true);
      row2.components[1].setLabel("No Parts");
    }
    if (udata.items.length == 0) {
      row2.components[2].setDisabled(true);
      row2.components[2].setLabel("No Items");
    }
    if (udata.houses.length == 0) {
      row2.components[3].setDisabled(true);
      row2.components[3].setLabel("No Houses");
    }

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row3, row2, row],
      fetchReply: true,
    });

    if(udata.tutorial && udata.tutorial.started == true && udata.tutorial.stage == 1 && udata.tutorial.type == "starter"){
      await interaction.channel.send(`**TUTORIAL:** Now that you know where to find your car's ID, lets race! Run \`/race [street race] [your car's ID]  [tier 1]\``)
      await interaction.channel.send("https://i.ibb.co/4gCYQMb/Discord-X8z2t2iuqa.gif")
      let tut = udata.tutorial
      tut.stage += 1
      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "tutorial": tut,
          },
        },

      );

     await udata.save()
    }

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector2.on("collect", async (i) => {
   
      if(i.customId == "filter"){
        let filter = i.values[0];
        let ucars = udata.cars.reverse();
        if (filter && filter == "favorites") {
          ucars = udata.cars.filter((car) => car.Favorite && car.Favorite == true);
        }
        if(!filter[0]) return;
        let cars = lodash.chunk(ucars, 6);
        let showcase = udata.showcase;
        let itempage = cars;
        let embed = new EmbedBuilder()
          .setTitle(`<a:icon_car:1203820291348766750> Displaying cars for ${user.username}`)
          .setDescription(`Garage Limit: ${ucars.length}/${garagelimit}`)
          .setColor(colors.blue)
          .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
          .setFooter({ text: `Pages 1/${itempage.length}` });
        if (showcase && showcase.Image) {
          embed.setThumbnail(`${showcase.Image}`);
        }
        else {
          let image = cars[0][0].Image || cars[0][0].Livery || cars.Cars[cars[0][0].Name.toLowerCase()].Image;
          embed.setThumbnail(`${image}`)
        }

        for (let car of cars[0]) {
          let favorite = car.Favorite ? "⭐" : "";
          let tag = car.Tag ? `🏷️ ${car.Tag}` : "";
          let spe = car.Speed;
          let acc =(Math.round(car.Acceleration * 10) / 10).toFixed(1)
          let weigh = Math.floor(car.WeightStat);
          let hand = Math.floor(car.Handling);
          let hp = ((spe / acc) + ((hand / 10) - (weigh / 100))) / 4;
          hp = Math.round(hp);

          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${tag}\nID: \`${car.ID}\`\n${emotes.speed} Power: ${spe}\n${emotes.acceleration} Acceleration: ${acc}s\n${emotes.weight} Weight: ${weigh}\n${emotes.handling} Handling: ${hand}\n🛣️ Miles: ${numberWithCommas(car.Miles)}\n${emotes.gas} Gas: ${car.Gas}/${car.MaxGas}`,
            inline:true
      })
      await interaction.editReply({
        embeds: [embed],
        components: [row, row2, row3],
        files: [],
        fetchReply: true,
      });
    }

  }
      if (i.customId == "cars") {
        itempage = cars;

        embed = new EmbedBuilder()
          .setTitle(`Displaying cars for ${user.username}`)
          .setDescription(`Garage Limit: ${ucars.length}/${garagelimit}`)
          .setColor(colors.blue)
          
      .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
          .setFooter({ text: `Pages 1/${itempage.length}` });
        for (let car of cars[0]) {
          let favorite = car.Favorite ? "⭐" : "";
          let tag = car.Tag ? `🏷️ ${car.Tag}` : "";
          let spe = car.Speed;
          let acc =(Math.round(car.Acceleration * 10) / 10).toFixed(1)
          let weigh = Math.floor(car.WeightStat);
          let hand = Math.floor(car.Handling);
          let hp = ((spe - acc) + (hand - (weigh / 100))) / 4;
          let xessence = car.Xessence || 0
          hp = Math.round(hp);
          embed.addFields({
            name: `${car.Emote} ${car.Name} ${favorite}`,
            value: `${tag}\nID: \`${car.ID}\`\n${emotes.speed} Power: ${spe}\n${emotes.acceleration} Acceleration: ${acc}s\n${emotes.weight} Weight: ${weigh}\n${emotes.handling} Handling: ${hand}\n🛣️ Miles: ${numberWithCommas(car.Miles)}\n${emotes.gas} Gas: ${car.Gas}/${car.MaxGas}\n${emotes.xessence} Xessence: ${xessence}`,
            inline: true,
          });
          
        }
        if (showcase && showcase.Image) {
          embed.setThumbnail(`${showcase.Image}`);
        }

        await interaction.editReply({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });



      } else if (i.customId.includes("parts")) {
        if (!displayparts2[0]) return await interaction.editReply("You don't have any parts!");
        itempage = displayparts2;
        console.log(itempage)
        embed = new EmbedBuilder()
          .setTitle(`Displaying parts for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages 1/${itempage.length}` })
          .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
          // .addFields({
          //   name: "WHAT IS THIS",
          //   value: `||I am the turbo egg <:egg_turbo:1219112549187059804> \`CODE: TURBOOO\`||`
          // })
          for (let part of displayparts2[0]) {
            console.log(displayparts2[0])
            
              console.log(part)
              let amount = getOccurrence(parts, part)
            let stats = []
            let partindb = partdb.Parts[part.toLowerCase()]
            if (partindb.Power > 0) {
              stats.push(`${emotes.speed} Power: +${partindb.Power}`);
            }
      
            if (partindb.Weight > 0) {
              stats.push(`${emotes.weight} Weight: +${partindb.Weight}`);
            }
            if (partindb.RemoveWeight > 0) {
              stats.push(`${emotes.weight} Weight: -${partindb.RemoveWeight}`);
            }
            if (partindb.Gas > 0) {
              stats.push(`⛽ Max Gas: ${partindb.Gas}`);
            }
            if (partindb.Handling > 0) {
              stats.push(
                `<:handling:983963211403505724> Handling: +${partindb.Handling}`
              );
            }
      
            if (partindb.Acceleration > 0) {
              stats.push(
                `${emotes.acceleration} Acceleration: -${partindb.Acceleration}`
              );
            }
            if (partindb.RemoveAcceleration > 0) {
              stats.push(
                `${emotes.acceleration} Acceleration: +${partindb.RemoveAcceleration}`
              );
            }
            if (partindb.RemovePower > 0) {
              stats.push(
                `${emotes.speed} Power: -${partindb.RemovePower}`
              );
            }
            if (partindb.DecreaseHandling > 0) {
              stats.push(
                `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
              );
            }
            embed.addFields({
              name: `${partdb.Parts[part.toLowerCase()].Emote} ${partdb.Parts[part.toLowerCase()].Name}`,
              value: `🔢 Amount: ${amount}\n${stats.join("\n")}`,
              inline: true,
            });
            
          }

        await interaction.editReply({
          embeds: [embed],
          files: [],
          components: [row, row2],
          fetchReply: true,
        });

        if(udata.tutorial && udata.tutorial.started == true && udata.tutorial.stage == 6 && udata.tutorial.type == "starter"){
          let tut = udata.tutorial
          tut.stage += 1
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "tutorial": tut,
              },
            },
      
          );
      
          interaction.channel.send(`**TUTORIAL:** Now that we know where to find our upgrades, lets put it on our car. Run \`/upgrade [car id] t1exhaust\` to upgrade your car`)
        }
      } else if (i.customId.includes("houses")) {
        itempage = displayhouses2;
        embed = new EmbedBuilder()
          .setTitle(`Displaying houses for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages 1/${itempage.length}` })
          .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
        embed.setDescription(`${displayhouses2[0].join("\n")}`);
        await interaction.editReply({
          embeds: [embed],
          components: [row, row2],
          files: [],
          fetchReply: true,
        });
      }
      else if (i.customId.includes("eggs")) {
        let eggs = udata.eggs;
        if (!eggs[0]) return interaction.channel.send("You don't have any eggs!");
        let displayeggs = []
        for(let egg of eggs){
          console.log(egg)
          let eggindb = eggsdb[egg.toLowerCase()]
          displayeggs.push(`${eggindb.Emote}`)
        }
        embed = new EmbedBuilder()
          .setTitle(`Displaying eggs for ${user.username}`)
          .setColor(colors.blue)
          .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")
        embed.setDescription(`${displayeggs.join(" ")}`);
        await interaction.editReply({
          embeds: [embed],
          components: [row, row2],
          files: [],
          fetchReply: true,
        });
      }
      
      else if (i.customId.includes("items")) {
        if (!displayitems2[0]) return interaction.channel.send("You don't have any items!");
        itempage = displayitems2;
        embed = new EmbedBuilder()
          .setTitle(`Displaying items for ${user.username}`)
          .setColor(colors.blue)
          .setFooter({ text: `Pages 1/${displayitems2.length}` })
      .setThumbnail("https://i.ibb.co/w66Pwgz/icons8-garage-240.png")

        embed.setDescription(`${displayitems2[0].join("\n")}`);

        await interaction.editReply({
          embeds: [embed],
          components: [row, row2],
          files: [],
          fetchReply: true,
        });
      } else {
        let current = page;
        if (i.customId.includes("previous") && page !== 1) {
          embed.data.fields = null;

          page--;
        } else if (i.customId.includes("next") && page !== itempage.length) {
          embed.data.fields = null;

          page++;
        } else if (i.customId.includes("first")) {
          embed.data.fields = null;

          page = 1;
        } else if (i.customId.includes("last")) {
          embed.data.fields = null;

          page = itempage.length;
        }
        for (let e in itempage[page - 1]) {
          let car = itempage[page - 1][e];
          if (itempage == cars) {
            let favorite = car.Favorite ? "⭐" : "";
            let tag = car.Tag ? `🏷️ ${car.Tag}` : "";
            let spe = car.Speed;
            let acc =(Math.round(car.Acceleration * 10) / 10).toFixed(1)
            let weigh = Math.floor(car.WeightStat);
            let hand = Math.floor(car.Handling);
            let hp = ((spe - acc) + (hand - (weigh / 100))) / 4;
            hp = Math.round(hp);
            let xessence = car.Xessence || 0
            embed.addFields({
              name: `${car.Emote} ${car.Name} ${favorite}`,
              value: `${tag}\nID: \`${car.ID}\`\n${emotes.speed} Power: ${spe}\n${emotes.acceleration} Acceleration: ${acc}s\n${emotes.weight} Weight: ${weigh}\n${emotes.handling} Handling: ${hand}\n🛣️ Miles: ${numberWithCommas(car.Miles)}\n${emotes.gas} Gas: ${car.Gas}/${car.MaxGas}\n${emotes.xessence} Xessence: ${xessence}`,
              inline: true,
            });   
            if (showcase && showcase.Image) {
                embed.setThumbnail(`${showcase.Image}`);
            }
          
          } else if (itempage == displayparts2) {
            embed.data.fields = null;
            for (let part of displayparts2[page - 1]) {
              console.log(displayparts2[page - 1])
              
                console.log(part)
                let amount = getOccurrence(parts, part)
              console.log(amount)
              let stats = []
              let partindb = partdb.Parts[part.toLowerCase()]
              if (partindb.Power > 0) {
                stats.push(`${emotes.speed} Power: +${partindb.Power}`);
              }
        
              if (partindb.Weight > 0) {
                stats.push(`${emotes.weight} Weight: +${partindb.Weight}`);
              }
              if (partindb.RemoveWeight > 0) {
                stats.push(`${emotes.weight} Weight: -${partindb.RemoveWeight}`);
              }
              if (partindb.Gas > 0) {
                stats.push(`⛽ Max Gas: ${partindb.Gas}`);
              }
              if (partindb.Handling > 0) {
                stats.push(
                  `<:handling:983963211403505724> Handling: +${partindb.Handling}`
                );
              }
        
              if (partindb.Acceleration > 0) {
                stats.push(
                  `${emotes.acceleration} Acceleration: -${partindb.Acceleration}`
                );
              }
              if (partindb.RemoveAcceleration > 0) {
                stats.push(
                  `${emotes.acceleration} Acceleration: +${partindb.RemoveAcceleration}`
                );
              }
              if (partindb.RemovePower > 0) {
                stats.push(
                  `${emotes.speed} Power: -${partindb.RemovePower}`
                );
              }
              if (partindb.DecreaseHandling > 0) {
                stats.push(
                  `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
                );
              }
              embed.addFields({
                name: `${partdb.Parts[part.toLowerCase()].Emote} ${partdb.Parts[part.toLowerCase()].Name}`,
                value: `🔢 Amount: ${amount}\n${stats.join("\n")}`,
                inline: true,
              });
              
            }

  
          } else if (itempage == displayitems2) {
            embed.setDescription(`${displayitems2[page - 1].join("\n")}`);
          }
        }

        if (current !== page) {
          embed.setFooter({ text: `Pages ${page}/${itempage.length}` });
          if (itempage == cars) {
            interaction.editReply({ embeds: [embed], fetchReply: true });
          } else {
            interaction.editReply({ embeds: [embed], fetchReply: true });
          }
        } else {
          return interaction.editReply({ content: "No pages left!" });
        }
      }
    });
  },
};

function getOccurrence(array, value) {
  var count = 0;
  array.forEach((v) => (v === value && count++));
  return count;
}