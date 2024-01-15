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
    .setName("upgrade")
    .setDescription("Upgrade a part on your car")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Your car ID or Name to upgrade")
        .setRequired(true)
    )
    .addStringOption((option) =>
    option
      .setName("part")
      .setDescription("What you want to install")
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

    if(!userdata.parts.includes(inputUpgrade.toLowerCase())) return interaction.reply(`You don't have a ${inputUpgrade}!`)

    let partindb = partdb.Parts[inputUpgrade.toLowerCase()]

    let engine = selected[0].engine || cardb[selected[0].Name.toLowerCase()].Engine
    if(selected[0][partindb.Type] && partindb.Type !== "engine") return interaction.reply(`Your car already has a ${partindb.Type}, use /remove first!`)

    if(engine.toLowerCase() == partindb.Name.toLowerCase()) return interaction.reply(`Your car already has this engine!`)

    if(partindb.Type == "engine"){
      let hpengine = partindb.Power
      let oldhp = partdb.Parts[engine.toLowerCase()]

      let oldcarhp = selected[0].Speed

      selected[0].Speed -= oldhp.Power
      selected[0].Speed += hpengine

      console.log(selected[0].Speed)
      
      let embed = new EmbedBuilder()
      .setTitle(`Engine swap`)
      .addFields({name: "Old Engine", value: `${oldhp.Emote} ${oldhp.Name}\n${emotes.speed} HP ${oldhp.Power}`, inline: true}, {name: "New Engine", value: `${partindb.Emote} ${partindb.Name}\n${emotes.speed} HP ${hpengine}`, inline: true})
      .setDescription(`${emotes.speed} HP ${oldcarhp} -> ${selected[0].Speed}`)
      .setColor(colors.blue)
      .setImage(`${carimage}`)
      .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)

      selected[0].engine = partindb.Name.toLowerCase()

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

      userdata.parts.push(oldhp.Name.toLowerCase())

      userdata.save()
  
      return await interaction.reply({embeds: [embed]})
    }

    let acc = selected[0].Acceleration
    let newacc = acc -= partindb.Acceleration
    
    if(partindb.Handling > 0){
      selected[0].Handling += Number(partindb.Handling)
    }
    
    if(partindb.Power > 0){
      selected[0].Speed += Number(partindb.Power)
    }
    if(partindb.Acceleration > 0 && selected[0].Name !== "Snowys 2018 Koenigsegg Agera"){
    if(newacc < 2){
      selected[0].Acceleration = 2
    } 
    else {
      selected[0].Acceleration -= partindb.Acceleration

    }
  }
    if(partindb.RemoveAcceleration > 0 && selected[0].Name !== "Snowys 2018 Koenigsegg Agera"){
      selected[0].Acceleration += Number(partindb.RemoveAcceleration)
    }
    if(partindb.RemovePower > 0){
      selected[0].Power += Number(partindb.RemovePower)
    }
    if(partindb.DecreaseHandling > 0){
      selected[0].Handling -= Number(partindb.DecreaseHandling)
    }

    if(partindb.RemoveWeight > 0 && (selected[0].WeightStat - partindb.RemoveWeight >= 1000)){
      selected[0].WeightStat -= Number(partindb.RemoveWeight)
    }
    if(partindb.Weight > 0){
      selected[0].WeightStat += Number(partindb.Weight)
    }
    if(partindb.Stars > 0){
      selected[0].Rating += partindb.Stars
    }

    let partvalue = partindb.Price * 0.35
    let resale = selected[0].Resale

    selected[0].Resale = resale += partvalue

    selected[0][partindb.Type] = partindb.Name.toLowerCase()

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

    let userparts = userdata.parts

    userparts.splice(userparts.indexOf(inputUpgrade.toLowerCase()), 1);

    userdata.save()
    
    
    let embed = new EmbedBuilder()
    .setTitle(`Installed a ${partindb.Emote} ${partindb.Name}`)
    .setDescription(`${emotes.speed} ${carspeed} -> ${selected[0].Speed}\n${emotes.handling} ${carhandling} -> ${selected[0].Handling}\n${emotes.weight} ${carweight} -> ${selected[0].WeightStat}\n${emotes.acceleration} ${Math.floor(caracc * 100) / 100} -> ${Math.floor(selected[0].Acceleration * 100) / 100}`)
    .setColor(colors.blue)
    .setImage(`${carimage}`)
    .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)

    await interaction.reply({embeds: [embed]})

    if(userdata.tutorial && userdata.tutorial.started == true){
      await interaction.channel.send(`Awesome! Your car is even faster! You can buy more parts with \`/parts\` and make sure to use the \`/buy\` command to purchase them! To finish the tutorial, win a drag race and you'll get a barn map, then run \`/barn\``)
      
    }
     
  },
};
