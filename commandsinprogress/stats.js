const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const cardb = require("../data/horsedb.json");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View the stats of a horse")
    .addStringOption((option) =>
      option
        .setName("horse")
        .setDescription("The horse to view")
        .setRequired(true)
        .addChoices(
         {name: "Arabian", value: "arabian"},
         {name: "Appaloosa", value: "appaloosa"},
         {name: "Clydesdale", value: "clydesdale"},
         {name: "Donkey", value: "donkey"},
         {name: "Dragon", value: "dragon"},
         {name: "Mustang", value: "mustang"},
         {name: "Moo Horse", value: "moo horse"},
         {name: "Unicorn", value: "unicorn"},
        {name:"Thoroughbred", value: "thoroughbred"},
        {name:"Pegasus", value: "pegasus"},
        {name: "Reindeer", value: "reindeer"},
        {name: "Trojan Horse", value: "trojan horse"},
        {name: "Seahorse", value: "seahorse"},
        {name: "Zebra", value: "zebra"},
        )
    ),
  async execute(interaction) {
    let horse = interaction.options.getString("horse");
    let horseData = cardb.Horses[horse];

    let embed = new discord.EmbedBuilder()
      .setTitle(`${horseData.Emote} ${horseData.Name}`)
      .setColor(colors.blue)
      .setImage(horseData.Image)
      .setDescription(
        `${horseData.Description}\n\nSpeed: ${horseData.Speed}\nStamina: ${horseData.Stamina}\nJump: ${horseData.Jump}\nStrength: ${horseData.Strength}`
      );

    await interaction.reply({ embeds: [embed] });
      
    },
  };