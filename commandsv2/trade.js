const Discord = require("discord.js");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");

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

    let pre = userdata.tier;
    let pre2 = userdata2.tier;

    if (pre < 4)
      return await interaction.reply(
        `${user1}, you need to beat the 3rd squad before you can trade`
      );

    if (pre2 < 4)
      return await interaction.reply(
        `${user2}, you need to beat the 3rd squad before you can trade`
      );

    if (user1 == user2) return await interaction.reply(`You cant trade yourself!`);



    if (trading.endsWith("cash") && trading2.endsWith("cash"))
      return interaction.reply("You can't trade cash for cash!");
    if (amount < 0) return interaction.reply("You can't trade negative cash!");
    if (amount2 < 0) return interaction.reply("You can't trade negative cash!");
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
      let newamount = Math.round((cashamount -= cashamount * 0.1));

      item = `${toCurrency(newamount)}`;
      if (cashamount > userdata.cash)
        return interaction.reply("You don't have enough cash!");
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
    }
    if (cardb.Cars[trading]) {
      item = `${cardb.Cars[trading].Emote} ${cardb.Cars[trading].Name}`;
      userdata = await User.findOne({id: user1.id})
      let carindb = userdata.cars.filter(
        (car) => car.Name.toLowerCase() == trading.toLowerCase() ||  car.ID.toLowerCase() == trading.toLowerCase()
      );
      let carobj = carindb[0];
      if (!carobj) return interaction.reply("You don't have this car!");

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

    }

    if (trading2.endsWith("cash")) {
      let cashamount = Number(trading2.split(" ")[0]);
      let newamount = Math.round((cashamount -= cashamount * 0.1));
      item2 = `${toCurrency(newamount)}`;
      if (cashamount > userdata2.cash)  return interaction.reply("You don't have enough cash!");

    }
    if (partdb.Parts[trading2]) {
      if (!userdata2.parts.includes(trading2))
        return interaction.reply("The user you're trading with doesn't have this part!");
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      if (amount2 > filtereduser.length)
        return await interaction.reply(
          "The user you're trading with doesn't have that many of that part!"
        );
      item2 = `${partdb.Parts[trading2].Emote} ${partdb.Parts[trading2].Name} x${amount2}`;
      for (var p3 = 0; p3 < amount2; p3++) userparts.push(trading2);
      for (var it3 = 0; it3 < amount2; it3++)
        user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);

    }
    if (cardb.Cars[trading2]) {
      userdata2 = await User.findOne({id: user2.id})

      item2 = `${cardb.Cars[trading2].Emote} ${cardb.Cars[trading2].Name}`;

      let carindb2 = userdata2.cars.filter( (car) => car.Name.toLowerCase() == trading2.toLowerCase() || car.ID.toLowerCase() == trading2.toLowerCase() );
      let carobj2 = carindb2[0];
      if (!carobj2) return interaction.reply("You don't have this car!");

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

    }

    if (
      item == "undefined" ||
      item == undefined ||
      item2 == "undefined" ||
      item2 == undefined
    )
      return interaction.reply(
        "Make sure to specify cash, parts, or a car! If you're trading cash, make sure to put cash at the end of the number"
      );
    let cooldowns1 = await Cooldowns.findOne({ id: user1.id });
    let cooldowns2 = await Cooldowns.findOne({ id: user2.id });

    cooldowns1.trading = Date.now();
    cooldowns2.trading = Date.now();
    cooldowns1.save();
    cooldowns2.save();
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
      .setDescription("Trade tax: 10%");
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
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes(`accept`)) {
        let udata1 = await User.findOne({id: user1.id})
        let udata2 = await User.findOne({id: user2.id})

        if(cardb.Cars[trading.toLowerCase()]){
          let filtercar = udata1.cars.filter((car) => car.Name.toLowerCase() == trading.toLowerCase())
          if(!filtercar[0]) return interaction.editReply("You're missing this car!")
          let usercars = udata1.cars
          for (var b = 0; b < usercars.length; b++){
            if (usercars[b].Name === filtercar[0].Name) {
              usercars.splice(b, 1);
              break;
            }

          }
          udata2.cars.push(filtercar[0])

        }
        if(cardb.Cars[trading2.toLowerCase()]){
          let filtercar = udata2.cars.filter((car) => car.Name.toLowerCase() == trading2.toLowerCase())
          if(!filtercar[0]) return interaction.editReply("You're missing this car!")
          let usercars = udata2.cars
          for (var c = 0; c < usercars.length; c++) {
            if (usercars[c].Name === filtercar[0].Name) {
              usercars.splice(c, 1);
              break;
            }

          }
          udata1.cars.push(filtercar[0])
        }
        if (trading.endsWith("cash")) {
          let cashamount = Number(trading.split(" ")[0]);
          let newamount = Math.round((cashamount -= (cashamount * 0.1)));
          console.log(newamount);
          item = `${toCurrency(newamount)}`;
          if (cashamount > udata1.cash) return interaction.editReply("You don't have enough cash!");

          udata1.cash -= cashamount;
          udata2.cash += cashamount;
          
        }

        if (trading2.endsWith("cash")) {
          let cashamount = Number(trading2.split(" ")[0]);
          let newamount = Math.round((cashamount -= (cashamount * 0.1)));
          console.log(newamount);
          item = `${toCurrency(newamount)}`;
          if (cashamount > udata2.cash) return interaction.editReply("You don't have enough cash!");

          userdata2.cash -= cashamount;
          userdata.cash += cashamount;

        }

        if (partdb.Parts[trading]) {
          if (!udata1.parts.includes(trading)) return interaction.editReply("You don't have this part!");
          for (var p4 = 0; p4 < amount2; p4++) {
            udata2.parts.push(trading)
          }
          for (var it4 = 0; it4 < amount2; it4++) udata1.parts.splice(udata1.parts.indexOf(trading.toLowerCase()), 1);
        }
        if (partdb.Parts[trading2]) {
          if (!udata2.parts.includes(trading2)) return interaction.editReply("You don't have this part!");
          for (var p3 = 0; p3 < amount2; p3++) {
            udata1.parts.push(trading2)
          }
          for (var it3 = 0; it3 < amount2; it3++) udata2.parts.splice(udata2.parts.indexOf(trading2.toLowerCase()), 1);
        }

        if (itemdb[trading]) {
          if (!udata1.items.includes(trading)) return interaction.editReply("You don't have this item!");
          for (var p5 = 0; p5 < amount2; p5++) {
            udata2.items.push(trading)
          }
          for (var it5 = 0; it5 < amount2; it5++) udata1.items.splice(udata1.items.indexOf(trading.toLowerCase()), 1);
        }

        if (itemdb[trading2]) {
          if (!udata2.items.includes(trading2)) return interaction.editReply("You don't have this item!");
          for (var p6 = 0; p6 < amount2; p6++) {
            udata1.items.push(trading2);
          }
          for (var it6 = 0; it6 < amount2; it6++) udata2.items.splice(udata2.items.indexOf(trading2.toLowerCase()), 1);
        }


        await udata1.save();
        await udata2.save();
        embed.setTitle("Trade accepted! ✅");
        await interaction.editReply({ embeds: [embed] , components: []});
        return;
      } else {
        embed.setTitle("Trade declined! ❌");
        await interaction.editReply({ embeds: [embed], components: [] });
        return;
      }
    });

    collector.on("end", async () => {
      embed.setTitle("Trade expired!");
      return await interaction.editReply({ embeds: [embed], components: [] });
    });
  },
};
