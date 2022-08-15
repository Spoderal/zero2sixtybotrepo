const db = require("quick.db");
const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const icons = require("../data/crewicons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const crewicons = require("../data/crewicons.json");
const Global = require("../schema/global-schema");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crew")
    .setDescription("Do things with crews")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Join, create, leave, and more")
        .setRequired(true)
        .addChoices(
          { name: "Join", value: "join" },
          { name: "Leave", value: "leave" },
          { name: "View", value: "view" },
          { name: "Create", value: "create" },
          { name: "Global Leaderboard", value: "leaderboard" },
          { name: "Set Icon (crew owner)", value: "icon" },
          { name: "Delete (DANGEROUS)", value: "delete" },
          {
            name: "Approve Icon (BOT SUPPORT)",
            value: "approveico",
          }
        )
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("The name of the crew or icon")
    ),

  async execute(interaction) {
    let globalModel = await Global.findOne();
    let userdata = await User.findOne({ id: interaction.user.id });
    let option = interaction.options.getString("option");
    const crews = globalModel?.crews;

    if (!crews?.length && option !== "create") {
      return await interaction.reply(
        "There are no crews yet! Be the first by using `/crew create <name>` !"
      );
    }

    if (option == "view") {
      let crewname = interaction.options.getString("name");
      let crew;
      if (!crewname) {
        crew = userdata.crew;
        if (!crew)
          return await interaction.reply(
            "You're not in a crew!\nJoin one with `/crew option join name [crew name]` or create one with `/crew option create name [crew name]`"
          );
        crewname = crew.name;
      }
      let crew2 = crews.filter((crew) => crew.name == crewname);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");
      crew2 = crew2[0];
      let rpmembers = crew2.members;
      let emoji = emotes.zerorp;
      var finalLb = "";
      let total = 0;
      let rparray = [];
      let newrparray = [];
      for (i in rpmembers) {
        let userId = rpmembers[i];
        let user = await interaction.client.users.fetch(userId);
        let isOwner = false;
        if (user.id === crew2?.owner) isOwner = true;
        let newuserdata = await User.findOne({ id: user.id });
        let rp = newuserdata.rp || 0;
        rparray.push({ rp, user, isOwner });
        newrparray = rparray.sort((a, b) => b.rp - a.rp);
      }
      newrparray.length = 10;
      for (var i in newrparray) {
        let tag = newrparray[i].user.tag;
        total += newrparray[i].rp;
        finalLb += `**${
          newrparray.indexOf(newrparray[i]) + 1
        }.** ${tag} - **${numberWithCommas(newrparray[i].rp)}** ${emoji}\n`;
      }

      let icon = crew2.icon || icons.Icons.default;
      let mlength = crew2.members.length;
      let owner = newrparray.find((u) => u?.isOwner);
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Info for ${crew2.name}`)
        .setThumbnail(icon)
        .addFields([
          {
            name: "Information",
            value: `
              ${mlength} members\n
              Rank ${crew2.Rank}\n
              RP: ${total}\n
              ${
                owner
                  ? `Crew Leader: ${owner.user.username}#${owner.user.discriminator}`
                  : ""
              }
            `,
            inline: true,
          },
          { name: "Leaderboard", value: `${finalLb}`, inline: true },
        ])
        .setColor(colors.blue);

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("season")
          .setEmoji("💵")
          .setLabel("Season 1")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("stats")
          .setEmoji("📊")
          .setLabel("Stats")
          .setStyle("Secondary")
      );

      interaction
        .reply({ embeds: [embed], components: [row], fetchReply: true })
        .then(async (emb) => {
          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };

          const collector = emb.createMessageComponentCollector({
            filter: filter,
          });

          collector.on("collect", async (i) => {
            if (i.customId.includes("season")) {
              let crewseason = require("../data/seasons.json").Seasons.Crew1
                .Rewards;
              let reward = [];
              for (var w in crewseason) {
                let item = crewseason[w];
                let required = item.Number;
                let emote = "❌";
                if (required <= crew2.Rank) {
                  emote = "✅";
                }
                reward.push(`**${item.Number}** : ${item.Item} ${emote}`);
              }
              embed.setTitle(`Season 1 for ${crew2.crewname}`);
              embed.fields = [];
              embed.addFields([
                { name: "Rewards", value: `${reward.join("\n")}` },
              ]);

              await i.update({ embeds: [embed] });
            } else if (i.customId.includes("stats")) {
              embed.fields = [];
              embed
                .setTitle(`Info for ${crew2.name}`)
                .setThumbnail(icon)
                .addFields([
                  {
                    name: "Information",
                    value: `
                      ${crew2.members.length} members\n
                      Rank ${crew2.Rank}\n
                      RP: ${total}\n
                      Crew Leader: ${crew2.owner.username}#${crew2.owner.discriminator}
                    `,
                    inline: true,
                  },
                  { name: "Leaderboard", value: `${finalLb}`, inline: true },
                ])
                .setColor(colors.blue);

              await i.update({ embeds: [embed] });
            }
          });
        });
    } else if (option == "approveico") {
      let whitelist = [
        "275419902381260802",
        "890390158241853470",
        "699794627095429180",
        "670895157016657920",
        "576362830572421130",
        "937967206652837928",
        "311554075298889729",
        "474183542797107231",
        "678558875846443034",
        "211866621684219904",
      ];

      if (!whitelist.includes(interaction.user.id))
        return await interaction.reply({
          content: `You don't have permission to use this command!`,
          ephemeral: true,
        });
      let crewname = interaction.options.getString("name");

      let crew2 = globalModel.crews.filter((crew) => crew.name == crewname);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      let iconchoice = crew2.icontoapprove;

      if (!iconchoice) return await interaction.reply(`Wrong name!`);

      crew2.icon = iconchoice;
      globalModel.save();

      await interaction.reply(`✅`);
    } else if (option == "join") {
      let uid = interaction.user.id;
      let crewname = interaction.options.getString("name");
      if (!crewname)
        return await interaction.reply("Please specify a crew name!");

      let crew2 = globalModel.crews.filter((crew) => crew.name == crewname);
      if (crew2.length == 0)
        return await interaction.reply("That crew doesn't exist!");

      let crew = userdata.crew;
      let actcrew = crew2[0];
      if (crew) return await interaction.reply("You're already in a crew!");

      let newarray = [];
      actcrew.members.push(`${uid}`);
      newarray = actcrew.members;
      actcrew.members = newarray;
      await Global.findOneAndUpdate(
        {},

        {
          $set: {
            "crews.$[crew]": actcrew,
          },
        },

        {
          arrayFilters: [
            {
              "crew.name": actcrew.name,
            },
          ],
        }
      );
      globalModel.save();

      userdata.crew = crew2[0];

      userdata.rp = 0;
      userdata.joinedcrew = Date.now();
      userdata.save();

      await interaction.reply(`✅ Joined ${crewname}`);
    } else if (option == "create") {
      let crewname = interaction.options.getString("name");
      if (!crewname)
        return await interaction.reply("Please specify a crew name!");

      let isCrewNameTaken = crews?.find((crew) => crew.name == crewname);
      if (isCrewNameTaken)
        return await interaction.reply("That crew already exist!");

      let crew = userdata?.crew;
      if (crew)
        return await interaction.reply(
          "You're already in a crew! If you're a member, leave with `/crew leave`, and if you're the owner, delete it with `/crew delete`"
        );

      let crewobj = {
        name: crewname,
        members: [interaction.user.id],
        owner: interaction.user,
        icon: icons.Icons.default,
        Rank: 1,
        RP: 0,
      };

      if (!globalModel) {
        Global.create({
          crews: [crewobj],
        });
      } else {
        globalModel.crews.push(crewobj);
        await globalModel.save();
      }

      userdata.crew = crewobj;
      userdata.save();

      let embed = new Discord.EmbedBuilder()
        .setTitle(`${crewname}`)
        .setThumbnail(crewicons.Icons.Default)
        .setDescription(
          `✅ Created a crew with the name **${crewname}**, and the owner as **<@${interaction.user.id}>**`
        )
        .setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });
    } else if (option == "leave") {
      let uid = interaction.user.id;
      let crew = userdata.crew;

      if (!crew) return await interaction.reply("You're not in a crew!");

      let currentCrew = crews.find(({ name }) => name == crew.name);
      if (!currentCrew)
        return await interaction.reply("That crew doesn't exist!");

      if (currentCrew.owner.id == uid)
        return await interaction.reply(
          "You're the owner! Run `/crew delete` to delete this crew"
        );

      await interaction.reply(
        "Are you sure? Say `yes` to confirm, and anything else to cancel."
      );
      const filter = (m) => {
        return m.author.id === interaction.user.id;
      };

      let collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 30,
      });

      collector.on("collect", async (m) => {
        if (m.content.toLowerCase() == "yes") {
          let actcrew = crew;
          let newmem = actcrew.members;
          for (var i = 0; i < 1; i++) newmem.splice(newmem.indexOf(uid), 1);
          actcrew.members = newmem;

          userdata.crew = null;
          userdata.save();

          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew]": actcrew,
              },
            },

            {
              arrayFilters: [
                {
                  "crew.name": crew.name,
                },
              ],
            }
          );
          globalModel.save();

          m.react("✅");
        } else {
          return interaction.channel.send("❌");
        }
      });
    } else if (option == "icon") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      if (crew2.ownerid !== interaction.user.id)
        return await interaction.reply("You're not the crew owner!");

      await interaction.reply(
        "What crew icon would you like to submit? **Send an image below**"
      );

      const filter = (m) => {
        return m.author.id === interaction.user.id;
      };

      let collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 30,
      });

      collector.on("collect", async (m) => {
        let ImageLink;
        if (m.attachments.size > 0) {
          m.attachments.forEach((attachment) => {
            ImageLink = attachment.url;
          });
          let embed = new Discord.EmbedBuilder()
            .setImage(ImageLink)
            .setDescription("Crew icon submitted for review!")
            .addFields([{ name: `Crew Name`, value: `${crewname}` }])
            .setColor(colors.blue);
          m.reply({ embeds: [embed] });
          let submitchannel =
            interaction.client.channels.cache.get("931078225021521920");

          submitchannel.send({ embeds: [embed] });
          db.push(`crewicons_${interaction.user.id}`, {
            ID: crewname,
            Approved: false,
          });
          db.set(`crewicons_${crewname}`, ImageLink);

          db.push(`crewicons_${crewname}_approve`, {
            id: db.fetch(`${crewname}`),
            image: db.fetch(`crewicons_${crewname}`),
            uid: interaction.user.id,
          });
        } else {
          return m.reply("Specify an image!");
        }
      });
    } else if (option == "leaderboard") {
      await interaction.reply({ content: `Please wait...`, fetchReply: true });

      let data = globalModel.crews;
      let members = [];
      for (let obj of data) {
        try {
          members.push(obj);
        } catch (err) {
          // do nothing?
        }
      }

      members = members.sort(function (b, a) {
        return a.Rank - b.Rank;
      });

      members = members.filter(function BigEnough(value) {
        return value.Rank > 0;
      });

      members = members.slice(0, 10);

      let desc = "";

      for (let i = 0; i < members.length; i++) {
        let user = members[i].name;
        if (!user) return;
        let bal = members[i].Rank;
        desc += `${i + 1}. ${user} - Rank ${numberWithCommas(bal)}\n`;
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle("Crew Leaderboard")
        .setColor(colors.blue)
        .setDescription(desc);

      setTimeout(() => {
        interaction.editReply({ embeds: [embed] });
      }, 3000);
    } else if (option == "delete") {
      let uid = interaction.user.id;
      let crew = userdata.crew;
      let crewname = crew.name;
      let crew2 = crews.find((crew) => crew.name == crewname);

      if (!crew2) return await interaction.reply("That crew doesn't exist!");

      if (crew2.owner.id !== uid)
        return await interaction.reply("You're not the crew owner!");

      await interaction.reply(
        "Are you sure? This will permanently remove all perks from all members. Say `yes` to confirm, and anything else to cancel."
      );

      const filter = (m) => {
        return m.author.id === interaction.user.id;
      };

      let collector = interaction.channel.createMessageCollector({
        filter,
        max: 2,
        time: 1000 * 30,
      });

      collector.on("collect", async (m) => {
        if (m.content.toLowerCase() == "yes") {
          let crewlist = globalModel.crews;
          let crewobj = crew2[0];
          for (var i = 0; i < 1; i++)
            crewlist.splice(crewlist.indexOf(crewobj), 1);
          globalModel.crews = crewlist;
          globalModel.save();
          userdata.crew = null;
          userdata.save();
          m.react("✅");
        } else {
          return interaction.channel.send("❌");
        }
      });
    }
  },
};
