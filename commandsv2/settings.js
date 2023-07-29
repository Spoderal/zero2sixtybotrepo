const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("View configurable settings"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let dailyenabled = userdata.settings.daily;
    let tipsenabled = userdata.settings.tips;
    let tradesenabled = userdata.settings.trades;
    let policemode = userdata.police;
    if (!userdata.settings.trades || userdata.settings.trades == null) {
      userdata.settings.trades = true;
      userdata.update();
    }
    let voteenabled = userdata.settings.vote;
    let demote = "❌";
    let vemote = "❌";
    let temote = "❌";
    let tremote = "❌";
    let memote = "🏎️";

    if (dailyenabled == true) {
      demote = "✅";
    }
    if (voteenabled == true) {
      vemote = "✅";
    }
    if (tipsenabled == true) {
      temote = "✅";
    }

    if (policemode == true) {
      memote = "🚨";
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle(`Settings for ${user.username}`)
      .addFields(
        { name: "Daily Reward Reminder", value: `${demote}` },
        { name: "Top.gg Vote Reminder", value: `${vemote}` },
        { name: "Tips", value: `${temote}` },
        { name: "Trade Requests", value: `${tremote}` }
      )
      .setColor(colors.blue);

    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("daily")
        .setLabel("Enable Daily Reminders")
        .setStyle("Success"),
      new Discord.ButtonBuilder()
        .setCustomId("top")
        .setLabel("Enable Vote Reminders")
        .setStyle("Success"),
      new Discord.ButtonBuilder()
        .setCustomId("tips")
        .setLabel("Enable Tips")
        .setStyle("Success")
    );

    let row2 = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("trades")
        .setLabel("Enable Trade Requests")
        .setStyle("Success"),
    );

    if (voteenabled == true) {
      row.components[1].setStyle("Danger");
      row.components[1].setLabel("Disable Vote Reminders");
    }
    if (dailyenabled == true) {
      row.components[0].setStyle("Danger");
      row.components[0].setLabel("Disable Daily Reward Reminders");
    }
    if (tipsenabled == true) {
      row.components[2].setStyle("Danger");
      row.components[2].setLabel("Disable Tips");
    }
    if (tradesenabled == true) {
      row2.components[0].setStyle("Danger");
      row2.components[0].setLabel("Disable Trade Requests");
    }
    if (policemode == true) {
      row2.components[1].setStyle("Danger");
      row2.components[1].setLabel("Enable Race Mode");
      row2.components[1].setEmoji("🏎️");
      console.log(true);
    }
    let msg = await interaction.reply({
      embeds: [embed],
      components: [row, row2],
      fetchReply: true,
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes("daily")) {
        if (userdata.settings.daily == true) {
          userdata.settings.daily = false;
          row.components[0].setStyle("Success");
          row.components[0].setLabel("Enable Daily Reward Reminders");
        } else if (userdata.settings.daily == false) {
          userdata.settings.daily = true;
          row.components[0].setStyle("Danger");
          row.components[0].setLabel("Disable Daily Reward Reminders");
        }
        userdata.markModified("settings");
        userdata.save();
        if (userdata.settings.daily == true) {
          demote = "✅";
        } else {
          demote = "❌";
        }

        embed = new Discord.EmbedBuilder()
          .setTitle(`Settings for ${user.username}`)
          .addFields(
            { name: "Daily Reward Reminder", value: `${demote}` },
            { name: "Top.gg Vote Reminder", value: `${vemote}` },
            { name: "Tips", value: `${temote}` },
            { name: "Mode", value: `${memote}` }
          )
          .setColor(colors.blue);
        await i.update({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
      } else if (i.customId.includes("police")) {
        if (!userdata.work)
          return interaction.editReply(
            "You need to have the police job for this setting!"
          );
        if (userdata.work.name !== "Police")
          return interaction.editReply(
            "You need to have the police job for this setting!"
          );
        if (userdata.police == true) {
          userdata.police = false;
          row2.components[1].setStyle("Success");
          row2.components[1].setLabel("Enable Police Mode");
          row2.components[1].setEmoji("🚨");
        } else if (userdata.police == false) {
          userdata.police = true;
          row2.components[1].setStyle("Danger");
          row2.components[1].setLabel("Enable Race Mode");
          row2.components[1].setEmoji("🏎️");
        }
        userdata.save();
        if (userdata.police == true) {
          memote = "✅";
        } else {
          memote = "❌";
        }

        embed = new Discord.EmbedBuilder()
          .setTitle(`Settings for ${user.username}`)
          .addFields(
            { name: "Daily Reward Reminder", value: `${demote}` },
            { name: "Top.gg Vote Reminder", value: `${vemote}` },
            { name: "Tips", value: `${temote}` },
            { name: "Mode", value: `${memote}` }
          )
          .setColor(colors.blue);
        await i.update({
          embeds: [embed],
          components: [row, row2],
          fetchReply: true,
        });
      } else if (i.customId.includes("top")) {
        if (userdata.settings.vote == true) {
          userdata.settings.vote = false;
          row.components[1].setStyle("Success");
          row.components[1].setLabel("Enable Vote Reminders");
        } else if (userdata.settings.vote == false) {
          userdata.settings.vote = true;
          row.components[1].setStyle("Danger");
          row.components[1].setLabel("Disable Vote Reminders");
        }
        userdata.markModified("settings");
        userdata.save();
        if (userdata.settings.vote == true) {
          vemote = "✅";
        } else {
          vemote = "❌";
        }

        embed = new Discord.EmbedBuilder()
          .setTitle(`Settings for ${user.username}`)
          .addFields(
            { name: "Daily Reward Reminder", value: `${demote}` },
            { name: "Top.gg Vote Reminder", value: `${vemote}` },
            { name: "Tips", value: `${temote}` }
          )
          .setColor(colors.blue);
        await i.update({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
      } else if (i.customId.includes("tips")) {
        if (userdata.settings.tips == true) {
          userdata.settings.tips = false;
          row.components[2].setStyle("Success");
          row.components[2].setLabel("Enable Tips");
        } else if (userdata.settings.tips == false) {
          userdata.settings.tips = true;
          row.components[2].setStyle("Danger");
          row.components[2].setLabel("Disable Tips");
        }
        userdata.markModified("settings");
        userdata.save();
        if (userdata.settings.tips == true) {
          temote = "✅";
        } else {
          temote = "❌";
        }

        embed = new Discord.EmbedBuilder()
          .setTitle(`Settings for ${user.username}`)
          .addFields(
            { name: "Daily Reward Reminder", value: `${demote}` },
            { name: "Top.gg Vote Reminder", value: `${vemote}` },
            { name: "Tips", value: `${temote}` }
          )
          .setColor(colors.blue);
        await i.update({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
      }
    });
  },
};
