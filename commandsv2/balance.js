
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
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
const User = require("../schema/profile-schema");

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
    let userdata = await User.findOne({ id: interaction.user.id });

    let {
      cash,
      gold,
      rp4,
      ckeys,
      rkeys,
      ekeys,
      notoriety,
      wheelspins,
      lockpicks: lockpicks,
      swheelspins,
      achievements,
      blueprints,
      evkeys,
      bounty,
      seriestickets,
      commonCredits,
      rareCredits,
      exoticCredits,
      moontokens,
      snowflakes,
      zcandy,
      barnmaps,
    } = profile;

    if (userdata.police == false) {
      if (typeof cash === "undefined") {
        await interaction.reply(GET_STARTED_MESSAGE);
      } else {
        let embed = new EmbedBuilder()
          .setTitle(`${user.username}'s Balance`)

          .setColor(colors.blue)
          .setThumbnail("https://i.ibb.co/FB8RwK9/Logo-Makr-5-Toeui.png")
          .setFooter(tipFooterRandom)
          .setFields([
            {
              name: "Main",
              value: `
              ${emotes.cash} Z Cash: ${toCurrency(cash)}
              
              ${emotes.gold} Gold: ${gold}
    
              ${emotes.bounty} Bounty: ${bounty}
  
              ${emotes.barnMapCommon} Barn Maps: ${barnmaps}
  
              ${emotes.wheelSpin} Wheel spins: ${wheelspins}  
              
              ${emotes.superWheel} Super Wheel spins: ${swheelspins}  
              
              ${emotes.blueprints} Blueprints: ${blueprints}

          ${emotes.seriestickets} Series Tickets: ${seriestickets}
              `,
              inline: true,
            },
            {
              name: "Keys",
              value: `
              ${emotes.commonKey} Common: ${ckeys} 
              *Credits: ${commonCredits}*

              ${emotes.rareKey} Rare: ${rkeys} 
              *Credits: ${rareCredits}*

              ${emotes.exoticKey} Exotic: ${ekeys} 
              *Credits: ${exoticCredits}*

              <:lockpick:1040384727691051170> Lockpicks: ${lockpicks}
              `,
              inline: true,
            },
            {
              name: "Event Items",
              value: `
              ${emotes.notoriety} Notoriety: ${numberWithCommas(notoriety)}
              
              ${emotes.rp}  RP: ${numberWithCommas(rp4)}

              ${emotes.moontokens}  Moon Tokens: ${numberWithCommas(moontokens)}

              <:key_limited:1103923572063354880> Fictional Keys: ${userdata.evkeys} 
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
          `,
            inline: true,
          },
        ]);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
