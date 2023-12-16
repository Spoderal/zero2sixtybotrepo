const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;
const parttiersdb = require("../data/parttiers.json");
const { toCurrency } = require("../common/utils");
const emotes = require("../common/emotes").emotes
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a part on your car")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Your car ID or Name")
        .setRequired(true)
    )
    .addStringOption((option) =>
    option
      .setName("part")
      .setDescription("What you want to remove")
      .setRequired(true)
  )
    ,

  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let inputUpgrade = interaction.options.getString("part");

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let usercars = userdata.cars || [];
    let cooldowns =
    (await Cooldowns.findOne({ id: interaction.user.id })) ||
    new Cooldowns({ id: interaction.user.id });
    let selected = usercars.filter(
      (car) =>
        car.Name.toLowerCase() == inputCarIdOrName.toLowerCase() ||
        car.ID == inputCarIdOrName
    );

    let timeout3 = 30000

    cooldowns.upgrading = Date.now()

    cooldowns.save()



    if (selected.length == 0)
      return interaction.reply(
        "Thats not a car! Make sure to specify a car ID, or car name"
      );
    let carimage =  selected[0].Image || cardb[selected[0].Name.toLowerCase()].Image;
    let carspeed = selected[0].Speed
    let caracc = selected[0].Acceleration
    let carhandling = selected[0].Handling
    let carweight = selected[0].WeightStat


    let partindb = partdb.Parts[inputUpgrade.toLowerCase()]

    if(!selected[0][partindb.Type] || selected[0][partindb.Type] == null) return interaction.reply(`Your car doesn't have a ${partindb.Type}, use /upgrade first!`)

    let acc = selected[0].Acceleration
    let newacc = acc -= partindb.Acceleration
    
    if(partindb.Handling > 0){
      selected[0].Handling -= Number(partindb.Handling)
    }
    if(partindb.Power > 0){
      selected[0].Speed -= Number(partindb.Power)
    }
    if(partindb.Acceleration > 0){
      
      selected[0].Acceleration += (Math.floor(partindb.Acceleration * 100) / 100)
    }
    if(partindb.RemoveAcceleration > 0){
      if(newacc < 2){
        selected[0].Acceleration = 2
      } 
      else {
        selected[0].Acceleration -= (Math.floor(partindb.RemoveAcceleration * 100) / 100)

      }
    }
    if(partindb.RemovePower > 0){
      selected[0].Power -= Number(partindb.RemovePower)
    }
    if(partindb.DecreaseHandling > 0){
      selected[0].Handling += Number(partindb.DecreaseHandling)
    }

    if(partindb.RemoveWeight > 0){
      selected[0].WeightStat += Number(partindb.RemoveWeight)
    }
    if(partindb.Weight > 0 && (selected[0].WeightStat - partindb.Weight >= 1000)){
      selected[0].WeightStat -= Number(partindb.Weight)
    }
    if(partindb.Stars > 0){
      selected[0].Rating -= Number(partindb.Stars)
    }
    userdata.parts.push(selected[0][partindb.Type.toLowerCase()])

    selected[0][partindb.Type] = null

    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": selected[0],
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": selected[0].Name,
          },
        ],
      }
    );


    userdata.save()

    
    let embed = new EmbedBuilder()
    .setTitle(`Removed ${partindb.Emote} ${partindb.Name}`)
    .setDescription(`${emotes.speed} ${carspeed} -> ${selected[0].Speed}\n${emotes.handling} ${carhandling} -> ${selected[0].Handling}\n${emotes.weight} ${carweight} -> ${selected[0].WeightStat}\n${emotes.acceleration} ${Math.floor(caracc * 100) / 100} -> ${Math.floor(selected[0].Acceleration * 100) / 100}`)
    .setColor(colors.blue)
    .setImage(`${carimage}`)
    .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)

    await interaction.reply({embeds: [embed]})
     
  },
};
