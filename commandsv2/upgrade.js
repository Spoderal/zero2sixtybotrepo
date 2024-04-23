const { EmbedBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;
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

      let selectedmany = usercars.filter((car) => car.Name.toLowerCase() == selected[0].Name.toLowerCase() || car.ID == selected[0].ID)
      if(selectedmany.length > 1) return interaction.reply("You have multiple cars with the same ID/Name, please sell some of them until you only have 1")

    let carimage =  selected[0].Image || cardb[selected[0].Name.toLowerCase()].Image;
    let carspeed = selected[0].Speed
    let caracc = selected[0].Acceleration
    let carhandling = selected[0].Handling
    let carweight = selected[0].WeightStat

    if(!userdata.parts.includes(inputUpgrade.toLowerCase())) return interaction.reply(`You don't have a ${inputUpgrade}!`)

    let partindb = partdb.Parts[inputUpgrade.toLowerCase()]

    let engine = selected[0].engine || cardb[selected[0].Name.toLowerCase()].Engine
    let drivetrain = selected[0].drivetrain || cardb[selected[0].Name.toLowerCase()].Drivetrain

    if(engine == null){
      engine = cardb[selected[0].Name.toLowerCase()].Engine
    }
    if(drivetrain == null){
      drivetrain = cardb[selected[0].Name.toLowerCase()].Drivetrain
    }
    console.log(engine)
    if(selected[0][partindb.Type] && partindb.Type !== "engine" && partindb.Type !== "gastank" && partindb.Type !== "drivetrain") return interaction.reply(`Your car already has a ${partindb.Type}, use /remove first!`)
    let oldpart = selected[0][partindb.Type]
    if(engine.toLowerCase() == partindb.Name.toLowerCase()) return interaction.reply(`Your car already has this engine!`)
    if(drivetrain.toLowerCase() == partindb.Name.toLowerCase()) return interaction.reply(`Your car already has this drivetrain!`)
    if(partindb.JunkOnly) return interaction.reply("You cant upgrade your car with this")

    let partvalue = partindb.Price * 0.35
    let resale = selected[0].Resale
    let oldresale = 0



    if(partvalue == 0){
      if(partindb.Tier == "X"){
        partvalue = 50000
      }
      else {
        partvalue = Number(partindb.Tier) * 5000

      }
    }
    
    let oldresalecar = selected[0].Resale
    if(oldresalecar == 0 || !oldresalecar || oldresalecar == null || oldresalecar == undefined){
      oldresalecar = cardb[selected[0].Name.toLowerCase()].Price * 0.75
      resale = cardb[selected[0].Name.toLowerCase()].Price * 0.75
      if(oldresalecar == 0){
        resale = Number(cardb[selected[0].Name.toLowerCase()].sellprice)
        oldresalecar = Number(cardb[selected[0].Name.toLowerCase()].sellprice)
      }
    }
    if(partindb.Type == "engine"){
      if(oldpart == undefined || oldpart == null){
          oldpart = cardb[selected[0].Name.toLowerCase()].Engine
      }
      console.log(oldpart)
        oldresale = partdb.Parts[oldpart.toLowerCase()].Price * 0.35
  
        if(oldresale == 0){
          oldresale = Number(partindb.Tier) * 5000
        }
      
      let hpengine = partindb.Power
      let handlingengine = partindb.Handling
      console.log(engine.toLowerCase())
      let oldhp = partdb.Parts[engine.toLowerCase()]
      let oldcarhp = selected[0].Speed
      let oldcarweight = selected[0].WeightStat

      console.log(`old value ${oldresale}`)
      selected[0].Speed -= oldhp.Power
      selected[0].Speed += hpengine

      console.log(resale)

     
      oldresalecar -= oldresale
      console.log(resale)
      
      oldresalecar += partvalue
      console.log(resale)
      
      console.log(`part value ${partvalue}`)

      selected[0].Resale = oldresalecar

      if(oldhp.Weight && oldhp.Weight > 0){
        selected[0].WeightStat -= Number(oldhp.Weight)
      }
      if(oldhp.RemoveWeight && oldhp.RemoveWeight > 0){
        selected[0].WeightStat += Number(oldhp.RemoveWeight)
      }
      if(partindb.Weight && partindb.Weight > 0){
        selected[0].WeightStat += Number(partindb.Weight)
      }
      if(partindb.RemoveWeight && partindb.RemoveWeight > 0){
        selected[0].WeightStat -= Number(partindb.RemoveWeight)
      }

      console.log(resale)

      let embed = new EmbedBuilder()
      .setTitle(`Engine swap`)
      .addFields({name: "Old Engine", value: `${oldhp.Emote} ${oldhp.Name}\n${emotes.speed} HP ${oldhp.Power}`, inline: true}, {name: "New Engine", value: `${partindb.Emote} ${partindb.Name}\n${emotes.speed} HP ${hpengine}`, inline: true})
      .setDescription(`${emotes.speed} HP ${oldcarhp} -> ${selected[0].Speed}\n${emotes.weight} Weight ${oldcarweight} -> ${selected[0].WeightStat}\nValue: ${toCurrency(resale)} -> ${toCurrency(oldresalecar)}`)
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

      let userparts = userdata.parts
      for (var i2 = 0; i2 < 1; i2++)  userparts.splice(userparts.indexOf(inputUpgrade.toLowerCase()), 1);
      userdata.parts = userparts


      userdata.parts.push(oldhp.Name.toLowerCase())



      await userdata.save()
  
      return await interaction.reply({embeds: [embed]})
    }

  else if(partindb.Type == "gastank"){
      let newgas = partindb.Gas
      let oldgas = selected[0].gastank || "default"
      let oldmax = selected[0].MaxGas
      selected[0].MaxGas = newgas
      
      
      let embed = new EmbedBuilder()
      .setTitle(`GasTank swap`)
      .setDescription(`⛽ Gas ${oldmax} -> ${selected[0].MaxGas}`)
      .setColor(colors.blue)
      .setImage(`${carimage}`)
      .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)
      
      selected[0].gastank = partindb.Name.toLowerCase() 

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
      for (var i3 = 0; i3 < 1; i3++)  userparts.splice(userparts.indexOf(inputUpgrade.toLowerCase()), 1);
      userdata.parts = userparts
 
      if(oldgas !== "default"){
        userdata.parts.push(oldgas)

      }

      await userdata.save()
  
      return await interaction.reply({embeds: [embed]})
    }
   else if(partindb.Type == "drivetrain"){
      if(oldpart == undefined || oldpart == null){
          oldpart = cardb[selected[0].Name.toLowerCase()].Drivetrain
      }
      console.log(oldpart)
        oldresale = partdb.Parts[oldpart.toLowerCase()].Price * 0.35
  
        if(oldresale == 0){
          oldresale = Number(partindb.Tier) * 5000
        }
      
      let hpdrivetrain = partindb.Power
      console.log(drivetrain.toLowerCase())
      let oldhp = partdb.Parts[drivetrain.toLowerCase()]
      let oldcarhp = selected[0].Speed
      let oldcarhandling = selected[0].Handling
      let oldcaracceleration = selected[0].Acceleration
      let oldcarweight = selected[0].WeightStat

      console.log(`old value ${oldresale}`)
      selected[0].Speed -= oldhp.Power
      selected[0].Speed += hpdrivetrain

      oldresalecar -= oldresale
      console.log(resale)
      
      oldresalecar += partvalue
      console.log(resale)
      
      console.log(`part value ${partvalue}`)

      selected[0].Resale = oldresalecar

      if(oldhp.Weight && oldhp.Weight > 0){
        selected[0].WeightStat -= Number(oldhp.Weight)
      }
      if(oldhp.RemoveWeight && oldhp.RemoveWeight > 0){
        selected[0].WeightStat += Number(oldhp.RemoveWeight)
      }
      if(oldhp.Handling && oldhp.Handling > 0){
        selected[0].Handling -= Number(oldhp.Handling)
      }
      if(oldhp.Acceleration && oldhp.Acceleration > 0){
        selected[0].Acceleration += Number(oldhp.Acceleration)
      }
      if(partindb.Weight && partindb.Weight > 0){
        selected[0].WeightStat += Number(partindb.Weight)
      }
      if(partindb.RemoveWeight && partindb.RemoveWeight > 0){
        selected[0].WeightStat -= Number(partindb.RemoveWeight)
      }
      if(partindb.Handling && partindb.Handling > 0){
        selected[0].Handling += Number(partindb.Handling)
      }
      if(partindb.Acceleration && partindb.Acceleration > 0){
        selected[0].Acceleration -= Number(partindb.Acceleration)
      }

      console.log(resale)

      let embed = new EmbedBuilder()
      .setTitle(`Drivetrain swap`)
      .addFields({name: "Old Drivetrain", value: `${oldhp.Emote} ${oldhp.Name}\n${emotes.speed} HP ${oldhp.Power}`, inline: true}, {name: "New Drivetrain", value: `${partindb.Emote} ${partindb.Name}\n${emotes.speed} HP ${hpdrivetrain}`, inline: true})
      .setDescription(`${emotes.speed} HP ${oldcarhp} -> ${selected[0].Speed}\n${emotes.weight} Weight ${oldcarweight} -> ${selected[0].WeightStat}\n${emotes.handling} Handling ${oldcarhandling} -> ${selected[0].Handling}\n${emotes.acceleration} Acceleration: ${oldcaracceleration} -> ${selected[0].Acceleration}\nValue: ${toCurrency(resale)} -> ${toCurrency(oldresalecar)}`)
      .setColor(colors.blue)
      .setImage(`${carimage}`)
      .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)

      selected[0].drivetrain = partindb.Name.toLowerCase()

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
      for (var i5 = 0; i5 < 1; i5++)  userparts.splice(userparts.indexOf(inputUpgrade.toLowerCase()), 1);
      userdata.parts = userparts


      userdata.parts.push(oldhp.Name.toLowerCase())



      await userdata.save()
  
      return await interaction.reply({embeds: [embed]})
    }
    
    let xclass = selected[0].Class || cardb[selected[0].Name.toLowerCase()].Class
    let acc = selected[0].Acceleration
    let newacc = acc -= partindb.Acceleration

    console.log(selected[0])
    if(partindb.Handling > 0){
      selected[0].Handling += Number(partindb.Handling)
    }
    
    if(partindb.Power > 0){
      selected[0].Speed += Number(partindb.Power)
    }
    if(partindb.Acceleration > 0 && cardb[selected[0].Name.toLowerCase()]["0-60"] > 2){
    if(newacc < 2 && xclass !== "X"){
      selected[0].Acceleration = 2
    } 
    else {
      if(newacc < 2 && xclass == "X" || cardb[selected[0].Name.toLowerCase()]["0-60"] < 2){  
        selected[0].Acceleration = 1.5
      }
      else {
        selected[0].Acceleration -= partindb.Acceleration

      }

    }
  }
    if(partindb.RemoveAcceleration > 0 && cardb[selected[0].Name.toLowerCase()]["0-60"] > 2){
      selected[0].Acceleration += Number(partindb.RemoveAcceleration)
    }
    if(partindb.RemovePower > 0){
      selected[0].Speed -= Number(partindb.RemovePower)
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
    if(partindb.Gas > 0){
      selected[0].MaxGas = partindb.Gas
    }

    
    console.log(partvalue)



    if(partvalue == 0){
      if(partindb.Tier == "X"){
        partvalue = 50000
      }
      else {

        partvalue = Number(partindb.Tier) * 5000
      }
    }
    console.log(partvalue)

    selected[0].Resale = resale + partvalue


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
    let tutorial = userdata.tutorial
    for (var i4 = 0; i4 < 1; i4++)  userparts.splice(userparts.indexOf(inputUpgrade.toLowerCase()), 1);
    userdata.parts = userparts
    
    userdata.save()
    
    
    let embed = new EmbedBuilder()
    .setTitle(`Installed a ${partindb.Emote} ${partindb.Name}`)
    .setDescription(`${emotes.speed} ${carspeed} -> ${selected[0].Speed}\n${emotes.handling} ${carhandling} -> ${selected[0].Handling}\n${emotes.weight} ${carweight} -> ${selected[0].WeightStat}\n${emotes.acceleration} ${Math.floor(caracc * 100) / 100} -> ${Math.floor(selected[0].Acceleration * 100) / 100}\nValue: ${toCurrency(resale)} -> ${toCurrency(resale + partvalue)}`)
    .setColor(colors.blue)
    .setImage(`${carimage}`)
    .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)

    await interaction.reply({embeds: [embed]})

    if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 7 && userdata.tutorial.type == "starter"){
      let tut = userdata.tutorial
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
  
      interaction.channel.send(`**TUTORIAL:** Your car is even faster now! Lets run \`/race\` to see how it performs! Remember to run \`/race [street race] [car id] [tier 1]\``)
    }
     
  },
};
