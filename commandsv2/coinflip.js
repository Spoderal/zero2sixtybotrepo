

const codes = require("../data/codes.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { toCurrency } = require("../common/utils");
const cardb = require("../data/cardb.json");
const lodash = require("lodash")
const Cooldowns = require("../schema/cooldowns");
const ms = require("ms")
const {EmbedBuilder} = require("discord.js")
const colors = require("../common/colors")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin to earn cash")
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("The side to guess")
        .setRequired(true)
        .addChoices(
            {name: "Heads", value: "heads"},
            {name: "Tails", value: "tails"}
        )
    )
    .addNumberOption((option) =>
    option
      .setName("bet")
      .setDescription("The bet amount to place")
      .setRequired(true)
  ),
  async execute(interaction) {
  
    let userdata = (await User.findOne({ id: interaction.user.id }))
    let sideoption = interaction.options.getString("side")
    let betoption = interaction.options.getNumber("bet")
    let cooldowndata = (await Cooldowns.findOne({ id: interaction.user.id })) || new Cooldowns({ id: interaction.user.id });
    let timeout = 1800000
    if(betoption > 1000000) return interaction.reply("The max you can bet is $1M")

    if (
        cooldowndata.gamble !== null &&
        timeout - (Date.now() - cooldowndata.gamble) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata.gamble));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can gamble again in ${time}`);
        return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      }
    
    if(betoption <= 0) return interaction.reply("Your bet cant be 0!")

    let sides = ["heads", "tails"]

    let side = lodash.sample(sides)

    if(side == sideoption.toLowerCase()){
      let winnings = betoption += (betoption * 0.1)
      interaction.reply(`It landed on ${side}! You won ${toCurrency(winnings)}`)
        userdata.cash += winnings
        userdata.gamblewins += 1
    }
    else {
        userdata.cash -= betoption
        
        interaction.reply(`It landed on ${side}! You lost ${toCurrency(betoption)}`)
    }
    userdata.gambletimes += 1
    cooldowndata.gamble = Date.now()
    cooldowndata.save()
    userdata.save()
  },
};
