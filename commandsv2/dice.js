

const codes = require("../data/codes.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { toCurrency, randomRange } = require("../common/utils");
const cardb = require("../data/cardb.json");
const lodash = require("lodash")
const {EmbedBuilder} = require('discord.js')
const colors = require("../common/colors")
const { tipFooterRandom } = require("../common/tips");
const Cooldowns = require("../schema/cooldowns");
const ms = require("ms")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll dice, if you roll higher than the bot you win")
    .addNumberOption((option) =>
    option
      .setName("bet")
      .setDescription("The bet amount to place")
      .setRequired(true)
  ),
  async execute(interaction) {
  
    let userdata = (await User.findOne({ id: interaction.user.id }))
    let betoption = interaction.options.getNumber("bet")

    let cooldowndata = (await Cooldowns.findOne({ id: interaction.user.id })) || new Cooldowns({ id: interaction.user.id });
    let timeout = 1800000

    if(betoption <= 0) return interaction.reply("Your bet cant be 0!")
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

    let roll1 = randomRange(2, 12)
    let roll2 = randomRange(2, 12)

    let embed = new EmbedBuilder()
    .setTitle("Dice Game")
    .addFields({name: `Your roll`, value: `${roll1}`}, {name: `Bots roll`, value: `${roll2}`})
    .setColor(colors.blue)
    .setThumbnail("https://i.ibb.co/W6sQSvF/fire-dice.png")
    .setFooter(tipFooterRandom)

    if(roll1 > roll2){
      let winnings = betoption + (betoption * 0.1)
        userdata.cash += winnings
        embed.setDescription(`You rolled: ${roll1}\nBot rolled: ${roll2}\n\nYou won ${toCurrency(winnings)}!`)
        userdata.gamblewins += 1

    }
    else if(roll2 > roll1) {
        userdata.cash -= betoption
        embed.setDescription(`You rolled: ${roll1}\nBot rolled: ${roll2}\n\nYou lost ${toCurrency(betoption)}!`)

    }
    else if(roll1 == roll2){
      embed.setDescription(`You rolled: ${roll1}\nBot rolled: ${roll2}\n\nIt was a tie! You lost ${toCurrency(betoption)}`)
    }
    userdata.gambletimes += 1
    await interaction.reply({embeds: [embed]})
    userdata.save()
    
  },
};
