

const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const icons = require("../data/crewicons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const crewicons = require("../data/crewicons.json");
const Global = require("../schema/global-schema");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { numberWithCommas, toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");
const ms = require("pretty-ms");
const cardsdb = require("../data/cards.json");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");

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
        .setName("claim")
        .setDescription("Claim a reward from a crew season")
    )
    .addSubcommand((command) =>
      command.setName("cards").setDescription("View and activate cards")
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
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("kick")
        .setDescription("Kick a crew member (CREW OWNER)")

        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to kick")
            .setRequired(true)
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
    let crews = globalModel?.crews;

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
        let rp = newuserdata.rp || 0;
        let filteruser = rparray.filter((use) => use.user == user);
        if (!filteruser[0]) {
          rparray.push({ rp, user, isOwner });
        }
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
      if (!crew2.Rank) {
        crew2.Rank = 1;

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
              ${mlength}/30 members\n
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
          .setCustomId("stats")
          .setEmoji("📊")
          .setLabel("Stats")
          .setStyle("Secondary")
      );

      if (crew && crew.name == crew2.name) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId("season")
            .setEmoji("<:crew_season4:1200642745002373201>")
            .setLabel("Season 4")
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
          let crewclaimed = userdata.crewseason || 0
          let crewseason = require("../data/seasons.json").Seasons.Crew2;

          collector.on("collect", async (i) => {
            if (i.customId.includes("season")) {
              crewseason = require("../data/seasons.json").Seasons.Crew2
                .Rewards;
              let reward = [];
              for (var w in crewseason) {
                let item = crewseason[w];
                let required = item.Number;
                let emote = "❌";
                if (required <= crew2.Rank) {
                  emote = "✅";
                }
                let item2 = item.Item.toLowerCase()
                console.log(item2)
                if(cardb.Cars[item2]){
                  reward.push(`**${item.Number}** : ${cardb.Cars[item2].Emote} ${cardb.Cars[item2].Name} ${emote}`);

                }
                else if(itemdb[item2]){
                  reward.push(`**${item.Number}** : ${itemdb[item2].Emote} ${itemdb[item2].Name} ${emote}`);

                }
                else if(partdb.Parts[item2]){
                  reward.push(`**${item.Number}** : ${partdb.Parts[item2].Emote} ${partdb.Parts[item2].Name} ${emote}`);

                }
                else if(item2.endsWith("exotic keys")){
                  reward.push(`**${item.Number}** : ${emotes.exoticKey} ${item2} ${emote}`);

                }
                else if(item2.endsWith("rare keys")){
                  reward.push(`**${item.Number}** : ${emotes.rareKey} ${item2} ${emote}`);

                }
                else if(item2.endsWith("cash")){
                  let amount = item2.split(" ")[0];
                  reward.push(`**${item.Number}** : ${emotes.cash} ${toCurrency(amount)} Cash ${emote}`);

                }
                else if(item2.endsWith("garage spaces")){
                  reward.push(`**${item.Number}** : ${emotes.garage} ${item2} ${emote}`);

                }
                else if(item2.endsWith("crew respect")){
                  reward.push(`**${item.Number}** : <:crewrespect:1143422770173190245> ${item2} ${emote}`);

                }
                else if(item2.endsWith("gold")){
                  reward.push(`**${item.Number}** : ${emotes.gold} ${item2} ${emote}`);

                }
                else if(item2.endsWith("race ranks")){
                  reward.push(`**${item.Number}** : ${emotes.race} ${item2} ${emote}`);

                }
                else if(item2.endsWith("drift ranks")){
                  reward.push(`**${item.Number}** : ${emotes.drift} ${item2} ${emote}`);

                }
              }
              console.log(reward)
              let embed2 = new Discord.EmbedBuilder()
                .setTitle(`Season 4 for ${crew2.name}`)
                .setDescription(`${reward.join("\n")}`)
                .setFooter({text: `Ends March 1st 2024`})
                .setThumbnail(icon)
                .setColor(colors.blue);

              await interaction.editReply({ embeds: [embed2], components: [row] });
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
                      Rank ${crew2.Rank}\n
                      RP: ${total}\n
                      Crew Leader: ${crew2.owner.username}#${crew2.owner.discriminator}
                    `,
                  inline: true,
                },
                { name: "Leaderboard", value: `${finalLb}`, inline: true },
              ];

              await interaction.editReply({ embeds: [embed], components: [row] });
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

      if (crew2[0].members.length >= 30)
        return interaction.reply("The max members a crew can have is 30!");

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

      userdata.rp = 0;
      userdata.joinedcrew = Date.now();
      userdata.save();

      await interaction.reply(`✅ Joined ${crewname}`);
    } else if (option == "claim") {
      let crewseason = require("../data/seasons.json").Seasons.Crew2.Rewards;
      let seasonclaimed = userdata.crewseasonclaimed || 0

      let crewname = userdata.crew.name;
      let crew2 = crews.filter(
        (crew) => crew.name.toLowerCase() == crewname.toLowerCase()
      );
      if(!crew2 || crew2.length == 0 || crew2 == []) return interaction.reply("You need to be in a crew to claim rewards!")
      let seasonnew = seasonclaimed + 1
      let item = crewseason[`${seasonnew}`];
      
      if (item.Number > crew2[0].Rank) {
        return interaction.reply(`Your crew needs to be rank ${item.Number}`);
      }
      if (!item) {
        return interaction.reply(`You've claimed all the rewards!`);
      }
      if (item.Item.endsWith("Cash")) {
        let amount = item.Item.split(" ")[0];
        userdata.cash += Number(amount);

      }
      if (item.Item.endsWith("Gold")) {
        let amount = item.Item.split(" ")[0];
        userdata.gold += Number(amount);

      }
      if (item.Item.endsWith("Crew Respect")) {
        let amount = item.Item.split(" ")[0];
        userdata.crewrespect += Number(amount);

      } else if (item.Item.endsWith("Notoriety")) {
        let amount = item.Item.split(" ")[0];
        userdata.notofall += Number(amount);
      } else if (
        item.Item.endsWith("Legendary Barn Maps") ||
        item.Item.endsWith("Legendary Barn Map")
      ) {
        let amount = item.Item.split(" ")[0];
        userdata.lmaps += Number(amount);
      } else if (item.Item.endsWith("Bank Increase")) {
        userdata.items.push("bank increase");
      } else if (
        item.Item.endsWith("Super wheelspin") ||
        item.Item.endsWith("Super wheelspins")
      ) {
        let amount = item.Item.split(" ")[0];
        userdata.swheelspins += Number(amount);
      } else if (item.Item.endsWith("Common Keys")) {
        let amount = item.Item.split(" ")[0];
        userdata.ckeys += Number(amount);

        userdata.save();
      } else if (item.Item.endsWith("Drift Keys")) {
        let amount = item.Item.split(" ")[0];
        userdata.dkeys += Number(amount);
      } else if (
        item.Item.endsWith("Garage Space") ||
        item.Item.endsWith("Garage Spaces")
      ) {
        let amount = item.Item.split(" ")[0];
        parseInt(amount);

        userdata.garageLimit += Number(amount);
      } else if (item.Item.endsWith("Rare Keys")) {
        let amount = item.Item.split(" ")[0];
        userdata.rkeys += Number(amount);
      } else if (item.Item.endsWith("Exotic Keys")) {
        let amount = item.Item.split(" ")[0];
        userdata.ekeys += Number(amount);
      } else if (partdb.Parts[item.Item.toLowerCase()]) {
        userdata.parts.push(item.Item.toLowerCase());
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
          MaxGas: 10,
        };
        userdata.cars.push(carobj);
      }

      userdata.crewseasonclaimed += 1
      userdata.save();

      interaction.reply(`Claimed ${item.Item}`);
    } else if (option == "create") {
      let crewname = interaction.options.getString("name");
      if (!crewname)
        return await interaction.reply("Please specify a crew name!");

      let isCrewNameTaken = crews?.find((crew) => crew.name == crewname);
      if (isCrewNameTaken)
        return await interaction.reply("That crew already exists!");

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
        Cards: [
          {
            name: "crush card",
            points: 0,
            pointsmax: 100,
            rp: 20,
            time: 0,
          },
          {
            name: "sting card",
            points: 0,
            pointsmax: 200,
            rp: 50,
            time: 0,
          },
          {
            name: "gt card",
            points: 0,
            pointsmax: 750,
            rp: 120,
            time: 0,
          },
        ],
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

      let currentCrew = crews.find(({ name }) => name == crew.name) || {owner: {id: 0}, members: 1}
     

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

          for (var i2 = 0; i2 < 1; i2++)
            newmem.splice(newmem.indexOf(`${uid}`), 1);
          
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
          interaction.editReply({ components: [row] });
        } else {
          row.components[0].setDisabled();
          row.components[1].setDisabled();
          interaction.editReply({ components: [row] });

          return;
        }
      });
    } else if (option == "edit") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      let toedit = interaction.options.getString("option");
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

            await interaction.editReply({
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

            await interaction.editReply({
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

            await interaction.editReply({
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

            await interaction.editReply({
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
            await interaction.editReply(`✅`);
          }
        });
      }
    } else if (option == "kick") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      let tokick = interaction.options.getString("user");
      if (crew2[0].owner.id !== interaction.user.id)
        return interaction.reply("You need to be the crew owner!");

      let actcrew = crew2;
      let newmem = actcrew.members;
      let uid = tokick.id;
      let utokickdata = await User.findOne({ id: uid });

      for (var i2 = 0; i2 < 1; i2++) newmem.splice(newmem.indexOf(`${uid}`), 1);

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
      utokickdata.crew = null;
      userdata.save();
    } else if (option == "delete") {
      let crewname = userdata.crew;
      if (!crewname) return await interaction.reply("You are not in a crew!");

      let crew2 = crews.filter((crew) => crew.name == crewname.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

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


      members = members.sort((a, b) => {
         if (a.Rank > b.Rank) {
           return -1;
         }
         if (a.Rank < b.Rank) {
           return 1;
         }
         return 0;
       });

      members = members.filter(function BigEnough(value) {
        return value.Rank > 1;
      });


      let desc = "";

      for (let i = 0; i < 10; i++) {
        if(members[i]){
          let crew = members[i].name;
          if (!crew) return;
          let bal = members[i].Rank;
          desc += `${i + 1}. ${crew} - Rank ${numberWithCommas(bal)}\n`;

        }
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle("Crew Leaderboard")
        .setColor(colors.blue)
        .setDescription(desc);

      let xt = setTimeout(() => {
        interaction.editReply({ embeds: [embed] });
        
        clearTimeout(xt)
      }, 3000);
    } else if (option == "cards") {
      let crew = userdata.crew;
      let crewname = crew.name;
      let crew2 = crews.find((crew) => crew.name == crewname);

      if (!crew2) return await interaction.reply("That crew doesn't exist!");

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("crush_card")
          .setLabel("Add 10 Crew Respect")
          .setEmoji(`${cardsdb["crush card"].emote}`)
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("sting_card")
          .setLabel("Add 10 Crew Respect")
          .setEmoji(`${cardsdb["sting card"].emote}`)
          .setStyle("Primary"),
        new ButtonBuilder()
          .setCustomId("gt_card")
          .setLabel("Add 10 Crew Respect")
          .setEmoji(`${cardsdb["gt card"].emote}`)
          .setStyle("Primary")
      );

      let row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("activate_crush_card")
          .setLabel("Activate")
          .setEmoji(`${cardsdb["crush card"].emote}`)
          .setDisabled(true)
          .setStyle("Success"),
        new ButtonBuilder()
          .setCustomId("activate_sting_card")
          .setLabel("Activate")
          .setEmoji(`${cardsdb["sting card"].emote}`)
          .setDisabled(true)
          .setStyle("Success"),
        new ButtonBuilder()
          .setCustomId("activate_gt_card")
          .setLabel("Activate")
          .setEmoji(`${cardsdb["gt card"].emote}`)
          .setDisabled(true)
          .setStyle("Success")
      );

      let cards = crew2.Cards;

      let card1filt = cards.filter((card) => card.name == "crush card");
      let card2filt = cards.filter((card) => card.name == "sting card");
      let card3filt = cards.filter((card) => card.name == "gt card");

      if (card1filt[0].points >= card1filt[0].pointsmax) {
        row2.components[0].setDisabled(false);
      }

      if (card2filt[0].points >= card2filt[0].pointsmax) {
        row2.components[1].setDisabled(false);
      }
      if (card3filt[0].points >= card3filt[0].pointsmax) {
        row2.components[2].setDisabled(false);
      }

      let timeout1 = 14400000;
      let timeout4 = 7200000;
      let timeout5 = 3600000;

      let time1 = "0 Hours";

      let time2 = "0 Hours";

      let time3 = "0 Hours";
      if (
        card1filt[0].time !== null &&
        timeout1 - (Date.now() - card1filt[0].time) < 0
      ) {
        console.log("no card");
      } else {
        time1 = `${ms(timeout1 - (Date.now() - card1filt[0].time))}`;
      }

      if (
        card2filt[0].time !== null &&
        timeout4 - (Date.now() - card2filt[0].time) < 0
      ) {
        console.log("no card");
      } else {
        time2 = `${ms(timeout4 - (Date.now() - card2filt[0].time))}`;
      }

      if (
        card3filt[0].time !== null &&
        timeout5 - (Date.now() - card3filt[0].time) < 0
      ) {
        console.log("no card");
      } else {
        time3 = `${ms(timeout5 - (Date.now() - card3filt[0].time))}`;
      }

      let embed = new EmbedBuilder()
        .setTitle(`Your crews cards`)
        .addFields(
          {
            name: `Crush Card`,
            value: `${cardsdb["crush card"].emote}\nTime remaining: ${time1}\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
            inline: true,
          },
          {
            name: `Sting Card`,
            value: `${cardsdb["sting card"].emote}\nTime remaining: ${time2}\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
            inline: true,
          },
          {
            name: `GT Card`,
            value: `${cardsdb["gt card"].emote}\nTime remaining: ${time3}\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
            inline: true,
          }
        )
        .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
        .setColor(colors.blue);

      let msg = await interaction.reply({
        embeds: [embed],
        components: [row, row2],
      });

      const filter = (m) => {
        return m.user.id === interaction.user.id;
      };

      let collector = msg.createMessageComponentCollector({
        filter,
        time: 1000 * 30,
      });
      let actcrew = crew2;
      collector.on("collect", async (i) => {
        if (i.customId == "crush_card") {
          let crewresp = userdata.crewrespect || 0;

          if (crewresp < 10)
            return interaction.editReply("You don't have enough crew respect!");

          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card1filt[0].points += 10;
          userdata.crewrespect -= 10;
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.0": card1filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        } else if (i.customId == "sting_card") {
          let crewresp = userdata.crewrespect || 0;

          if (crewresp < 10)
            return interaction.editReply("You don't have enough crew respect!");

          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card2filt[0].points += 10;
          userdata.crewrespect -= 10;
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.1": card2filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        } else if (i.customId == "gt_card") {
          let crewresp = userdata.crewrespect || 0;

          if (crewresp < 10)
            return interaction.editReply("You don't have enough crew respect!");

          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card3filt[0].points += 10;
          userdata.crewrespect -= 10;
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.2": card3filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        } else if (i.customId == "activate_crush_card") {
          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card1filt[0].points = 0;
          card1filt[0].time = Date.now();
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.0": card1filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        } else if (i.customId == "activate_sting_card") {
          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card2filt[0].points = 0;
          card2filt[0].time = Date.now();
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.0": card2filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        } else if (i.customId == "activate_gt_card") {
          let timeout = 14400000;
          let timeout2 = 7200000;
          let timeout3 = 3600000;
          if (
            card1filt[0].time !== null &&
            timeout - (Date.now() - card1filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card2filt[0].time !== null &&
            timeout2 - (Date.now() - card2filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          if (
            card3filt[0].time !== null &&
            timeout3 - (Date.now() - card3filt[0].time) < 0
          ) {
            console.log("no card");
          } else {
            return interaction.editReply("Wait for your other card to run out!");
          }

          card3filt[0].points = 0;
          card3filt[0].time = Date.now();
          await Global.findOneAndUpdate(
            {},
            {
              $set: {
                "crews.$[crew].Cards.0": card3filt[0],
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

          await globalModel.save();
          await userdata.save();
          crews = globalModel?.crews;
          crewname = crew.name;
          crew2 = crews.find((crew) => crew.name == crewname);

          row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("crush_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("sting_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setStyle("Primary"),
            new ButtonBuilder()
              .setCustomId("gt_card")
              .setLabel("Add 10 Crew Respect")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setStyle("Primary")
          );

          row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("activate_crush_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["crush card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_sting_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["sting card"].emote}`)
              .setDisabled(true)
              .setStyle("Success"),
            new ButtonBuilder()
              .setCustomId("activate_gt_card")
              .setLabel("Activate")
              .setEmoji(`${cardsdb["gt card"].emote}`)
              .setDisabled(true)
              .setStyle("Success")
          );

          cards = crew2.Cards;

          card1filt = cards.filter((card) => card.name == "crush card");
          card2filt = cards.filter((card) => card.name == "sting card");
          card3filt = cards.filter((card) => card.name == "gt card");

          if (card1filt[0].points >= card1filt[0].pointsmax) {
            row2.components[0].setDisabled(false);
          }

          if (card2filt[0].points >= card2filt[0].pointsmax) {
            row2.components[1].setDisabled(false);
          }
          if (card3filt[0].points >= card3filt[0].pointsmax) {
            row2.components[2].setDisabled(false);
          }

          let embed = new EmbedBuilder()
            .setTitle(`Your crews cards`)
            .addFields(
              {
                name: `Crush Card`,
                value: `${cardsdb["crush card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card1filt[0].points}/100`,
                inline: true,
              },
              {
                name: `Sting Card`,
                value: `${cardsdb["sting card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card2filt[0].points}/200`,
                inline: true,
              },
              {
                name: `GT Card`,
                value: `${cardsdb["gt card"].emote}\n\n
          <:crewrespect:1143422770173190245> Crew Respect: ${card3filt[0].points}/500`,
                inline: true,
              }
            )
            .setImage("https://i.ibb.co/f4ChHG0/vipcards.png")
            .setColor(colors.blue);

          await interaction.editReply({ embeds: [embed], components: [row, row2] });
        }
      });
    }
  },
};
