const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ActionRow,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const {
  userFindOrCreateInDB,
  userGetFromInteraction,
} = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Check your balance")
    .addStringOption((option) =>
      option
        .setName("convert")
        .setDescription("Convert bounty to cash")
        .setRequired(false)
        .addChoices({ name: "Bounty to Cash", value: "bountytocash" })
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user id to check")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = userGetFromInteraction(interaction);
    const profile = await userFindOrCreateInDB(user);
    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id });
    let covertoption = await interaction.options.getString("convert");

    if (covertoption) {
      if (userdata.bounty == 0)
        return interaction.reply("You don't have any bounty!");
      let prestigerank = userdata.prestige || 0;
      let bountycooldown = prestigerank * 1000;
      let converted = cooldowndata.convert;

      if (converted !== null && bountycooldown - (Date.now() - converted) > 0) {
        let time = ms(bountycooldown - (Date.now() - converted));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(
            `You need to wait ${time} before converting your bounty.`
          );
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
      let bountyc = userdata.bounty
      let toconvert = bountyc / 2
      userdata.cash += toconvert;

      userdata.bounty = 0;
      cooldowndata.convert = Date.now();
      cooldowndata.save();
      userdata.save();

      interaction.reply(`You received ${toCurrency(toconvert)} (50% of your bounty)`);

      return;
    }

    let {
      cash,
      gold,
      rp4,
      cmaps: barnmaps,
      rmaps: rbarnmaps,
      lmaps: lbarnmaps,
      ckeys,
      rkeys,
      ekeys,
      fkeys,
      dkeys2: dkeys,
      notoriety,
      wheelspins,
      lockpicks: lockpicks,
      swheelspins,
      moontokens,
      stockpoints,
      achievements,
      blueprints,
      f1blueprints,
      spacetokens,
      foolskeys,
      lekeys,
      bounty,
    } = profile;

    if (userdata.police == false) {
      if (typeof cash === "undefined") {
        await interaction.reply(GET_STARTED_MESSAGE);
      } else {
        let embed = new EmbedBuilder()
          .setTitle(`${user.username}'s Balance`)
          .setDescription(
            `
            ${emotes.cash} Z Cash: ${toCurrency(cash)} \u200b ${
              emotes.gold
            } Gold: ${gold}
  
            ${emotes.bounty} Bounty: ${bounty}

            ${emotes.wheelSpin} Wheel spins: ${wheelspins}  
            
            ${emotes.superWheel} Super Wheel spins: ${swheelspins}  
            
            ${emotes.blueprints} Blueprints: ${blueprints}\n
            `
          )
          .setColor(colors.blue)
          .setThumbnail("https://i.ibb.co/FB8RwK9/Logo-Makr-5-Toeui.png")
          .setFooter(tipFooterRandom)
          .setFields([
            {
              name: "Barn Maps",
              value: `
                ${emotes.barnMapCommon} Common: ${numberWithCommas(barnmaps)}
                ${emotes.barnMapRare} Rare: ${numberWithCommas(rbarnmaps)}
                ${emotes.barnMapLegendary} Legendary: ${numberWithCommas(
                lbarnmaps
              )}
              `,
              inline: true,
            },
            {
              name: "Keys",
              value: `
              ${emotes.commonKey} Common: ${ckeys}
              ${emotes.rareKey} Rare: ${rkeys}
              ${emotes.exoticKey} Exotic: ${ekeys}
              <:lockpick:1040384727691051170> Lockpicks: ${lockpicks}
              `,
              inline: true,
            },
            {
              name: "Event Items",
              value: `
              ${emotes.notoriety} Notoriety: ${numberWithCommas(notoriety)}
              ${emotes.rp}  RP: ${numberWithCommas(rp4)}
              ${emotes.lekey} Le Keys: ${numberWithCommas(lekeys)}
              `,
              inline: true,
            },
          ]);
        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle("Link")
            .setEmoji("🪙")
            .setLabel("Buy Gold")
            .setURL("https://zero2sixty-store.tebex.io/")
        );

        await interaction.reply({
          embeds: [embed],
          components: [row],
          content: "Make sure to check out the 2 seasonal events with /events!",
        });
        if (!achievements) {
          achievements = ["None"];
        }

        let richFiltered = userdata.achievements.filter(
          (achievement) => achievement.name == "Rich"
        );
        if (richFiltered.length == 0 && interaction.user.id == userdata.id) {
          console.log("none");
          userdata.achievements.push({
            name: "Rich",
            id: "rich",
            completed: false,
          });
          userdata.markModified("achievements");
          userdata.update();
        }
        let richFiltered2 = userdata.achievements.filter(
          (achievement) => achievement.name == "Richer"
        );
        if (richFiltered2.length == 0 && interaction.user.id == userdata.id) {
          console.log("none");
          userdata.achievements.push({
            name: "Richer",
            id: "richer",
            completed: false,
          });
          userdata.markModified("achievements");
          userdata.update();
        }
        let richFiltered3 = userdata.achievements.filter(
          (achievement) => achievement.name == "Richest"
        );
        if (richFiltered3.length == 0 && interaction.user.id == userdata.id) {
          console.log("none");
          userdata.achievements.push({
            name: "Richest",
            id: "richest",
            completed: false,
          });
          userdata.markModified("achievements");
          userdata.update();
        }

        if (
          richFiltered.length !== 0 &&
          cash >= 100000 &&
          richFiltered[0].completed !== true &&
          interaction.user.id == userdata.id
        ) {
          interaction.followUp(
            `New achievement! <:achievement_rich:1031826566151409715> You received ${toCurrency(
              achievementsdb.Achievements["rich"].Reward
            )}`
          );
          richFiltered[0].completed = true;
          userdata.cash += achievementsdb.Achievements["rich"].Reward;
          userdata.update();
          userdata.markModified("achievements");
        }

        if (
          richFiltered2.length !== 0 &&
          cash >= 1000000 &&
          richFiltered2[0].completed !== true &&
          interaction.user.id == userdata.id
        ) {
          interaction.followUp(
            `New achievement! <:achievement_richer:1031826565207707648> You received ${toCurrency(
              achievementsdb.Achievements["richer"].Reward
            )}`
          );
          richFiltered2[0].completed = true;
          userdata.cash += achievementsdb.Achievements["richer"].Reward;
          userdata.update();
          userdata.markModified("achievements");
        }
        if (
          richFiltered3.length !== 0 &&
          cash >= 1000000000 &&
          richFiltered3[0].completed !== true &&
          interaction.user.id == userdata.id
        ) {
          interaction.followUp(
            `New achievement! <:achievement_richest:1031826564050071603> You received ${toCurrency(
              achievementsdb.Achievements["richest"].Reward
            )}`
          );
          richFiltered3[0].completed = true;
          userdata.cash += achievementsdb.Achievements["richest"].Reward;
          userdata.update();
          userdata.markModified("achievements");
        }

        userdata.save();
      }
    } else if (userdata.police == true) {
      let bountyemote = emotes.bounty;
      let bounty = userdata.bounty;
      let embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Police Balance`)
        .setDescription(
          `
        ${bountyemote} Bounty: ${bounty}
        `
        )
        .setColor(colors.blue)
        .setThumbnail("https://i.ibb.co/6gps3DT/police.gif")
        .setFooter(tipFooterRandom)
        .setFields([
          {
            name: "Event Items",
            value: `
          ${emotes.notoriety} Notoriety: ${numberWithCommas(notoriety)}
          ${emotes.rp}  RP: ${numberWithCommas(rp4)}
          ${emotes.lekey} Le Keys: ${numberWithCommas(lekeys)}
          `,
            inline: true,
          },
        ]);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
