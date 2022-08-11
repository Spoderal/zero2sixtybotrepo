const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const {
  userFindOrCreateInDB,
  userGetFromInteraction,
} = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Check your balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user id to check")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = userGetFromInteraction(interaction);
    const profile = await userFindOrCreateInDB(user);
    const {
      cash,
      gold,
      rp,
      cmaps: barnmaps,
      ucmaps: ubarnmaps,
      rmaps: rbarnmaps,
      lmaps: lbarnmaps,
      ckeys,
      rkeys,
      ekeys,
      dkeys,
      bank,
      banklimit,
      noto: notoriety,
      wheelspins,
      swheelspins,
    } = profile;

    if (typeof cash === "undefined") {
      interaction.reply(
        "You haven't started yet! Use `/start` to create a profile and begin!"
      );
    } else {
      let embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(
          `
          ${emotes.cash} Z Cash: ${toCurrency(cash)}\n
          ${emotes.bank} Bank: ${toCurrency(bank)}/${toCurrency(banklimit)}\n
          ${emotes.gold} Gold: ${gold}\n
          ${emotes.rp} RP: ${numberWithCommas(rp)}\n
          ${emotes.wheelSpin} Wheel spins: ${wheelspins}\n
          ${emotes.superWheel} Super Wheel spins: ${swheelspins}\n
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
              ${emotes.barnMapUncommon} Uncommon: ${numberWithCommas(ubarnmaps)}
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
              ${emotes.dirftKey} Drift: ${dkeys}
            `,
            inline: true,
          },
          {
            name: "Event Items",
            value: `
              ${emotes.notoriety} Notoriety: ${numberWithCommas(notoriety)}
            `,
            inline: true,
          },
        ]);

      interaction.reply({ embeds: [embed] });
    }
  },
};
