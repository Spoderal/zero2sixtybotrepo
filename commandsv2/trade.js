const Discord = require("discord.js");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trade")
    .setDescription("Trade your cars with other users")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to trade with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to trade")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item2")
        .setDescription("The item you want to receive")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount1")
        .setDescription("The item amount you want to trade")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("amount2")
        .setDescription("The item amount you want to receive")
        .setRequired(false)
    ),
  async execute(interaction) {
    let user1 = interaction.user;
    let user2 = interaction.options.getUser("user");

    let userdata = await User.findOne({ id: user1.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let userdata2 = await User.findOne({ id: user2.id });

    let trading = interaction.options.getString("item").toLowerCase();
    let trading2 = interaction.options.getString("item2").toLowerCase();
    let amount = interaction.options.getNumber("amount1") || 1;
    let amount2 = interaction.options.getNumber("amount2") || 1;
    let userparts = userdata.parts;
    let user2parts = userdata2.parts;
    let user1items = userdata.items;
    let user2items = userdata2.items;

    let pre = userdata.prestige;
    let pre2 = userdata2.prestige;

    if (pre < 1)
      return await interaction.reply(
        `${user1}, you need to be prestige 1 before you can trade`
      );

    if (pre2 < 1)
      return await interaction.reply(
        `${user2}, you need to be prestige 1 before you can trade`
      );

    if (user1 == user2)
      return await interaction.reply(`You cant trade yourself!`);

    if (trading.endsWith("cash") && trading2.endsWith("cash"))
      return interaction.reply("You can't trade cash for cash!");
    if (amount.includes("-"))
      return interaction.reply("You can't trade negative cash!");
    if (amount2.includes("-"))
      return interaction.reply("You can't trade negative cash!");
    let item;
    let item2;
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("accept")
        .setLabel(`Accept Trade`)
        .setEmoji(`✔️`)
        .setStyle(`Success`),
      new Discord.ButtonBuilder()
        .setCustomId("decline")
        .setLabel(`Decline Trade`)
        .setEmoji(`✖️`)
        .setStyle(`Danger`)
    );

    if (trading.endsWith("cash")) {
      let cashamount = Number(trading.split(" ")[0]);
      let newamount = Math.round((cashamount -= cashamount * 0.01));
      console.log(newamount);
      item = `${toCurrency(newamount)}`;
      if (cashamount > userdata.cash)
        return interaction.reply("You don't have enough cash!");
      userdata2.cash += newamount;
      userdata.cash -= cashamount;
    }
    if (partdb.Parts[trading]) {
      item = `${partdb.Parts[trading].Emote} ${partdb.Parts[trading].Name} x${amount}`;
      if (!userdata.parts.includes(trading))
        return interaction.reply("You don't have this part!");
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === trading.toLowerCase();
      });
      if (amount > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that part!"
        );
      for (var p = 0; p < amount; p++) user2parts.push(trading);
      for (var i4 = 0; i4 < amount; i4++)
        userparts.splice(userparts.indexOf(trading.toLowerCase()), 1);
      userdata.parts = userparts;
      userdata2.parts = user2parts;
    }
    if (cardb.Cars[trading]) {
      item = `${cardb.Cars[trading].Emote} ${cardb.Cars[trading].Name}`;
      let carindb = userdata.cars.filter(
        (car) => car.Name == trading || car.ID == trading
      );
      let carobj = carindb[0];
      if (!carobj) return interaction.reply("You don't have this car!");
      userdata2.cars.push(carobj);
      userdata.cars.pull(carobj);
    }
    if (itemdb[trading]) {
      item = `${itemdb[trading].Emote} ${itemdb[trading].Name} x${amount}`;
      if (!userdata.items.includes(trading))
        return interaction.reply("You don't have this item!");
      let filtereduser = user1items.filter(function hasmany(part) {
        return part === trading.toLowerCase();
      });
      if (amount > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that item!"
        );
      for (var p2 = 0; p2 < amount; p2++) user2items.push(trading);
      for (var it = 0; it < amount; it++)
        user1items.splice(user1items.indexOf(trading.toLowerCase()), 1);
      userdata.items = user1items;
      userdata2.items = user2items;
    }

    if (trading2.endsWith("cash")) {
      let cashamount = Number(trading2.split(" ")[0]);
      let newamount = Math.round((cashamount -= cashamount * 0.01));
      item2 = `${toCurrency(newamount)}`;
      if (cashamount > userdata2.cash)
        return interaction.reply("You don't have enough cash!");
      userdata.cash += newamount;
      userdata2.cash -= cashamount;
    }
    if (partdb.Parts[trading2]) {
      if (!userdata2.parts.includes(trading2))
        return interaction.reply("You don't have this part!");
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      if (amount2 > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that part!"
        );
      item2 = `${partdb.Parts[trading2].Emote} ${partdb.Parts[trading2].Name} x${amount2}`;
      for (var p3 = 0; p3 < amount2; p3++) userparts.push(trading2);
      for (var it3 = 0; it3 < amount2; it3++)
        user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
      userdata.parts = userparts;
      userdata2.parts = user2parts;
    }
    if (cardb.Cars[trading2]) {
      item2 = `${cardb.Cars[trading2].Emote} ${cardb.Cars[trading2].Name}`;
      console.log("car");
      let carindb = userdata2.cars.filter(
        (car) => car.Name.toLowerCase() == trading2 || car.ID == trading2
      );
      let carobj = carindb[0];
      if (!carobj) return interaction.reply("You don't have this car!");
      userdata2.cars.pull(carobj);
      userdata.cars.push(carobj);
    }
    if (itemdb[trading2]) {
      let filtereduser = user2items.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      if (amount > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that item!"
        );
      item2 = `${itemdb[trading2].Emote} ${itemdb[trading2].Name} x${amount2}`;
      if (!userdata2.items.includes(trading2))
        return interaction.reply("You don't have this item!");
      for (var p1 = 0; p1 < amount2; p1++) user1items.push(trading2);
      for (var it2 = 0; it2 < amount2; it2++)
        user2items.splice(user2items.indexOf(trading2.toLowerCase()), 1);
      userdata.items = user1items;
      userdata2.items = user2items;
    }
    let embed = new Discord.EmbedBuilder()
      .setTitle("Trade Request")
      .addFields(
        {
          name: `${user1.username}'s Item`,
          value: `${item}`,
        },
        {
          name: `${user2.username}'s Item`,
          value: `${item2}`,
        }
      )
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/tqytBYD/tradeimg.png")
      .setDescription("Trade tax: 1%");
    let msg = await interaction.reply({
      content: `<@${user2.id}> Trade Request`,
      embeds: [embed],
      components: [row],
    });
    let filter = (btnInt) => {
      return user2.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });

    if (
      trading == "undefined" ||
      trading == undefined ||
      trading2 == "undefined" ||
      trading2 == undefined
    )
      return interaction.channel.send("You cant trade undefined!");

    collector.on("collect", async (i) => {
      if (i.customId.includes(`accept`)) {
        userdata.save();
        userdata2.save();
        embed.setTitle("Trade accepted! ✅");
        await i.update({ embeds: [embed] });
        return;
      } else {
        embed.setTitle("Trade declined! ❌");
        await i.update({ embeds: [embed] });
        return;
      }
    });
  },
};
