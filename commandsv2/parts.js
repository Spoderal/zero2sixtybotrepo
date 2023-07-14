const cars = require("../data/cardb.json");
const {EmbedBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fuseparts")
    .setDescription("View fuse parts on a car")
    .addStringOption((option) =>
      option
        .setDescription("The car to view")
        .setName("car")
        .setRequired(true)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let uid = interaction.user.id;

    let caroption = interaction.options.getString("car");

    let ucars = userdata.cars;
    let uparts = userdata.parts;

    let selected = ucars.filter((car) => car.ID == caroption.toLowerCase());

    if (!selected[0])
      return interaction.reply(
        `Thats not a car! Did you make sure to put the cars ID?`
      );


      let turbo = selected[0].turboupgrade
      let weight = selected[0].weightupgrade
     let springs = selected[0].springs

     let fuses = []
     if(turbo){
        fuses.push(`${partdb.Parts[turbo.toLowerCase()].Emote} ${partdb.Parts[turbo.toLowerCase()].Name}`)
     }
     if(weight){
        fuses.push(`${partdb.Parts[weight.toLowerCase()].Emote} ${partdb.Parts[weight.toLowerCase()].Name}`)
     }
     if(springs){
        fuses.push(`${partdb.Parts[springs.toLowerCase()].Emote} ${partdb.Parts[springs.toLowerCase()].Name}`)
     }

     if(fuses.length == 0){
        fuses = ["No fuse parts!"]
     }

     let embed = new EmbedBuilder()
     .setTitle(`Fuse parts on ${selected[0].Name}`)
     .setDescription(`${fuses.join('\n')}`)
      .setColor(`${colors.blue}`)
      


      interaction.reply({embeds: [embed]})
  },
};
