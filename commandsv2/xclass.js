const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const {EmbedBuilder} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xclass")
    .setDescription("View information about X Class cars"),
  async execute(interaction) {
   
    let embed = new EmbedBuilder()
    .setTitle("X Class Cars")
    .setDescription(`X Class cars are a way to get extra stats on your cars, like prestige`)
    .addFields({name: "How to get X Class cars", value: `**Requires Prestige 2**\n\nXessence is a must have if you want to prestige your car, the required amount for each class varies, see below
    D Class: 1000\n
    C Class: 2000\n
        B Class: 3000\n
        A Class: 4000\n
        S Class: 5000\n
        Xessence only applies to the car you're trying to prestige, you can't use Xessence from another car to prestige a different car\n
        You can get xessence for cars by racing with the car you want to prestige\n
        You can get X Class cars by prestiging the car. You can prestige your car by running \`/prestige car\``})
        .setColor(colors.blue)
        
    await interaction.reply({ embeds: [embed] });
  },
};
