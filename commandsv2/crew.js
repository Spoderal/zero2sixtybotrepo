const db = require("quick.db");
const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const icons = require("../crewicons.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const crewicons = require("../crewicons.json");
const Global = require("../schema/global-schema");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crew")
    .setDescription("Do things with crews")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("other")
        .setDescription("Join, leave, edit and view crews")
        .addStringOption((option) =>
          option
            .setName("option")
            .setDescription("Join, create, leave, and more")
            .setRequired(true)
            .addChoice("Join", "join")
            .addChoice("Leave", "leave")
            .addChoice("View", "view")
            .addChoice("Create", "create")
            .addChoice("Global Leaderboard", "leaderboard")
            .addChoice("Set Icon (crew owner)", "icon")
            .addChoice("Delete (DANGEROUS)", "delete")
            .addChoice("Approve Icon (BOT SUPPORT)", "approveico")
        )
        .addStringOption((option) =>
          option.setName("name").setDescription("The name of the crew or icon")
        )
    ),
  async execute(interaction) {
    let subcmd = interaction.options.getSubcommand();

    let global = await Global.findOne();
    let userdata = await User.findOne({ id: interaction.user.id });

    if (subcmd == "other") {
      let option = interaction.options.getString("option");
      if (option == "view") {
        let crewname = interaction.options.getString("name");
        let crew;
        if (!crewname) {
          crew = userdata.crew;
          if (!crew)
            return interaction.reply(
              "You're not in a crew! Join one with /joincrew [crew name]"
            );
          crewname = crew.name;
        }
        let crews = global.crews;
        let crew2 = crews.filter((crew) => crew.name == crewname);
        if (!crew2[0]) return interaction.reply("That crew doesn't exist!");
        crew2 = crew2[0];
        let rpmembers = crew2.members;
        let emoji = "<:zerorp:939078761234698290>";
        var finalLb = "";
        let total = 0;
        let rparray = [];
        let newrparray = [];
        for (i in rpmembers) {
          let user = rpmembers[i];
          let newuserdata = await User.findOne({ id: user });
          let rp = newuserdata.rp || 0;

          rparray.push({ rp: rp, user: user });
          newrparray = rparray.sort((a, b) => b.rp - a.rp);
        }
        newrparray.length = 10;
        for (var i in newrparray) {
          let name = await interaction.client.users.fetch(newrparray[i].user);
          let tag = name.tag;
          total += newrparray[i].rp;
          finalLb += `**${
            newrparray.indexOf(newrparray[i]) + 1
          }.** ${tag} - **${numberWithCommas(newrparray[i].rp)}** ${emoji}\n`;
        }

        let icon = crew2.icon || icons.Icons.default;
        let mlength = crew2.members.length;
        let embed = new Discord.MessageEmbed()
          .setTitle(`Info for ${crew2.name}`)
          .setThumbnail(icon)
          .addField(
            "Information",
            `${mlength} members\n\nRank ${crew2.Rank}\n\nRP: ${total}\n\nCrew Leader: ${crew2.owner.username}#${crew2.owner.discriminator}`,
            true
          )
          .addField("Leaderboard", `${finalLb}`, true)

          .setColor("#60b0f4");

        let row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("season")
            .setEmoji("💵")
            .setLabel("Season 1")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("stats")
            .setEmoji("📊")
            .setLabel("Stats")
            .setStyle("SECONDARY")
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
                let crewseason =
                  require("../seasons.json").Seasons.Crew1.Rewards;
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
                embed.addField("Rewards", `${reward.join("\n")}`);

                await i.update({ embeds: [embed] });
              } else if (i.customId.includes("stats")) {
                embed.fields = [];
                embed
                  .setTitle(`Info for ${crew2.name}`)
                  .setThumbnail(icon)
                  .addField(
                    "Information",
                    `${crew2.members.length} members\n\nRank ${crew2.Rank}\n\nRP: ${total}\n\nCrew Leader: ${crew2.owner.username}#${crew2.owner.discriminator}`,
                    true
                  )
                  .addField("Leaderboard", `${finalLb}`, true)

                  .setColor("#60b0f4");

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
          return interaction.reply({
            content: `You don't have permission to use this command!`,
            ephemeral: true,
          });
        let crewname = interaction.options.getString("name");

        let crew2 = global.crews.filter((crew) => crew.name == crewname);
        if (!crew2[0]) return interaction.reply("That crew doesn't exist!");

        let iconchoice = crew2.icontoapprove;

        if (!iconchoice) return interaction.reply(`Wrong name!`);

        crew2.icon = iconchoice;
        global.save();

        interaction.reply(`✅`);
      } else if (option == "join") {
        let uid = interaction.user.id;
        let crewname = interaction.options.getString("name");
        if (!crewname) return interaction.reply("Please specify a crew name!");
        let crew2 = global.crews.filter((crew) => crew.name == crewname);
        if (crew2.length == 0)
          return interaction.reply("That crew doesn't exist!");
        let crew = userdata.crew;
        let actcrew = crew2[0];
        if (crew) return interaction.reply("You're already in a crew!");
        let newarray = [];
        actcrew.members.push(`${uid}`);

        newarray = actcrew.members;

        actcrew.members = newarray;
        console.log(actcrew);
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
        global.save();

        userdata.crew = crew2[0];

        userdata.rp = 0;
        userdata.joinedcrew = Date.now();
        userdata.save();

        interaction.reply(`✅ Joined ${crewname}`);
      } else if (option == "create") {
        let crewname = interaction.options.getString("name");
        let crews = global.crews;
        if (!crewname) return interaction.reply("Please specify a crew name!");
        let crew2 = crews.filter((crew) => crew.name == crewname);
        if (crew2[0]) return interaction.reply("That crew already exist!");
        let crew = userdata.crew;
        if (crew)
          return interaction.reply(
            "You're already in a crew! If you're a member, leave with /crew leave, and if you're the owner, delete it with /crew delete"
          );

        let crewobj = {
          name: crewname,
          members: [interaction.user.id],
          owner: interaction.user,
          icon: icons.Icons.default,
          Rank: 1,
          RP: 0,
        };

        global.crews.push(crewobj);
        global.save();
        userdata.crew = crewobj;
        userdata.save();
        let embed = new Discord.MessageEmbed()
          .setTitle(`${crewname}`)
          .setThumbnail(crewicons.Icons.Default)
          .setDescription(
            `✅ Created a crew with the name ${crewname}, and the owner as <@${interaction.user.id}>`
          )
          .setColor("#60b0f4");

        interaction.reply({ embeds: [embed] });
      } else if (option == "leave") {
        let uid = interaction.user.id;
        let crew = userdata.crew;
        if (!crew) return interaction.reply("You're not in a crew!");
        let crews = global.crews;
        let crewname = crew.name;
        let crew2 = crews.filter((crew) => crew.name == crewname);
        if (!crew2[0]) return interaction.reply("That crew doesn't exist!");

        if (crew2[0].owner.id == uid)
          return interaction.reply(
            `You're the owner! Run /crew delete to delete this crew`
          );

        interaction.reply(
          "Are you sure? Say yes to confirm, and anything else to cancel."
        );
        const filter = (m = Discord.Message) => {
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
            await User.findOneAndUpdate(
              {
                id: uid,
              },
              {
                unset: crew,
              }
            );
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
            userdata.save();
            global.save();
            m.react("✅");
          } else {
            return interaction.channel.send("❌");
          }
        });
      } else if (option == "icon") {
        let crews = global.crews;
        let crewname = userdata.crew;
        if (!crewname) return interaction.reply("You are not in a crew!");
        let crew2 = crews.filter((crew) => crew.name == crewname);
        if (!crew2[0]) return interaction.reply("That crew doesn't exist!");
        if (crew2.ownerid !== interaction.user.id)
          return interaction.reply("You're not the crew owner!");

        interaction.reply(
          "What crew icon would you like to submit? **Send an image below**"
        );
        const filter = (m = discord.Message) => {
          return m.author.id === interaction.user.id;
        };
        let collector = interaction.channel.createMessageCollector({
          filter,
          max: 1,
          time: 1000 * 30,
        });
        collector.on("collect", (m) => {
          let ImageLink;
          if (m.attachments.size > 0) {
            m.attachments.forEach((attachment) => {
              ImageLink = attachment.url;
            });
            let embed = new Discord.MessageEmbed()
              .setImage(ImageLink)
              .setDescription("Crew icon submitted for review!")
              .addField(`Crew Name`, `${crewname}`)
              .setColor("#60b0f4");
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
        interaction.reply({ content: `Please wait...`, fetchReply: true });

        let data = global.crews;
        let members = [];
        for (let obj of data) {
          console.log(obj);
          try {
            members.push(obj);
          } catch (err) {
            console.log(err);
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
        let embed = new Discord.MessageEmbed()
          .setTitle("Crew Leaderboard")
          .setColor("#60b0f4")
          .setDescription(desc);

        setTimeout(() => {
          interaction.editReply({ embeds: [embed] });
        }, 3000);
      } else if (option == "delete") {
        let uid = interaction.user.id;
        let crews = global.crews;
        let crew = userdata.crew;
        let crewname = crew.name;
        let crew2 = crews.filter((crew) => crew.name == crewname);
        if (!crew2[0]) return interaction.reply("That crew doesn't exist!");
        if (crew2[0].owner.id !== uid)
          return interaction.reply("You're not the crew owner!");

        let crewlist = global.crews;

        interaction.reply(
          "Are you sure? This will permanently remove all perks from all members. Say yes to confirm, and anything else to cancel."
        );
        const filter = (m = Discord.Message) => {
          return m.author.id === interaction.user.id;
        };
        let collector = interaction.channel.createMessageCollector({
          filter,
          max: 1,
          time: 1000 * 30,
        });
        collector.on("collect", (m) => {
          if (m.content.toLowerCase() == "yes") {
            let crewobj = crew2[0];
            for (var i = 0; i < 1; i++)
              crewlist.splice(crewlist.indexOf(crewobj), 1);
            global.crews = crewlist;
            global.save();
          }
        });
      }
    }
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
