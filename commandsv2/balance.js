const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const { userFindOrCreateInDB, userGetFromInteraction } = require("../common/user");
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
    const userdata = await User.findOne({ id: interaction.user.id });

    let {
      cash,
      gold,
      rp,
      ckeys,
      rkeys,
      ekeys,
      notoriety,
      wheelspins,
      lockpicks,
      swheelspins,
      achievements,
      blueprints,
      seriestickets,
      f1blueprint,
      commonCredits,
      rareCredits,
      exoticCredits,
      carver,
      barnmaps,
      t5vouchers,
    } = profile;

    let embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Balance`)
      .setColor(colors.blue)
      .setThumbnail("https://i.ibb.co/FB8RwK9/Logo-Makr-5-Toeui.png");

    if (userdata.police === false) {
      if (typeof cash === "undefined") {
        await interaction.reply(GET_STARTED_MESSAGE);
        return;
      }

      embed.setFields([
        {
          name: "Main",
          value: `
            ${emotes.cash} Z Cash: ${toCurrency(cash)}
            ${emotes.gold} Gold: ${gold}
            ${emotes.t5voucher} T5 Vouchers: ${t5vouchers}
            ${emotes.barnMapCommon} Barn Maps: ${barnmaps}
            ${emotes.wheelSpin} Wheel spins: ${wheelspins}
            ${emotes.superWheel} Super Wheel spins: ${swheelspins}
            ${emotes.blueprints} Blueprints: ${blueprints}
            ${emotes.f1blueprint} F1 Blueprints: ${f1blueprint}
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
            ${emotes.rp}  RP: ${numberWithCommas(rp)}
            🌆 Carver Cash: ${carver}
          `,
          inline: true,
        },
      ]);

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Link")
          .setEmoji("🪙")
          .setLabel("Buy Gold")
          .setURL("https://zero2sixty-store.tebex.io/"),
      
      );


      if (userdata.settings.tips === true) {
        embed.setFooter(tipFooterRandom);
      }

      if(userdata.zpass == false){
        row.addComponents(
          new ButtonBuilder()
        .setStyle("Link")
        .setEmoji("<:zpass:1200657440304283739>")
        .setLabel("Buy Z Pass")
        .setURL("https://www.patreon.com/zero2sixtybot")
        )
      }
   
        await interaction.reply({
          embeds: [embed],
          components: [row],
          content: "Make sure to check out the 2 seasonal events with /events!",
        });

      

      if (!achievements) {
        achievements = ["None"];
      }
    } else if (userdata.police === true) {
      let bountyemote = emotes.bounty;
      let bounty = userdata.bounty;

      embed
        .setTitle(`${user.username}'s Police Balance`)
        .setDescription(`${bountyemote} Bounty: ${bounty}`)
        .setThumbnail("https://i.ibb.co/6gps3DT/police.gif")
        .setFooter(tipFooterRandom)
        .addFields({
          name: "Event Items",
          value: `
            ${emotes.notoriety} Notoriety: ${numberWithCommas(notoriety)}
            ${emotes.rp}  RP: ${numberWithCommas(rp)}
          `,
          inline: true,
        });

      await interaction.reply({ embeds: [embed] });
    }
  },
};