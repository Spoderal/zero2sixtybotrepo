const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const icons = require("../data/crewicons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const crewicons = require("../data/crewicons.json");
const Global = require("../schema/global-schema");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { numberWithCommas } = require("../common/utils");
const { emotes } = require("../common/emotes");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");

const partdb = require("../data/partsdb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crew")
    .setDescription("Do things with crews")
    .addSubcommand((command) =>
      command
        .setName("join")
        .setDescription("Join a crew")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the crew")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("leave").setDescription("Leave a crew")
    )
    .addSubcommand((command) =>
      command
        .setName("view")
        .setDescription("View a crew")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the crew")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("create")
        .setDescription("Create a crew")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the crew you want to create")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("top").setDescription("View the top crews")
    )
    .addSubcommand((command) =>
      command
        .setName("edit")
        .setDescription("Edit a crew (CREW OWNER)")

        .addStringOption((option) =>
          option
            .setName("option")
            .setDescription("The option to edit")
            .addChoices({ name: "Icon", value: "icon" })
        )
    )
    .addSubcommand((command) =>
      command.setName("delete").setDescription("Delete a crew (CREW OWNER)")
    ),

  async execute(interaction) {
    let globalModel = await Global.findOne();
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let option = interaction.options.getSubcommand();
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
      let crew2 = crews.filter(
        (crew) => crew.name.toLowerCase() == crewname.toLowerCase()
      );
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");
      crew2 = crew2[0];
      await interaction.reply({ content: `Please wait...`, fetchReply: true });
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
        let rp = newuserdata.rp4 || 0;
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
      if (!crew2.Rank3) {
        crew2.Rank3 = 1;

        globalModel.update();
        globalModel.markModified("crews");
        globalModel.save();
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Info for ${crew2.name}`)
        .setThumbnail(icon)
        .addFields([
          {
            name: "Information",
            value: `
              ${mlength} members\n
              Rank ${crew2.Rank3}\n
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
          .setCustomId("stats")
          .setEmoji("📊")
          .setLabel("Stats")
          .setStyle("Secondary")
      );

      if (crew && crew.name == crew2.name) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("season")
            .setEmoji("💵")
            .setLabel("Season 1")
            .setStyle("Secondary")
        );
      }

      await interaction
        .editReply({ embeds: [embed], components: [row], fetchReply: true })
        .then(async (emb) => {
          let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };

          const collector = emb.createMessageComponentCollector({
            filter: filter,
          });
          let redeemed = userdata.crewseason3 || 0;
          let crewseason = require("../data/seasons.json").Seasons.Crew1;

          collector.on("collect", async (i) => {
            if (i.customId.includes("season")) {
              crewseason = require("../data/seasons.json").Seasons.Crew1
                .Rewards;
              let reward = [];
              redeemed = userdata.crewseason3 || 0;
              for (var w in crewseason) {
                let item = crewseason[w];
                let required = item.Number;
                let emote = "❌";
                if (required <= crew2.Rank3) {
                  emote = "✅";
                }
                reward.push(`**${item.Number}** : ${item.Item} ${emote}`);
              }
              console.log(reward);
              let embed2 = new Discord.EmbedBuilder()
                .setTitle(`Season 1 for ${crew2.name}`)
                .addFields([{ name: "Rewards", value: `${reward.join("\n")}` }])
                .setThumbnail(icon)
                .setColor(colors.blue);

              row.addComponents(
                new ButtonBuilder()
                  .setCustomId("claim")
                  .setLabel(`Claim Reward ${(redeemed += 1)}`)
                  .setStyle(`Success`)
              );

              await i.update({ embeds: [embed2], components: [row] });
            } else if (i.customId.includes("stats")) {
              embed
                .setTitle(`Info for ${crew2.name}`)
                .setThumbnail(icon)
                .setColor(colors.blue);
              embed.fields = [
                {
                  name: "Information",
                  value: `
                      ${crew2.members.length} members\n
                      Rank ${crew2.Rank3}\n
                      RP: ${total}\n
                      Crew Leader: ${crew2.owner.username}#${crew2.owner.discriminator}
                    `,
                  inline: true,
                },
                { name: "Leaderboard", value: `${finalLb}`, inline: true },
              ];

              await i.update({ embeds: [embed], components: [row] });
            } else if (i.customId.includes("claim")) {
              let item = crewseason[redeemed];
              if (item.Number > crew2.Rank3) {
                return;
              }
              
              console.log(item);
              if (item.Item.endsWith("Cash")) {
                let amount = item.Item.split(" ")[0];
                userdata.cash += Number(amount);
                userdata.crewseason2 += 1;
                console.log("done");
              } else if (item.Item.endsWith("Notoriety")) {
                let amount = item.Item.split(" ")[0];
                userdata.notofall += Number(amount);
                userdata.crewseason2 += 1;
              } else if (
                item.Item.endsWith("Legendary Barn Maps") ||
                item.Item.endsWith("Legendary Barn Map")
              ) {
                let amount = item.Item.split(" ")[0];
                userdata.lmaps += Number(amount);

                userdata.crewseason2 += 1;
              } else if (item.Item.endsWith("Bank Increase")) {
                userdata.items.push("bank increase");

                userdata.crewseason2 += 1;
              } else if (
                item.Item.endsWith("Super wheelspin") ||
                item.Item.endsWith("Super wheelspins")
              ) {
                let amount = item.Item.split(" ")[0];
                userdata.swheelspins += Number(amount);

                userdata.crewseason2 += 1;
              } else if (item.Item.endsWith("Common Keys")) {
                let amount = item.Item.split(" ")[0];
                userdata.ckeys += Number(amount);

                userdata.crewseason2 += 1;
                userdata.save();
              } else if (item.Item.endsWith("Drift Keys")) {
                let amount = item.Item.split(" ")[0];
                userdata.dkeys += Number(amount);

                userdata.crewseason2 += 1;
              } else if (
                item.Item.endsWith("Garage Space") ||
                item.Item.endsWith("Garage Spaces")
              ) {
                let amount = item.Item.split(" ")[0];
                parseInt(amount);

                userdata.garagelimit += Number(amount);

                userdata.crewseason2 += 1;
              } else if (item.Item.endsWith("Rare Keys")) {
                let amount = item.Item.split(" ")[0];
                userdata.rkeys += Number(amount);

                userdata.crewseason2 += 1;
              } else if (item.Item.endsWith("Exotic Keys")) {
                let amount = item.Item.split(" ")[0];
                userdata.ekeys += Number(amount);

                userdata.crewseason2 += 1;
              } else if (partdb.Parts[item.Item.toLowerCase()]) {
                userdata.parts.push(item.Item.toLowerCase());

                userdata.crewseason2 += 1;
              } else if (cardb.Cars[item.Item.toLowerCase()]) {
                let cartogive = cardb.Cars[item.Item.toLowerCase()];
                let carindb = cartogive;
                let carobj = {
                  ID: carindb.alias,
                  Name: carindb.Name,
                  Speed: carindb.Speed,
                  Acceleration: carindb["0-60"],
                  Handling: carindb.Handling,
                  Parts: [],
                  Emote: carindb.Emote,
                  Livery: carindb.Image,
                  Miles: 0,
                  WeightStat: carindb.Weight,
                  Gas: 10,
                  MaxGas: 10
                };
                userdata.cars.push(carobj);

              }
              userdata.crewseason3 += 1;
              userdata.save();

              row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("season")
                  .setEmoji("💵")
                  .setLabel("Season 1")
                  .setStyle("Secondary"),
                new ButtonBuilder()
                  .setCustomId("stats")
                  .setEmoji("📊")
                  .setLabel("Stats")
                  .setStyle("Secondary"),
                new ButtonBuilder()
                  .setCustomId("claim")
                  .setLabel(`Claim Reward ${(redeemed += 1)}`)
                  .setStyle(`Success`)
              );
              if (item.Number > crew2.Rank3) {
                row.components[0].setStyle(`Danger`);
              }

              i.update({ components: [row] });
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
      globalModel.markModified("crews");

      userdata.crew = crew2[0];

      userdata.rp4 = 0;
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
        Rank3: 1,
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
      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setStyle("Secondary")
          .setEmoji("✅"),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setStyle("Secondary")
          .setEmoji("❌")
      );
      let msg = await interaction.reply({
        content: "Are you sure?",
        components: [row],
        fetchReply: true,
      });
      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector = msg.createMessageComponentCollector({
        filter: filter,
      });

      collector.on("collect", async (i) => {
        if (i.customId.includes("confirm")) {
          let actcrew = crew;
          let newmem = actcrew.members;
    

          for (var i2 = 0; i2 < 1; i2++)  newmem.splice(newmem.indexOf(`${uid}`), 1);
          console.log(actcrew)
          console.log(newmem)
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].members": newmem,
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
          userdata.crew = null;
          userdata.save();
          row.components[0].setDisabled();
          row.components[1].setDisabled();
          i.update({ components: [row] });
        } else {
          row.components[0].setDisabled();
          row.components[1].setDisabled();
          i.update({ components: [row] });

          return;
        }
      });
    } else if (option == "edit") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      let toedit = interaction.options.getString("option");
      console.log(crew2[0]);
      if (crew2[0].owner.id !== interaction.user.id)
        return interaction.reply("You need to be the crew owner!");
      if (toedit == "icon") {
        let icons = crewicons.Icons;
        let iconsdisplay = [];
        for (let ico in icons) {
          let icon = icons[ico];

          iconsdisplay.push(icon);
        }

        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("set")
            .setLabel("Set as icon")
            .setStyle("Success")
        );

        let row9 = new ActionRowBuilder().addComponents(
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

        let iconum = 0;
        let embed = new EmbedBuilder()
          .setTitle("Choose an icon")
          .setColor(colors.blue)
          .setDescription(`Icon ${iconum}`)
          .setImage(`${iconsdisplay[iconum]}`);

        let msg = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
          components: [row9, row],
        });

        let filter = (btnInt) => {
          return interaction.user.id == btnInt.user.id;
        };
        const collector = msg.createMessageComponentCollector({
          filter: filter,
        });

        collector.on("collect", async (i) => {
          if (i.customId == "next") {
            iconum++;

            embed = new EmbedBuilder()
              .setTitle("Choose an icon")
              .setColor(colors.blue)
              .setDescription(`Icon ${iconum}`)
              .setImage(`${iconsdisplay[iconum]}`);

            await i.update({
              embeds: [embed],
              fetchReply: true,
              components: [row9, row],
            });
          } else if (i.customId == "previous") {
            iconum--;

            embed = new EmbedBuilder()
              .setTitle("Choose an icon")
              .setColor(colors.blue)
              .setDescription(`Icon ${iconum}`)
              .setImage(`${iconsdisplay[iconum]}`);

            await i.update({
              embeds: [embed],
              fetchReply: true,
              components: [row9, row],
            });
          } else if (i.customId == "last") {
            iconum = iconsdisplay.length;

            embed = new EmbedBuilder()
              .setTitle("Choose an icon")
              .setColor(colors.blue)
              .setDescription(`Icon ${iconum}`)
              .setImage(`${iconsdisplay[iconum]}`);

            await i.update({
              embeds: [embed],
              fetchReply: true,
              components: [row9, row],
            });
          } else if (i.customId == "first") {
            iconum = 0;

            embed = new EmbedBuilder()
              .setTitle("Choose an icon")
              .setColor(colors.blue)
              .setDescription(`Icon ${iconum}`)
              .setImage(`${iconsdisplay[iconum]}`);

            await i.update({
              embeds: [embed],
              fetchReply: true,
              components: [row9, row],
            });
          } else if (i.customId == "set") {
            let iconurl = iconsdisplay[iconum];

            crew2[0].icon = iconurl;

            await Global.findOneAndUpdate(
              {},

              {
                $set: {
                  "crews.$[crew].icon": iconurl,
                },
              },

              {
                arrayFilters: [
                  {
                    "crew.name": crew2[0].name,
                  },
                ],
              }
            );

            globalModel.save();
            await i.update(`✅`);
          }
        });
      }
    } else if (option == "delete") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      console.log(crew2[0]);
      if (crew2[0].owner.id !== interaction.user.id)
        return interaction.reply("You need to be the crew owner!");

      interaction.reply({
        content:
          "Are you sure you want to delete this crew? This action is not reversable. Y/N",
        fetchReply: true,
      });

      let filter = (m) => m.author.id == interaction.user.id;
      const collector2 = interaction.channel.createMessageCollector({
        filter: filter,
        time: 10000,
      });

      collector2.on("collect", async (i) => {
        if (i.content.toLowerCase() == "y") {
          let crews = globalModel.crews;

          for (var i2 = 0; i2 < crews.length; i2++)
            if (crews[i2].name === crew2[0].name) {
              crews.splice(i2, 1);
              break;
            }

          for (let mem in crew2[0].members) {
            let member = crew2[0].members[mem];

            let memberdata = await User.findOne({ id: member });

            if (memberdata.crew) {
              await User.findOneAndUpdate(
                {
                  id: member,
                },
                {
                  $unset: {
                    crew: {},
                  },
                },
                {}
              );
            }
          }

          globalModel.crews = crews;

          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $unset: {
                crew: {},
              },
            },
            {}
          );

          userdata.save();

          globalModel.save();

          await interaction.channel.send("Crew deleted");
        }
      });
    } else if (option == "top") {
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
        return a.Rank3 - b.Rank3;
      });

      members = members.filter(function BigEnough(value) {
        return value.Rank3 > 0;
      });

      members = members.slice(0, 10);

      let desc = "";

      for (let i = 0; i < members.length; i++) {
        let user = members[i].name;
        if (!user) return;
        let bal = members[i].Rank3;
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
