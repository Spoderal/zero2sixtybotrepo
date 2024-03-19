const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas, toCurrency } = require("../common/utils");
const {userGetFromInteraction } = require("../common/user");
const { tipFooterRandom } = require("../common/tips");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const User = require("../schema/profile-schema");

const { GET_STARTED_MESSAGE } = require("../common/constants");
const createEmbed = (user, title, thumbnail, fields, footer) => {
  let embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(colors.blue)
    .setThumbnail(thumbnail)
    .setFields(fields);

  if (footer) {
    embed.setFooter(footer);
  }

  return embed;
};

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
    try{

    
    const user = userGetFromInteraction(interaction);
    const profile = await User.findOne({ id: user.id });

    if(!profile){
      return interaction.reply({content: GET_STARTED_MESSAGE, ephemeral: true})
    }

    let embed;
    let title;
    let thumbnail;
    let fields = [];
    let footer;
    let zpass = profile.zpass

    const balance =
  `${emotes.cash} Z Cash: ${toCurrency(profile.cash)}\n`
  + `${emotes.gold} Gold: ${numberWithCommas(profile.gold)}\n`
  + `${emotes.pvptokens} PVP Tokens: ${numberWithCommas(profile.pvptokens)}\n`
  + `${emotes.t5voucher} T5 Vouchers: ${numberWithCommas(profile.t5vouchers)}\n`
  + `${emotes.barnMapCommon} Barn Maps: ${numberWithCommas(profile.barnmaps)}\n`
  + `${emotes.wheelSpin} Wheel spins: ${numberWithCommas(profile.wheelspins)}\n`
  + `${emotes.superWheel} Super Wheel spins: ${numberWithCommas(profile.swheelspins)}\n`
  + `${emotes.blueprints} Blueprints: ${numberWithCommas(profile.blueprints)}\n`
  + `${emotes.f1blueprint} F1 Blueprints: ${numberWithCommas(profile.f1blueprint)}\n`
  + `${emotes.seriestickets} Series Tickets: ${profile.seriestickets}\n`
  + `${emotes.xessence} Xessence: ${profile.xess}\n`
  + `||Whats this? An egg? <:egg_green:1219112556426428547> : \`CODE: GRASSGREENER\`||`

  const eventbalance = `${emotes.notoriety} Notoriety: ${numberWithCommas(profile.notoriety)}\n` +
  `${emotes.rp} RP: ${numberWithCommas(profile.rp)}\n` + `<:tracklegends:1072357967652995174> Track Keys: ${numberWithCommas(profile.trackkeys)}\n` 
  + `<:key_mclaren:1211175403071348766> McLaren Keys: ${profile.mKeys}\n` + `<:key_z:1140029565360668783> ${numberWithCommas(profile.zkeys)}` 


  const keybalance = `${emotes.commonKey} Common: ${numberWithCommas(profile.ckeys)}\n` +
  `${emotes.rareKey} Rare: ${numberWithCommas(profile.rkeys)}\n` +
  `${emotes.exoticKey} Exotic: ${numberWithCommas(profile.ekeys)}\n` +
  `<:lockpick:1040384727691051170> Lockpicks: ${numberWithCommas(profile.lockpicks)}\n`+ `${emotes.dirftKey} Drift Keys: ${profile.driftKeys}`


    title = `${user.username}'s Balance`;
    thumbnail = "https://i.ibb.co/rxsQk7R/icons8-cash-240.png";
    fields = [ {
      name: "Main",
      value: `${balance}`,
      inline: true,
    },
    {
      name: "Keys",
      value: `
       ${keybalance}
      `,
      inline: true,
    },
    {
      name: "Event Items",
      value: `
        ${eventbalance}
      `,
      inline: true,
    }]; // Add your fields here
    footer = profile.settings.tips === true ? tipFooterRandom : null;
    embed = createEmbed(user, title, thumbnail, fields, footer);



      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Link")
          .setEmoji("🪙")
          .setLabel("Buy Gold")
          .setURL("https://zero2sixty-store.tebex.io/"),
      
      );


      if (profile.settings.tips === true) {
        embed.setFooter(tipFooterRandom);
      }

      if(zpass == false){
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
          components: [row]
        });

        if(profile.tutorial && profile.tutorial.started == true && profile.tutorial.stage == 3 && profile.tutorial.type == "starter"){
          let tut = profile.tutorial
          tut.stage += 1
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "tutorial": tut,
              },
            },
    
          );
  
          interaction.channel.send(`**TUTORIAL:** You now know how to see your rewards from races, now you can buy a new upgrade for your car! Run \`/dealer parts\` to see the available upgrades`)
        }
      }
      catch(err){
        return console.log(err)
      }
    
  },
};