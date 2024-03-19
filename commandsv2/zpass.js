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
      .setDescription(`Buy the Z Pass [here!](https://www.patreon.com/zero2sixtybot/membership)\nIs Your Z Pass Active: ${zpass}\n\n**__What does it include?__**\n⏲️ Reduced racing cooldowns to 15 seconds\n💵 2x cash from racing\n💵 2x cash from daily/weekly rewards\n🪙 100 weekly gold\n#️⃣ Exclusive channel in the community\n🌌Premium season pass in the future\n\nBe on the look out for more perks as this list will get longer!`)
      .setColor(`#60b0f4`)
      .setThumbnail("https://i.ibb.co/fpqbgGT/zpass.png");

    await interaction.reply({ embeds: [embed] });
  },
};
