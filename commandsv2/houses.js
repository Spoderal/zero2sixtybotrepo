const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const housedb = require("../houses.json");
const lodash = require("lodash");
const { MessageActionRow, MessageButton } = require("discord.js");
const warehousedb = require("../warehouses.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("houses")
    .setDescription("View houses for sale"),
  async execute(interaction) {
    let houseimages = [];

    houseimages.push(housedb["speed street"].Image);
    houseimages.push(housedb["zero avenue"].Image);
    houseimages.push(housedb["bently boulevard"].Image);
    houseimages.push(housedb["driving drive"].Image);
    houseimages.push(housedb["porsche point"].Image);

    let row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Warehouses")
        .setEmoji("<:Warehouse1:985014760884019202>")
        .setCustomId("warehouse")
        .setStyle("SECONDARY")
    );
    let houseimage = lodash.sample(houseimages);

    let embed = new Discord.MessageEmbed()
      .setTitle("Houses For Sale")
      .setDescription(
        `**YOU CAN ONLY OWN 1 AT A TIME**\n\n**__Speed Street: $${numberWithCommas(
          housedb["speed street"].Price
        )}__** ${housedb["speed street"].Emote}\n__Perks__\n${housedb[
          "speed street"
        ].Rewards.join("\n")}\n
        **__Driving Drive: $${numberWithCommas(
          housedb["driving drive"].Price
        )}__** ${housedb["driving drive"].Emote}\n__Perks__\n${housedb[
          "driving drive"
        ].Rewards.join("\n")}\n
        **__Zero Avenue: $${numberWithCommas(
          housedb["zero avenue"].Price
        )}__** ${housedb["zero avenue"].Emote}\n__Perks__\n${housedb[
          "zero avenue"
        ].Rewards.join("\n")}\n
        **__Bently Boulevard: $${numberWithCommas(
          housedb["bently boulevard"].Price
        )}__** ${housedb["bently boulevard"].Emote}\n__Perks__\n${housedb[
          "bently boulevard"
        ].Rewards.join("\n")}\n
        **__Porsche Point: $${numberWithCommas(
          housedb["porsche point"].Price
        )}__** ${housedb["porsche point"].Emote}\n__Perks__\n${housedb[
          "porsche point"
        ].Rewards.join("\n")}\n
        **__Moon Base: $${numberWithCommas(housedb["moon base"].Price)}__** ${
          housedb["moon base"].Emote
        }\n__Perks__\n${housedb["moon base"].Rewards.join("\n")}\n
        **__Yacht: $${numberWithCommas(housedb["yacht"].Price)}__** ${
          housedb["yacht"].Emote
        }\n__Perks__\n${housedb["yacht"].Rewards.join("\n")}\n

        `
      )
      .setColor("#60b0f4")
      .setThumbnail(houseimage);

    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });
    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes("warehouse")) {
        embed
          .setTitle("Warehouses for sale")
          .setDescription(
            `**__${warehousedb.t1warehouse.Emote} ${
              warehousedb.t1warehouse.Name
            } : $${numberWithCommas(warehousedb.t1warehouse.Price)}__**\n${
              warehousedb.t1warehouse.Space
            } Garage Spaces\n\n**__${warehousedb.t2warehouse.Emote} ${
              warehousedb.t2warehouse.Name
            } : $${numberWithCommas(warehousedb.t2warehouse.Price)}__**\n${
              warehousedb.t2warehouse.Space
            } Garage Spaces`
          );
        i.update({ embeds: [embed] });
      }
    });
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
