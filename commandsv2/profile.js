const profilepics = require("../data/pfpsdb.json").Pfps;
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
const jobdb = require("../data/jobs.json");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

const { createCanvas, loadImage } = require("canvas");
const lodash = require("lodash");

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
    .addSubcommand((cmd) =>
      cmd
        .setName("edit")
        .setDescription("Edit your profile")
        .addStringOption((option) =>
          option
            .setName("option")
            .setDescription("The field to edit")
            .setChoices(
              { name: "Helmet", value: "helmet" },
              { name: "Title", value: "title" }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The helmet or title to set")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let command = interaction.options.getSubcommand();

    if (command == "view") {
      let user = interaction.options.getUser("user") || interaction.user;
      let userdata = await User.findOne({ id: user.id });
      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
      let helmet = userdata.helmet || "default";
      let title = userdata.title || "noob racer";
      if (!title || title == null || title == undefined) {
        title = "noob racer";
      }
      title = titledb[title.toLowerCase()].Title;
      console.log(title);
      let driftrank = userdata.driftrank;
      let racerank = userdata.racerank;
      let prestige = userdata.prestige;
      let tier = userdata.tier;
      let cars = userdata.cars;
      let finalprice = 0;

      for (let car in cars) {
        let car2 = cars[car];
        let price = cardb.Cars[car2.Name.toLowerCase()]?.Price;
        if (price) finalprice += Number(price);
      }

      let carsort = cars.sort(function (a, b) {
        return b.Speed - a.Speed;
      });
      let fastcar = carsort[0];

      let pvprank = userdata.pvprank;
      let pvpname = pvprank.Rank || "Silver";

      if (pvpname == undefined) {
        pvpname = "Silver";
      }
      let jobemote = "";

      let pvpindb = pvpranks[pvpname.toLowerCase()];
      let achievements = userdata.achievements;
      let userjob = userdata.work || {
        name: "No Job",
        position: "No Position",
      };

      if (userjob.name !== "No Job") {
        let userjobfilter = jobdb[userjob.name.toLowerCase()];
        let positionfilter = userjobfilter.Positions.filter(
          (pos) => pos.name.toLowerCase() == userjob.position.toLowerCase()
        );
        jobemote = positionfilter[0].emote;
      }
      let achivarr = [];
      for (let ach in achievements) {
        let achiev = achievements[ach];
        let achindb = achievementsdb.Achievements[achiev.name.toLowerCase()];
        achivarr.push(`${achindb.Emote}`);
      }
      console.log(achivarr);
      if (achivarr.length == 0) {
        achivarr = ["No achievements"];
      }
      console.log(achivarr);

      let cash = userdata.cash;
      finalprice += cash;

      let acthelmet = profilepics[helmet.toLowerCase()].Image;
      let showcase = userdata.showcase;

      let embed = new EmbedBuilder()
        .setTitle(title)
        .setAuthor({ name: user.username, iconURL: acthelmet })
        .setDescription(
          `
        ${emotes.race} Race Rank: ${racerank}\n
        ${emotes.drift} Drift Rank: ${driftrank}\n
        ${emotes.prestige} Prestige: ${prestige}\n
        ${emotes.tier} **Tier**: ${tier}\n
        ${pvpindb.emote} PVP Rank: ${pvpname} ${pvprank.Wins}\n
        `
        )
        .addFields(
          {
            name: "Achievements",
            value: `${achivarr.join(" ")}`,
            inline: true,
          },
          {
            name: "Job",
            value: `
         ${jobemote} __${userjob.name}__
          ${userjob.position}
          `,
            inline: true,
          },
          {
            name: "Best Car",
            value: `
          **${fastcar.Emote} ${fastcar.Name}**
          ${emotes.speed} ${fastcar.Speed}
          ${emotes.zero2sixty} ${fastcar.Acceleration}s
          ${emotes.handling} ${fastcar.Handling}
          ${emotes.weight} ${fastcar.WeightStat}
          `,
            inline: true,
          },
          {
            name: "Networth",
            value: `
         ${toCurrency(finalprice)}
          `,
          }
        )
        .setColor(`${colors.blue}`)
        .setThumbnail(showcase);

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Helmets")
          .setStyle("Secondary")
          .setEmoji("<:helmet_vibrant:1044407040862339112>")
          .setCustomId("helmets"),
        new ButtonBuilder()
          .setLabel("Titles")
          .setStyle("Secondary")
          .setCustomId("titles")
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

      let msg;
      if (user == interaction.user) {
        msg = await interaction.reply({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });
      } else {
        msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      }

      let filter = (btnInt) => {
        return interaction.user.id == btnInt.user.id;
      };
      const collector = msg.createMessageComponentCollector({
        filter: filter,
      });
      let helmlist = [];
      let titlelist = [];

      for (let helm in userdata.pfps) {
        let helmet = userdata.pfps[helm];

        helmlist.push(helmet);
      }

      for (let helm in userdata.titles) {
        let title = userdata.titles[helm];

        titlelist.push(title);
      }

      helmlist = lodash.chunk(
        helmlist.map((a) => a),
        10
      );

      titlelist = lodash.chunk(
        titlelist.map((a) => a),
        10
      );

      let page = 0;
      let vispage = 1;
      let items;
      collector.on("collect", async (i) => {
        if (i.customId == "helmets") {
          items = helmlist;

          let displayhelms = [];

          for (let h in helmlist[page]) {
            let helm = helmlist[page][h];
            displayhelms.push(
              `${profilepics[helm.toLowerCase()].Emote} ${
                profilepics[helm.toLowerCase()].Name
              }`
            );
          }

          embed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle("Your Helmets")
            .setFooter({ text: `Page ${vispage}` })
            .setDescription(`${displayhelms.join("\n")}`);

          i.update({
            embeds: [embed],
            components: [row, row2],
            fetchReply: true,
          });
        } else if (i.customId == "titles") {
          items = titlelist;

          let displaytitles = [];

          for (let h in titlelist[page]) {
            let helm = titlelist[page][h];
            displaytitles.push(`${titledb[helm.toLowerCase()].Title}`);
          }

          embed = new EmbedBuilder()
            .setColor(colors.blue)
            .setTitle("Your Titles")
            .setFooter({ text: `Page ${vispage}` })
            .setDescription(`${displaytitles.join("\n")}`);

          i.update({
            embeds: [embed],
            components: [row, row2],
            fetchReply: true,
          });
        } else if (i.customId == "next") {
          page++;
          vispage++;

          if (page > items.length)
            return i.update({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              displayhelms.push(
                `${profilepics[helm.toLowerCase()].Emote} ${
                  profilepics[helm.toLowerCase()].Name
                }`
              );
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Helmets")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } else if (items == titlelist) {
            let displaytitles = [];

            for (let h in titlelist[page]) {
              let helm = titlelist[page][h];
              displaytitles.push(`${titledb[helm.toLowerCase()].Title}`);
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Titles")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displaytitles.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          }
        } else if (i.customId == "previous") {
          page--;
          vispage--;

          if (page > items.length)
            return i.update({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              displayhelms.push(
                `${profilepics[helm.toLowerCase()].Emote} ${
                  profilepics[helm.toLowerCase()].Name
                }`
              );
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Helmets")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } else if (items == titlelist) {
            let displaytitles = [];

            for (let h in titlelist[page]) {
              let helm = titlelist[page][h];
              displaytitles.push(`${titledb[helm.toLowerCase()].Title}`);
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Titles")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displaytitles.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          }
        } else if (i.customId == "first") {
          page = 0;
          vispage = 1;

          if (page > items.length)
            return i.update({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              displayhelms.push(
                `${profilepics[helm.toLowerCase()].Emote} ${
                  profilepics[helm.toLowerCase()].Name
                }`
              );
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Helmets")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } else if (items == titlelist) {
            let displaytitles = [];

            for (let h in titlelist[page]) {
              let helm = titlelist[page][h];
              displaytitles.push(`${titledb[helm.toLowerCase()].Title}`);
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Titles")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displaytitles.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          }
        } else if (i.customId == "last") {
          page = items.length;
          vispage = items.length += 1;

          if (page > items.length)
            return i.update({ content: "You don't have anymore pages!" });

          if (items == helmlist) {
            let displayhelms = [];

            for (let h in items[page]) {
              let helm = items[page][h];
              displayhelms.push(
                `${profilepics[helm.toLowerCase()].Emote} ${
                  profilepics[helm.toLowerCase()].Name
                }`
              );
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Helmets")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displayhelms.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          } else if (items == titlelist) {
            let displaytitles = [];

            for (let h in titlelist[page]) {
              let helm = titlelist[page][h];
              displaytitles.push(`${titledb[helm.toLowerCase()].Title}`);
            }

            embed = new EmbedBuilder()
              .setColor(colors.blue)
              .setTitle("Your Titles")
              .setFooter({ text: `Page ${vispage}` })
              .setDescription(`${displaytitles.join("\n")}`);

            i.update({
              embeds: [embed],
              components: [row, row2],
              fetchReply: true,
            });
          }
        }
      });
    } else if (command == "edit") {
      let option = interaction.options.getString("option");
      let userdata = await User.findOne({ id: interaction.user.id });
      let item = interaction.options.getString("item").toLowerCase();

      if (option == "helmet") {
        let userpfps = userdata.pfps;

        let pfp = interaction.options.getString("item");
        if (!pfp) return await interaction.reply("Specify a helmet!");
        let pfplist = profilepics;
        if (!pfplist[pfp.toLowerCase()])
          return await interaction.reply("Thats not a profile picture.");
        if (!userpfps)
          return await interaction.reply("You dont have any profile pictures.");
        if (!userpfps.includes(pfp.toLowerCase()))
          return await interaction.reply("You dont own that profile picture.");

        userdata.helmet = pfp.toLowerCase();
        userdata.save();

        await interaction.reply(`Set your helmet to "${pfp}"`);
      } else if (option == "title") {
        let userpfps = userdata.titles;

        if (!item) return await interaction.reply("Specify a title!");
        if (!titledb[item.toLowerCase()])
          return await interaction.reply("Thats not a title.");
        if (!userpfps)
          return await interaction.reply("You dont have any titles.");
        if (!userpfps.includes(item.toLowerCase()))
          return await interaction.reply("You dont own that title.");

        userdata.title = item.toLowerCase();
        userdata.save();

        await interaction.reply(`Set your title to "${item}"`);
      }
    }
  },
};
