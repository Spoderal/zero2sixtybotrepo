const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zpass")
    .setDescription("View the z pass and what it is"),

  async execute(interaction) {
    let zpass = "❌"
    let zpassrole = interaction.member.roles.cache.has('976653429801885706');
    if (zpassrole == true) {
        zpass = "✅";
      }
    let embed = new Discord.EmbedBuilder()
      .setTitle("Z Pass")
      .setDescription(`
      Buy the Z Pass [here!](https://www.patreon.com/zero2sixtybot/membership)\n
      Is Your Z Pass Active: ${zpass}\n\n**__What does it include?__**
      ⏲️ Reduced racing cooldowns to 10 seconds
      💵 2x cash from racing
      💵 2x cash from daily/weekly rewards
      🪙 100 weekly gold
      <:t5vouchers:1199876227184472145> 1 Weekly T5 Voucher

      #️⃣ Exclusive channel in the community
      🌌Premium season pass
      Be on the look out for more perks as this list will get longer!`)
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/fpqbgGT/zpass.png");

    await interaction.reply({ embeds: [embed] });
  },
};
