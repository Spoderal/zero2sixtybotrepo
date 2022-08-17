const Discord = require("discord.js");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trade")
    .setDescription("Trade your cars with other users")
    .addUserOption((option) =>
      option
        .setName("target")
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
    let user2 = interaction.options.getUser("target");

    let userdata = await User.findOne({ id: user1.id });
    let userdata2 = await User.findOne({ id: user2.id });

    let trading = interaction.options.getString("item").toLowerCase();

    let trading2 = interaction.options.getString("item2").toLowerCase();
    let amount2 = interaction.options.getNumber("amount2");

    let pre = userdata.prestige;
    let pre2 = userdata2.prestige;

    if (pre < 1)
      return interaction.reply(
        `${user1}, you need to be prestige 1 before you can trade`
      );

    if (pre2 < 1)
      return interaction.reply(
        `${user2}, you need to be prestige 1 before you can trade`
      );

    console.log(trading);

    if (user1 == user2) return interaction.reply(`You cant trade yourself!`);

    if (trading.endsWith("cash") && trading2.endsWith("cash"))
      return interaction.reply("❌ You cant trade cash for cash!");
    if (trading.endsWith("cash") && partdb.Parts[trading2.toLowerCase()]) {
      let user2parts = userdata2.parts;
      let amount2 = interaction.options.getNumber("amount2");
      let actamount;
      if (amount2 > 1) {
        actamount = amount2;
      } else {
        actamount = 1;
      }

      console.log(actamount);

      if (!user2parts.includes(trading2.toLowerCase()))
        return interaction.reply(`This user doesn't have this part!`);
      let filtereduser = user2parts.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      console.log(filtereduser);
      if (actamount > filtereduser.length)
        return interaction.reply(
          `${user2} doesn't have that many of that part!`
        );

      let amount = trading.split(" ")[0];
      let bal = userdata.cash;
      if (bal < amount)
        return interaction.reply("Settle down you don't have enough cash!");
      if (amount < 1500)
        return interaction.reply(`Minimum of $1.5k cash needed.`);

      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          { name: `Your Offer`, value: `${toCurrency(amount)}` },
          {
            name: `${user2.username}'s Item`,
            value: `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`,
          },
        ])
        .setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          for (let i = 0; i < actamount; i++) {
            user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
          }

          userdata2.parts = user2parts;

          let user1newpart = [];
          for (let i = 0; i < actamount; i++) {
            user1newpart.push(trading2.toLowerCase());
          }

          for (let i in user1newpart) {
            userdata.parts.push(user1newpart[i]);
          }
          console.log(amount);

          userdata.cash -= Number(amount);
          userdata2.cash += Number(amount);

          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();

          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined!");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (
      (trading.endsWith("cash") &&
        itemdb.Collectable[trading2.toLowerCase()]) ||
      (trading.endsWith("cash") && itemdb.Police[trading2.toLowerCase()]) ||
      (trading.endsWith("cash") && itemdb.Other[trading2.toLowerCase()])
    ) {
      let user2parts = userdata2.items;

      let amount2 = interaction.options.getNumber("amount2");
      let actamount;
      if (amount2 > 1) {
        actamount = amount2;
      } else {
        actamount = 1;
      }

      console.log(actamount);

      if (!user2parts.includes(trading2.toLowerCase()))
        return interaction.reply(`This user doesn't have this item!`);
      let filtereduser = user2parts.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      console.log(filtereduser);
      if (actamount > filtereduser.length)
        return interaction.reply(
          `${user2} doesn't have that many of that item!`
        );
      let amount = trading.split(" ")[0];
      let bal = userdata.cash;
      if (bal < amount)
        return interaction.reply("Settle down you don't have enough cash!");
      if (amount < 1500)
        return interaction.reply(`Minimum of $1.5k cash needed.`);
      let itemtype;

      if (itemdb.Collectable[trading2.toLowerCase()]) {
        itemtype = "Collectable";
      } else if (itemdb.Police[trading2.toLowerCase()]) {
        itemtype = "Police";
      } else if (itemdb.Other[trading2.toLowerCase()]) {
        itemtype = "Other";
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([{ name: `Your Offer`, value: `${toCurrency(amount)}` }]);
      if (itemtype == "Collectable") {
        embed.addFields([
          {
            name: `${user2.username}'s Offer`,
            value: `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${
              itemdb[itemtype][0][trading2.toLowerCase()].Name
            } x${actamount}`,
          },
        ]);
      } else {
        embed.addFields([
          {
            name: `${user2.username}'s Offer`,
            value: `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${
              itemdb[itemtype][trading2.toLowerCase()].Name
            } x${actamount}`,
          },
        ]);
      }
      embed.setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          collector.stop();
          amount = trading.split(" ")[0];
          console.log(amount);
          for (let i = 0; i < actamount; i++)
            user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
          userdata2.items = user2parts;

          let user1newpart = [];
          for (let i = 0; i < actamount; i++)
            user1newpart.push(trading2.toLowerCase());
          for (let i in user1newpart) {
            userdata.items.push(user1newpart[i]);
          }
          console.log(amount);
          userdata.cash -= Number(amount);
          userdata2.cash += Number(amount);

          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined!");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (
      cardb.Cars[trading.toLowerCase()] &&
      partdb.Parts[trading2.toLowerCase()]
    ) {
      let user2parts = userdata2.parts;
      let amount2 = interaction.options.getNumber("amount2");
      let actamount;
      if (amount2 > 1) {
        actamount = amount2;
      } else {
        actamount = 1;
      }

      let filtereduser = user2parts.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });
      if (actamount > filtereduser.length)
        return interaction.reply(
          `${user2} doesn't have ${actamount} ${trading2}!`
        );

      let filteredcar = userdata.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selected = filteredcar[0] || "No ID";

      if (selected == "No ID") {
        return interaction.reply(`You don't have this car!`);
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          {
            name: `Your Offer`,
            value: `${cardb.Cars[selected.Name.toLowerCase()].Name}`,
          },
          {
            name: `${user2.username}'s Offer`,
            value: `${partdb.Parts[trading2.toLowerCase()].Name} x${actamount}`,
          },
        ])
        .setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          trading = trading.toLowerCase();

          userdata.cars.pull(selected);
          userdata2.cars.push(selected);

          for (let i = 0; i < actamount; i++)
            user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
          userdata.parts = user2parts;
          let user1newpart = [];
          for (let i = 0; i < actamount; i++)
            user1newpart.push(trading2.toLowerCase());
          for (let i in user1newpart) {
            userdata.parts.push(user1newpart[i]);
          }
          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined!");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    }

    // car for item
    else if (
      (cardb.Cars[trading.toLowerCase()] &&
        itemdb.Collectable[trading2.toLowerCase()]) ||
      (cardb.Cars[trading.toLowerCase()] &&
        itemdb.Other[trading2.toLowerCase()]) ||
      (cardb.Cars[trading.toLowerCase()] &&
        itemdb.Police[trading2.toLowerCase()])
    ) {
      let user1cars = userdata.cars;
      let user2items = userdata2.items;
      let amount2 = interaction.options.getNumber("amount2");
      let actamount;
      if (amount2 > 1) {
        actamount = amount2;
      } else {
        actamount = 1;
      }
      let filtereduser = user2items.filter(function hasmany(part) {
        return part === trading2.toLowerCase();
      });

      if (actamount > filtereduser.length)
        return interaction.reply(
          `${user2} doesn't have ${amount2} ${trading2}!`
        );
      if (!user1cars.includes(trading.toLowerCase()))
        return interaction.channel.send(`You don't have this car!`);
      let itemtype;

      if (itemdb.Collectable[trading2.toLowerCase()]) {
        itemtype = "Collectable";
      } else if (itemdb.Police[trading2.toLowerCase()]) {
        itemtype = "Police";
      } else if (itemdb.Other[trading2.toLowerCase()]) {
        itemtype = "Other";
      }
      let filteredcar = userdata.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selected = filteredcar[0] || "No ID";

      if (selected == "No ID") {
        return interaction.reply(`You don't have this car!`);
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          {
            name: `Your Offer`,
            value: `${cardb.Cars[trading.toLowerCase()].Name}`,
          },
        ]);
      if (itemtype == "Collectable") {
        embed.addFields([
          {
            name: `${user2.username}'s Offer`,
            value: `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${
              itemdb[itemtype][0][trading2.toLowerCase()].Name
            } x${actamount}`,
          },
        ]);
      } else {
        embed.addFields([
          {
            name: `${user2.username}'s Offer`,
            value: `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${
              itemdb[itemtype][trading2.toLowerCase()].Name
            } x${actamount}`,
          },
        ]);
      }
      embed.setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          trading = trading.toLowerCase();

          userdata.cars.pull(selected);

          userdata2.cars.push(selected);

          for (let i = 0; i < actamount; i++)
            user2items.splice(user2items.indexOf(trading2.toLowerCase()), 1);
          userdata2.items = user2items;

          let user1newpart = [];
          for (let i = 0; i < actamount; i++)
            user1newpart.push(trading2.toLowerCase());
          for (let i in user1newpart) {
            userdata.items.push(user1newpart[i]);
          }
          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined!");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (trading.endsWith("cash") && cardb.Cars[trading2.toLowerCase()]) {
      let carname = cardb.Cars[trading2.toLowerCase()].Name;
      let filteredcar = userdata.cars.filter((car) => car.Name == carname);
      let selected = filteredcar[0] || "No ID";
      let filteredcar2 = userdata2.cars.filter((car) => car.Name == carname);
      let selected2 = filteredcar2[0] || "No ID";

      if (selected2 == "No ID")
        return interaction.reply(`${user2} doesn't have that car!`);
      if (selected !== "No ID")
        return interaction.reply(`${user1}, you already have that car!`);

      let amount = trading.split(" ")[0];
      let bal = userdata.cash;
      if (bal < amount)
        return interaction.reply("Settle down you don't have enough cash!");
      if (amount < 1500)
        return interaction.reply(`Minimum of $1.5k cash needed.`);
      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          { name: `Your Offer`, value: `$${amount}` },
          {
            name: `${user2.username}'s Item`,
            value: `${cardb.Cars[trading2].Name}`,
          },
        ])
        .setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          userdata.cash -= Number(amount);
          userdata2.cash += Number(amount);

          userdata2.cars.pull(selected2);
          userdata.cars.push(selected2);

          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (trading2.endsWith("cash") && cardb.Cars[trading.toLowerCase()]) {
      let filteredcar = userdata.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selected = filteredcar[0] || "No ID";
      let filteredcar2 = userdata2.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selected2 = filteredcar2[0] || "No ID";

      if (selected == "No ID")
        return interaction.reply(`${user1} doesn't have that car!`);
      if (selected2 !== "No ID")
        return interaction.reply(`${user2}, you already have that car!`);

      let amount = trading.split(" ")[0];
      let bal = userdata2.cash;
      if (bal < amount)
        return interaction.reply("Settle down they don't have enough cash!");
      if (amount < 1500)
        return interaction.reply(`Minimum of $1.5k cash needed.`);
      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          { name: `Your Offer`, value: `${cardb.Cars[trading].Name}` },
          { name: `${user2.username}'s Item`, value: `$${amount}` },
        ])
        .setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          userdata2.cash -= Number(amount);
          userdata.cash += Number(amount);

          userdata.cars.pull(selected);
          userdata2.cars.push(selected);

          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (
      cardb.Cars[trading.toLowerCase()] &&
      cardb.Cars[trading2.toLowerCase()]
    ) {
      let filteredcar = userdata.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selected = filteredcar[0] || "No ID";
      let filteredcaru2 = userdata2.cars.filter(
        (car) => car.Name == trading.toLowerCase()
      );
      let selectedu2 = filteredcaru2[0] || "No ID";
      let filteredcar2 = userdata2.cars.filter(
        (car) => car.Name == trading2.toLowerCase()
      );
      let selected2 = filteredcar2[0] || "No ID";
      let filteredcaru1 = userdata.cars.filter(
        (car) => car.Name == trading2.toLowerCase()
      );
      let selectedu1 = filteredcaru1[0] || "No ID";

      if (selected == "No ID")
        return interaction.reply(`${user1} doesn't have that car!`);
      if (selected2 == "No ID")
        return interaction.reply(`${user2} doesn't have that car!`);
      if (selectedu2 !== "No ID")
        return interaction.reply(`${user2} already has this car!`);
      if (selectedu1 !== "No ID")
        return interaction.reply(`${user1} already has this car!`);

      let embed = new Discord.EmbedBuilder()
        .setTitle("Trading")
        .setDescription(
          `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
        )
        .addFields([
          { name: `Your Offer`, value: `${cardb.Cars[trading].Name}` },
          {
            name: `${user2.username}'s Item`,
            value: `${cardb.Cars[trading2].Name}`,
          },
        ])
        .setColor(colors.blue);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      msg.react("✅");
      msg.react("❌");

      const filter = (_, u) => u.id === user2.id;
      const collector = msg.createReactionCollector({ filter, time: 60000 });

      collector.on("collect", (r) => {
        if (r.emoji.name == "✅") {
          userdata.cars.pull(selected);
          userdata2.cars.push(selected);
          userdata2.cars.pull(selected2);
          userdata.cars.push(selected2);

          embed.setTitle("Trade Accepted!");

          userdata.save();
          userdata2.save();
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        } else if (r.emoji.name == "❌") {
          embed.setTitle("Trade Declined");
          collector.stop();

          interaction.editReply({ embeds: [embed] });
        }
      });
      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          embed.setTitle("Trade Expired");

          interaction.editReply({ embeds: [embed] });
        }
      });
    } else if (partdb.Parts[trading.toLowerCase()]) {
      let amount1 = interaction.options.getNumber("amount1");
      let user1parts = userdata.parts;

      if (!user1parts.includes(trading.toLowerCase()))
        return interaction.reply(`You don't have this part!`);
      let actamount;
      if (amount1 > 1) {
        actamount = amount1;
      } else {
        actamount = 1;
      }

      let filtereduser = user1parts.filter(function hasmany(part) {
        return part === trading.toLowerCase();
      });
      if (amount2 > filtereduser.length)
        return interaction.reply(
          `${user1} doesn't have ${actamount} ${trading}!`
        );
      if (trading2.endsWith("cash")) {
        let amount = trading2.split(" ")[0];
        let bal = userdata2.cash;

        if (amount > bal)
          return interaction.reply(`The user doesn't have this much cash!`);

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          )
          .addFields([
            {
              name: `Your Offer`,
              value: `${
                partdb.Parts[trading.toLowerCase()].Name
              } x${actamount}`,
            },
            { name: `${user2.username}'s Item`, value: `$${amount}` },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            userdata2.cash -= Number(amount);
            userdata.cash += Number(amount);
            for (let i = 0; i < actamount; i++)
              user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1);
            userdata.parts = user1parts;
            let user1newpart = [];
            for (let i = 0; i < actamount; i++)
              user1newpart.push(trading.toLowerCase());
            for (let i in user1newpart) {
              userdata2.parts.push(user1newpart[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      } else if (partdb.Parts[trading2.toLowerCase()]) {
        let user2parts = userdata2.parts;
        let amount2 = interaction.options.getNumber("amount2");
        let amount1 = interaction.options.getNumber("amount1");

        let actamount;
        if (amount2 > 1) {
          actamount = amount2;
        } else {
          actamount = 1;
        }
        let actamount1;
        if (amount1 > 1) {
          actamount1 = amount1;
        } else {
          actamount1 = 1;
        }
        let filtereduser = user2parts.filter(function hasmany(part) {
          return part === trading2.toLowerCase();
        });
        if (actamount > filtereduser.length)
          return interaction.reply(
            `${user2} doesn't have ${actamount} ${trading2}!`
          );

        let filtereduser2 = user1parts.filter(function hasmany(part) {
          return part === trading.toLowerCase();
        });
        if (amount1 > filtereduser2.length)
          return interaction.reply(
            `${user1} doesn't have ${actamount1} ${trading}!`
          );

        if (!user2parts.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this part!`);

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          )
          .addFields([
            {
              name: `Your Offer`,
              value: `${
                partdb.Parts[trading.toLowerCase()].Name
              } x${actamount1}`,
            },
            {
              name: `${user2.username}'s Item`,
              value: `${
                partdb.Parts[trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            for (let i = 0; i < actamount; i++)
              user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
            userdata2.parts = user2parts;
            for (let i = 0; i < actamount1; i++)
              user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1);
            userdata.parts = user1parts;

            let user1newpart = [];
            for (let i = 0; i < actamount; i++)
              user1newpart.push(trading2.toLowerCase());
            for (let i in user1newpart) {
              userdata.parts.push(user1newpart[i]);
            }

            let user1newpart2 = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart2.push(trading.toLowerCase());
            for (let i in user1newpart2) {
              userdata2.parts.push(user1newpart2[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      }
      // part for item
      else if (
        itemdb.Collectable[trading2.toLowerCase()] ||
        itemdb.Police[trading2.toLowerCase()] ||
        itemdb.Other[trading2.toLowerCase()]
      ) {
        let user1parts = userdata.parts;
        let useritems2 = userdata2.items;
        let amount2 = interaction.options.getNumber("amount2");
        let amount1 = interaction.options.getNumber("amount1");

        let actamount;
        if (amount2 > 1) {
          actamount = amount2;
        } else {
          actamount = 1;
        }
        let actamount1;
        if (amount1 > 1) {
          actamount1 = amount1;
        } else {
          actamount1 = 1;
        }
        if (!user1parts.includes(trading.toLowerCase()))
          return interaction.reply(`You don't have this part!`);

        if (!useritems2.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this item!`);

        let filtereduser = useritems2.filter(function hasmany(part) {
          return part === trading2.toLowerCase();
        });
        if (amount2 > filtereduser.length)
          return interaction.reply(
            `${user2} doesn't have ${actamount} ${trading2}!`
          );

        let filtereduser2 = user1parts.filter(function hasmany(part) {
          return part === trading.toLowerCase();
        });
        if (amount1 > filtereduser2.length)
          return interaction.reply(
            `${user1} doesn't have ${actamount1} ${trading}!`
          );

        let itemtype;

        if (itemdb.Collectable[trading2.toLowerCase()]) {
          itemtype = "Collectable";
        } else if (itemdb.Police[trading2.toLowerCase()]) {
          itemtype = "Police";
        } else if (itemdb.Other[trading2.toLowerCase()]) {
          itemtype = "Other";
        }

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          )
          .addFields([
            {
              name: `Your Offer`,
              value: `${
                partdb.Parts[trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        if (itemtype == "Collectable") {
          embed.addFields([
            {
              name: `${user2.username}'s Offer`,
              value: `${itemdb[itemtype][0][trading2.toLowerCase()].Emote} ${
                itemdb[itemtype][0][trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `${user2.username}'s Offer`,
              value: `${itemdb[itemtype][trading2.toLowerCase()].Emote} ${
                itemdb[itemtype][trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ]);
        }
        embed.setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            for (let i = 0; i < actamount1; i++)
              user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1);
            userdata.parts = user1parts;
            for (let i = 0; i < actamount; i++)
              useritems2.splice(useritems2.indexOf(trading2.toLowerCase()), 1);
            userdata2.items = useritems2;

            let user1newpart = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart.push(trading.toLowerCase());
            for (let i in user1newpart) {
              userdata2.parts.push(user1newpart[i]);
            }

            let user1newpart2 = [];
            for (let i = 0; i < actamount; i++)
              user1newpart2.push(trading2.toLowerCase());
            for (let i in user1newpart2) {
              userdata.items.push(user1newpart2[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      } else if (cardb.Cars[trading2.toLowerCase()]) {
        let user2cars = userdata2.cars;

        if (!user2cars.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this car!`);
        let amount1 = interaction.options.getNumber("amount1");

        let actamount1;
        if (amount1 > 1) {
          actamount1 = amount1;
        } else {
          actamount1 = 1;
        }
        let filtereduser = user1parts.filter(function hasmany(part) {
          return part === trading.toLowerCase();
        });
        if (actamount1 > filtereduser.length)
          return interaction.reply(
            `${user1} doesn't have ${actamount1} ${trading}!`
          );
        let filteredcar = userdata.cars.filter(
          (car) => car.Name == trading2.toLowerCase()
        );
        let selected = filteredcar[0] || "No ID";
        let filteredcar2 = userdata2.cars.filter(
          (car) => car.Name == trading2.toLowerCase()
        );
        let selected2 = filteredcar2[0] || "No ID";

        if (selected2 == "No ID")
          return interaction.reply(`${user2} doesn't have that car!`);
        if (selected !== "No ID")
          return interaction.reply(`${user1}, you already have that car!`);

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          )
          .addFields([
            {
              name: `Your Offer`,
              value: `${
                partdb.Parts[trading.toLowerCase()].Name
              } x${actamount1}`,
            },
            {
              name: `${user2.username}'s Item`,
              value: `${cardb.Cars[trading2.toLowerCase()].Name}`,
            },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            userdata2.cars.pull(selected);
            userdata.cars.push(selected);

            for (let i = 0; i < actamount1; i++)
              user1parts.splice(user1parts.indexOf(trading.toLowerCase()), 1);
            userdata.parts = user1parts;

            let user1newpart = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart.push(trading.toLowerCase());
            for (let i in user1newpart) {
              userdata.parts.push(user1newpart[i]);
            }
            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      }
    } else if (
      itemdb.Collectable[trading.toLowerCase()] ||
      itemdb.Police[trading.toLowerCase()] ||
      itemdb.Other[trading.toLowerCase()]
    ) {
      let useritems = userdata.items;
      let amount2 = interaction.options.getNumber("amount2");
      let amount1 = interaction.options.getNumber("amount1");

      let actamount;
      if (amount2 > 1) {
        actamount = amount2;
      } else {
        actamount = 1;
      }
      let actamount1;
      if (amount1 > 1) {
        actamount1 = amount1;
      } else {
        actamount1 = 1;
      }
      if (!useritems)
        return interaction.reply(`${user1}, you don't have any items!`);
      if (!useritems.includes(trading.toLowerCase()))
        return interaction.reply(`${user1}, you don't have this item`);
      let filtereduser = useritems.filter(function hasmany(part) {
        return part === trading.toLowerCase();
      });
      if (actamount1 > filtereduser.length)
        return interaction.reply(
          `${user1} doesn't have ${actamount1} ${trading}!`
        );

      // Item for cash
      let itemtype;

      if (itemdb.Collectable[trading.toLowerCase()]) {
        itemtype = "Collectable";
      } else if (itemdb.Police[trading.toLowerCase()]) {
        itemtype = "Police";
      } else if (itemdb.Other[trading.toLowerCase()]) {
        itemtype = "Other";
      }

      if (trading2.toLowerCase().endsWith("cash")) {
        console.log(itemtype);
        trading = trading.toLowerCase();
        let amount = trading2.split(" ")[0];
        let bal = userdata2.cash;
        if (bal < amount)
          return interaction.reply(
            `Settle down, ${user2} doesn't have enough cash!`
          );
        if (amount < 1500)
          return interaction.reply(`Minimum of $1.5k cash needed.`);
        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          );
        if (itemtype == "Collectable") {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][0][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        }

        embed
          .addFields([
            {
              name: `${user2.username}'s Item`,
              value: `${toCurrency(amount)}`,
            },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            userdata2.cash -= Number(amount);

            let user1newpart = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart.push(trading.toLowerCase());
            for (let i in user1newpart) {
              userdata2.items.push(user1newpart[i]);
            }

            userdata.cash += Number(amount);
            for (let i = 0; i < actamount1; i++)
              useritems.splice(useritems.indexOf(trading.toLowerCase()), 1);
            userdata.items = useritems;
            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired!");

            interaction.editReply({ embeds: [embed] });
          }
        });
      } else if (partdb.Parts[trading2.toLowerCase()]) {
        let user2parts = userdata2.parts;

        let filtereduser = user2parts.filter(function hasmany(part) {
          return part === trading2.toLowerCase();
        });
        if (actamount > filtereduser.length)
          return interaction.reply(
            `${user2} doesn't have ${actamount} ${trading2}!`
          );

        if (!user2parts.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this part!`);

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          );
        if (itemtype == "Collectable") {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][0][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        }
        embed
          .addFields([
            {
              name: `${user2.username}'s Item`,
              value: `${
                partdb.Parts[trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            for (let i = 0; i < actamount; i++)
              user2parts.splice(user2parts.indexOf(trading2.toLowerCase()), 1);
            userdata2.parts = user2parts;
            for (let i = 0; i < actamount1; i++)
              useritems.splice(useritems.indexOf(trading.toLowerCase()), 1);
            userdata.items = useritems;
            let user1newpart = [];
            for (let i = 0; i < actamount; i++)
              user1newpart.push(trading2.toLowerCase());
            for (let i in user1newpart) {
              userdata.parts.push(user1newpart[i]);
            }
            let user1newpart2 = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart2.push(trading.toLowerCase());
            console.log(user1newpart);
            console.log(user1newpart2);

            for (let i in user1newpart2) {
              userdata.items.push(user1newpart2[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      } else if (cardb.Cars[trading2.toLowerCase()]) {
        let user2cars = userdata.cars;

        if (!user2cars.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this car!`);

        let filteredcar = userdata.cars.filter(
          (car) => car.Name == trading2.toLowerCase()
        );
        let selected = filteredcar[0] || "No ID";
        let filteredcar2 = userdata2.cars.filter(
          (car) => car.Name == trading2.toLowerCase()
        );
        let selected2 = filteredcar2[0] || "No ID";

        if (selected !== "No ID")
          return interaction.reply(`${user2}, you already have this car!`);
        if (selected2 == "No ID")
          return interaction.reply(`${user2}, you don't have this car!`);

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          );
        if (itemtype == "Collectable") {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][0][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        }
        embed
          .addFields([
            {
              name: `${user2.username}'s Item`,
              value: `${cardb.Cars[trading2.toLowerCase()].Name}`,
            },
          ])
          .setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            userdata2.cars.pull(selected);
            userdata.cars.push(selected);
            for (let i = 0; i < actamount1; i++)
              useritems.splice(useritems.indexOf(trading.toLowerCase()), 1);
            userdata.items = useritems;
            let user1newpart = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart.push(trading.toLowerCase());
            for (let i in user1newpart) {
              userdata2.items.push(user1newpart[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      } else if (
        itemdb.Collectable[trading2.toLowerCase()] ||
        itemdb.Police[trading2.toLowerCase()] ||
        itemdb.Other[trading2.toLowerCase()]
      ) {
        let user2items = userdata2.items;

        if (!user2items.includes(trading2.toLowerCase()))
          return interaction.reply(`This user doesn't have this item!`);

        let filtereduser = user2items.filter(function hasmany(part) {
          return part === trading2.toLowerCase();
        });
        if (actamount > filtereduser.length)
          return interaction.reply(
            `${user2} doesn't have ${actamount} ${trading2}!`
          );

        let itemtype2;

        if (itemdb.Collectable[trading2.toLowerCase()]) {
          itemtype2 = "Collectable";
        } else if (itemdb.Police[trading2.toLowerCase()]) {
          itemtype2 = "Police";
        } else if (itemdb.Other[trading2.toLowerCase()]) {
          itemtype2 = "Other";
        }

        let embed = new Discord.EmbedBuilder()
          .setTitle("Trading")
          .setDescription(
            `The user has 1 minute to react to this with ✅ to accept the offer, and ❌ to decline the offer.`
          );
        if (itemtype == "Collectable") {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][0][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][0][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype][trading.toLowerCase()].Emote} ${
                itemdb[itemtype][trading.toLowerCase()].Name
              } x${actamount1}`,
            },
          ]);
        }
        if (itemtype2 == "Collectable") {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype2][0][trading2.toLowerCase()].Emote} ${
                itemdb[itemtype2][0][trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: `Your Offer`,
              value: `${itemdb[itemtype2][trading2.toLowerCase()].Emote} ${
                itemdb[itemtype2][trading2.toLowerCase()].Name
              } x${actamount}`,
            },
          ]);
        }

        embed.setColor(colors.blue);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        msg.react("✅");
        msg.react("❌");

        const filter = (_, u) => u.id === user2.id;
        const collector = msg.createReactionCollector({ filter, time: 60000 });

        collector.on("collect", (r) => {
          if (r.emoji.name == "✅") {
            for (let i = 0; i < actamount; i++)
              user2items.splice(user2items.indexOf(trading2.toLowerCase()), 1);
            userdata2.items = user2items;
            for (let i = 0; i < actamount1; i++)
              useritems.splice(useritems.indexOf(trading.toLowerCase()), 1);
            userdata.items = useritems;
            let user1newpart = [];
            for (let i = 0; i < actamount; i++)
              user1newpart.push(trading2.toLowerCase());
            for (let i in user1newpart) {
              userdata.items.push(user1newpart[i]);
            }
            let user1newpart2 = [];
            for (let i = 0; i < actamount1; i++)
              user1newpart2.push(trading.toLowerCase());
            for (let i in user1newpart2) {
              userdata2.items.push(user1newpart2[i]);
            }

            embed.setTitle("Trade Accepted!");

            userdata.save();
            userdata2.save();
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          } else if (r.emoji.name == "❌") {
            embed.setTitle("Trade Declined!");
            collector.stop();

            interaction.editReply({ embeds: [embed] });
          }
        });
        collector.on("end", async (collected) => {
          if (collected.size === 0) {
            embed.setTitle("Trade Expired");

            interaction.editReply({ embeds: [embed] });
          }
        });
      }

      // Item for Item

      //Item for car
    } else {
      interaction.reply(
        `Error! Did you make sure to specify cash, a car, or a part on the bot?`
      );
    }
  },
};
