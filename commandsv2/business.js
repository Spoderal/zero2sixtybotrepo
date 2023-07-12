const codes = require("../data/codes.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ActionRow,
} = require("discord.js");
const User = require("../schema/profile-schema");
const { toCurrency, randomRange } = require("../common/utils");
const cardb = require("../data/cardb.json");
const colors = require("../common/colors");
const businesses = require("../data/businesses.json");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("business")
    .setDescription("View the business menu"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    let businessarr = [];
    let ubusiness = userdata.business;
    for (let bus in businesses) {
      businessarr.push(businesses[bus]);
    }
    let businessrow;
    let embed;
    let timeout = 86400000;
    if (
      ubusiness &&
      ubusiness.CustomerD < ubusiness.Customers &&
      ubusiness.Cooldown !== null &&
      timeout - (Date.now() - ubusiness.Cooldown) > 0
    ) {
      userdata.business.CustomerD = userdata.business.Customers;
      userdata.business.Cooldown = 0;
      userdata.markModified("business");
      userdata.save();
      await interaction.reply(`Your customers have been filled!`);
    }

    if (userdata.business.Name) {
      businessrow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setLabel("Edit Details")
          .setCustomId("edit")
          .setEmoji("📝")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setLabel("Upgrade")
          .setCustomId("upgrade")
          .setEmoji("⬆️")
          .setStyle("Success"),
        new ButtonBuilder()
          .setLabel("Serve Customer")
          .setCustomId("serve")
          .setEmoji("👤")
          .setStyle("Success"),
        new ButtonBuilder()
          .setLabel("Stats")
          .setCustomId("stats")
          .setEmoji("📊")
          .setStyle("Primary"),
        new ButtonBuilder()
          .setLabel("Tips")
          .setCustomId("tips")
          .setEmoji("🫙")
          .setStyle("Primary")
      );
      let ubusiness = userdata.business;
      var today = new Date();
      var createdOn = new Date(userdata.business.Age);
      var msInDay = 24 * 60 * 60 * 1000;

      createdOn.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      let repemote = `🤔`;

      if (ubusiness.Reputation <= 10) {
        repemote = `🤔`;
      }
      if (ubusiness.Reputation >= 11) {
        repemote = `🤨`;
      }
      if (ubusiness.Reputation >= 15) {
        repemote = `☹️`;
      }
      if (ubusiness.Reputation >= 20) {
        repemote = `😐`;
      }
      if (ubusiness.Reputation >= 30) {
        repemote = `🙂`;
      }
      if (ubusiness.Reputation >= 50) {
        repemote = `😯`;
      }
      if (ubusiness.Reputation >= 75) {
        repemote = `😛`;
      }
      if (ubusiness.Reputation <= 100 && ubusiness.Reputation >= 95) {
        repemote = `😛`;
      }

      var diff = (+today - +createdOn) / msInDay;
      console.log(diff);
      embed = new EmbedBuilder()
        .setTitle("Business Menu")
        .addFields(
          {
            name: `${ubusiness.Business} Name`,
            value: `${ubusiness.Name}`,
          },
          {
            name: `Income`,
            value: `${emotes.cash} ${toCurrency(ubusiness.Income)}`,
          },
          {
            name: `Customers/Day`,
            value: `👥 ${ubusiness.Customers}`,
          },
          {
            name: `Reputation`,
            value: `${repemote} ${ubusiness.Reputation}`,
          },
          {
            name: `Tips To Collect`,
            value: `🫙 ${ubusiness.Tips}`,
          },
          {
            name: `Level`,
            value: `🔸${ubusiness.Level}`,
          },
          {
            name: `Age`,
            value: `⌚ ${diff} days`,
          }
        )
        .setColor(colors.blue)
        .setThumbnail(`${ubusiness.Logo}`);
    } else {
      embed = new EmbedBuilder()
        .setTitle("Business Menu")
        .setDescription(`You don't have a business!`)
        .setColor(colors.blue);

      businessrow = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setLabel("Create Business")
          .setCustomId("create")
          .setEmoji("➕")
          .setStyle("Success")
      );
    }

    let msg = await interaction.reply({
      embeds: [embed],
      components: [businessrow],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 30000,
    });

    let businessbuttons = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("carwash")
        .setLabel("Car Wash")
        .setStyle("Secondary")
        .setEmoji("<:business_carwash:1121336056965500989>"),
      new ButtonBuilder()
        .setCustomId("gasstation")
        .setLabel("Gas Station")
        .setStyle("Secondary")
        .setEmoji("<:business_gasstation:1121336059373031546>"),
      new ButtonBuilder()
        .setCustomId("carmechanic")
        .setLabel("Car Mechanic")
        .setStyle("Secondary")
        .setEmoji("<:business_mechanic:1121336060564230264>")
    );

    collector.on("collect", async (i) => {
      if (i.customId == "create") {
        embed.setTitle(`Select a business to create`);

        await i.update({ embeds: [embed], components: [businessbuttons] });
      } else if (i.customId == "upgrade") {
        console.log(userdata.business.Business);
        let business = businessarr.filter(
          (business) => business.Name == userdata.business.Business
        );
        let upgrades = business[0].Upgrades;
        let upgraded = [];
        let upgraderow = new ActionRowBuilder();
        console.log(upgrades);
        for (let u in upgrades) {
          let upg = upgrades[u];
          let upgradefilt = userdata.business.Upgrades.filter(
            (u) => u.ID == upg.ID
          );
          console.log(upg.Level);
          console.log(userdata.business.Level);
          if (userdata.business.Level >= upg.Level) {
            if (userdata.business.Upgrades && !upgradefilt[0]) {
              upgraded.push(
                `${upg.Emote} **${upg.Name}** ${upg.Description} : ${toCurrency(
                  upg.Cost
                )}`
              );
              upgraderow.addComponents(
                new ButtonBuilder()
                  .setCustomId(`${upg.ID}`)
                  .setEmoji(`${upg.Emote}`)
                  .setLabel(`${upg.Name}`)
                  .setStyle("Secondary")
              );
            }
          }
        }
        let embed1 = new EmbedBuilder();
        let em = { embeds: [embed1], components: [businessrow, upgraderow] };
        if (upgraded.length == 0) {
          em = { embeds: [embed1], components: [businessrow] };
          upgraded = ["No upgrades to display, try leveling up your business!"];
        }
        console.log(upgraded);

        embed1
          .setTitle("Business Upgrades")
          .setDescription(`${upgraded.join("\n\n")}`)
          .setColor(colors.blue);

        filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };

        const collector2 = msg.createMessageComponentCollector({
          filter: filter,
          time: 30000,
        });

        await i.update(em);

        collector2.on("collect", async (i) => {
          let upgrade = upgrades.filter((upgrade) => upgrade.ID == i.customId);
          let upgradearr = userdata.business.Upgrades || [];
          console.log(upgrade);

          if (upgrade[0].Cost > userdata.cash) {
            return i.update(`You don't have enough cash!`);
          }

          if (upgrade[0].Customers) {
            userdata.business.Customers += upgrade[0].Customers;
          }

          if (upgrade[0].Income) {
            userdata.business.Income += upgrade[0].Income;
          }

          userdata.cash -= upgrade[0].Cost;

          upgradearr.push(upgrade[0]);

          userdata.business.Upgrades = upgradearr;
          userdata.markModified("business");
          userdata.save();
          collector2.stop();
          await i.update({ embeds: [embed1], components: [businessrow] });
        });
      } else if (i.customId == "edit") {
        let editrow = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("name")
            .setLabel("Edit Name")
            .setStyle("Secondary")
        );
        i.update({ components: [editrow] });
      } else if (i.customId == "name") {
        i.update({
          content: `Send the name you want to set`,
          fetchReply: true,
        });

        let filter = (msg) => {
          return interaction.user.id === msg.author.id;
        };
        let collector3 = interaction.channel.createMessageCollector({
          filter: filter,
        });

        collector3.on("collect", (msg) => {
          console.log(msg);
          userdata.business.Name = msg.content;

          userdata.markModified("business");
          userdata.save();
          collector3.stop();
        });
      } else if (i.customId == "serve") {
        if (userdata.business.CustomerD > 0) {
          let tipchance = randomRange(1, 100);
          let tip = randomRange(1, 100);
          let income = userdata.business.Income;
          if (tipchance <= 10) {
            userdata.business.Tips += tip;
            userdata.business.TipsCollected += tip;
            interaction.channel.send(`You earned a tip of $${tip}!`);
          }

          userdata.cash += income;
          userdata.business.Earned += income;
          userdata.business.Served += 1;
          userdata.business.CustomerD -= 1;
          if (userdata.business.CustomerD == 0) {
            userdata.business.Cooldown = Date.now();
          }
          if (userdata.business.Reputation < 100) {
            userdata.business.Reputation += 1;
          }
          userdata.markModified("business");
          userdata.save();
          i.update({ content: `✅`, fetchReply: true });
        } else {
          i.update(`You're out of customers!`);
        }
      } else if (i.customId == "stats") {
        embed = new EmbedBuilder();
        embed
          .setTitle(`Business Stats`)
          .setDescription(
            `
            👤 Customers Served: ${userdata.business.Served}\n
            🫙 Tips Earned: ${userdata.business.TipsCollected}\n
            ${emotes.cash} Cash Earned: ${userdata.business.Earned}\n
            `
          )
          .setColor(`${colors.blue}`)
          .setThumbnail(`${ubusiness.Logo}`);

        await i.update({ embeds: [embed], fetchReply: true });
      } else if (i.customId == "tips") {
        if (userdata.business.Tips) {
          userdata.cash += userdata.business.Tips;
          userdata.business.Tips = 0;

          userdata.markModified("business");
          userdata.save();
        }

        await i.update({ content: `✅`, fetchReply: true });
      } else if (businesses[i.customId]) {
        embed.setTitle(
          `Created your business! View it by sending the command again.`
        );
        let businesscreated = businesses[i.customId];
        let nowdate = new Date();
        userdata.business = {
          Name: `${interaction.user.username}s ${businesscreated.Name}`,
          Income: businesscreated.Income,
          Reputation: 0,
          Customers: 5,
          Logo: businesscreated.Logo,
          Age: nowdate,
          Business: businesscreated.Name,
          Level: 1,
          TipChance: 10,
          Cooldown: 0,
          Tips: 0,
          CustomerD: 5,
          Served: 0,
          Earned: 0,
          Upgrades: [],
          TipsCollected: 0,
        };
        userdata.save();

        await i.update({ embeds: [embed], components: [] });
      }
    });
  },
};
