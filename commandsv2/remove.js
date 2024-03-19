const { EmbedBuilder } = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;

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
      .addChoices(
        {name: `Exhaust`, value: "exhaust"},
        {name: `Intake`, value: "intake"},
        {name: `Turbo`, value: "turbo"},
        {name: `Tires`, value: "tires"},
        {name: `Clutch`, value: "clutch"},
        {name: `Suspension`, value: "suspension"},
        {name: `Brakes`, value: "brakes"},
        {name: `Gearbox`, value: "gearbox"},
        {name: `ECU`, value: "ecu"},
        {name: `Intercooler`, value: "intercooler"},
        {name: `Body`, value: "body"},
        {name: `Weight`, value: "weight"},
        {name: `Spoiler`, value: "spoiler"},
        {name: `Springs`, value: "springs"},
        {name:"Drivetrain", value: "drivetrain"},
        {name: "All", value: "all"}

      )
      .setRequired(true)
  )
    ,

  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let inputUpgrade = interaction.options.getString("part");

    if(inputUpgrade.toLowerCase() == "all") {
      let userdata = await User.findOne({ id: interaction.user.id });
          let carindb = userdata.cars.filter((c) => c.ID.toLowerCase() == inputCarIdOrName.toLowerCase() || c.Name.toLowerCase() == inputCarIdOrName.toLowerCase())[0]
          console.log(carindb)
          if(!carindb) return interaction.reply("That's not a car! Make sure to specify a car ID, or car name")
          let ogcar = cardb[carindb.Name.toLowerCase()]
          let speed = carindb.Speed
          let accel = carindb.Acceleration
          let handling = carindb.Handling
          let weight = carindb.WeightStat
          let ogspeed = carindb.Speed
          let ogacc = carindb.Acceleration
          let oghandling = carindb.Handling
          let ogweight = carindb.WeightStat
          
      let exhaust = carindb.exhaust || "stock exhaust"
      let intake = carindb.intake || "stock intake"
      let tires = carindb.tires || "stock tires"
      let turbo = carindb.turbo || "no turbo"
      let suspension = carindb.suspension || "stock suspension"
      let engine = carindb.engine || cardb[carindb.Name.toLowerCase()].Engine
      let gearbox = carindb.gearbox || "stock gearbox"
      let clutch = carindb.clutch || "stock clutch"
      let ecu = carindb.ecu || "stock ecu"
      let intercooler = carindb.intercooler || "no intercooler"
      let springs = carindb.springs || "stock springs"
      let spoiler = carindb.spoiler || "no spoiler"
      let weightreduction = carindb.weight || "no weight"
      let gastank = carindb.gastank || "stock gastank"

      let brakes = carindb.brakes || "stock brakes"

          if(exhaust !== "stock exhaust"){
            speed -= partdb.Parts[exhaust.toLowerCase()].Power
            accel += parseInt(partdb.Parts[exhaust.toLowerCase()].Acceleration)
            if(partdb.Parts[exhaust.toLowerCase()].Handling){
            handling -= partdb.Parts[exhaust.toLowerCase()].Handling
            }
            await userdata.parts.push(exhaust.toLowerCase())
          }
          if(turbo  !== "no turbo"){
            speed -= partdb.Parts[turbo.toLowerCase()].Power
            accel += parseInt(partdb.Parts[turbo.toLowerCase()].Acceleration)
            if(partdb.Parts[turbo.toLowerCase()].Handling){
              handling -= partdb.Parts[turbo.toLowerCase()].Handling
              }
              await userdata.parts.push(turbo)
          }
          if(intake  !== "stock intake"){
            speed -= partdb.Parts[intake.toLowerCase()].Power
            accel += parseInt(partdb.Parts[intake.toLowerCase()].Acceleration)
            if(partdb.Parts[intake.toLowerCase()].Handling){
              handling -= partdb.Parts[intake.toLowerCase()].Handling
              }
              await userdata.parts.push(intake)
          }
      
          if(tires !== "stock tires"){
            speed -= partdb.Parts[tires.toLowerCase()].Power
            accel += parseInt(partdb.Parts[tires.toLowerCase()].Acceleration)
            if(partdb.Parts[tires.toLowerCase()].Handling){
              handling -= partdb.Parts[tires.toLowerCase()].Handling
              }
              await  userdata.parts.push(carindb.tires)
          }
          if(suspension !== "stock suspension"){
            speed -= partdb.Parts[suspension.toLowerCase()].Power
            speed += parseInt(partdb.Parts[suspension.toLowerCase()].Acceleration)
            if(partdb.Parts[suspension.toLowerCase()].Handling){
              handling -= partdb.Parts[suspension.toLowerCase()].Handling
              }
              await userdata.parts.push(suspension)
          }
          if(gearbox !== "stock gearbox"){
            speed -= partdb.Parts[gearbox.toLowerCase()].Power
            accel += parseInt(partdb.Parts[gearbox.toLowerCase()].Acceleration)
            if(partdb.Parts[gearbox.toLowerCase()].Handling){
              handling -= partdb.Parts[gearbox.toLowerCase()].Handling
              }
              await  userdata.parts.push(gearbox)
          }
          if(clutch !== "stock clutch"){
            speed -= partdb.Parts[clutch.toLowerCase()].Power
            accel += parseInt(partdb.Parts[clutch.toLowerCase()].Acceleration)
            if(partdb.Parts[clutch.toLowerCase()].Handling){
              handling -= partdb.Parts[clutch.toLowerCase()].Handling
              }
              await    userdata.parts.push(clutch)
          }
          if(intercooler !== "no intercooler"){
            speed -= partdb.Parts[intercooler.toLowerCase()].Power
            accel += parseInt(partdb.Parts[intercooler.toLowerCase()].Acceleration)
            if(partdb.Parts[intercooler.toLowerCase()].Handling){
              handling -= partdb.Parts[intercooler.toLowerCase()].Handling
              }
            userdata.parts.push(intercooler)
          }
          if(ecu !== "stock ecu"){
            speed -= partdb.Parts[ecu.toLowerCase()].Power
            accel += parseInt(partdb.Parts[ecu.toLowerCase()].Acceleration)
            if(partdb.Parts[ecu.toLowerCase()].Handling){
              handling -= partdb.Parts[ecu.toLowerCase()].Handling
              }
              await userdata.parts.push(ecu)
          }
          if(spoiler !== "no spoiler"){
            speed -= partdb.Parts[spoiler.toLowerCase()].Power
            accel += parseInt(partdb.Parts[spoiler.toLowerCase()].Acceleration)
            if(partdb.Parts[spoiler.toLowerCase()].Handling){
              handling -= partdb.Parts[spoiler.toLowerCase()].Handling
              }
              await   userdata.parts.push(spoiler)
          }
          if(brakes !== "stock brakes"){
            speed -= partdb.Parts[brakes.toLowerCase()].Power
            accel += parseInt(partdb.Parts[brakes.toLowerCase()].Acceleration)
            userdata.parts.push(brakes)
          }
          if(springs !== "stock springs"){
            speed -= partdb.Parts[springs.toLowerCase()].Power
            accel += parseInt(partdb.Parts[springs.toLowerCase()].Acceleration)
            if(partdb.Parts[springs.toLowerCase()].Handling){
              handling -= partdb.Parts[springs.toLowerCase()].Handling
              }
              await   userdata.parts.push(springs)
          }
 
          if(weightreduction.toLowerCase() !== "no weight"){
            console.log("weight")
            if(partdb.Parts[weightreduction.toLowerCase()].RemoveWeight){
              console.log("remove weight")
            weight += partdb.Parts[weightreduction.toLowerCase()].RemoveWeight
            }
            else if(partdb.Parts[weightreduction.toLowerCase()].Weight){
              weight -= partdb.Parts[weightreduction.toLowerCase()].Weight

            }
            await  userdata.parts.push(weightreduction)
          }

          let sellprice = Math.floor(ogcar.Price * 0.75)
          if(sellprice == 0){
            sellprice = ogcar.sellprice
            if(engine !== ogcar.Engine){
              sellprice = sellprice += partdb.Parts[engine.toLowerCase()].Price * 0.35

            }
          }
          
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Speed": speed,
                "cars.$[car].Acceleration": accel,
                "cars.$[car].Handling": handling,
                "cars.$[car].WeightStat": weight,
                "cars.$[car].Resale": sellprice,
                "cars.$[car].exhaust": null,
                "cars.$[car].turbo": null,
                "cars.$[car].intake": null,
                "cars.$[car].tires": null,
                "cars.$[car].suspension": null,
                "cars.$[car].gearbox": null,
                "cars.$[car].clutch": null,
                "cars.$[car].intercooler": null,
                "cars.$[car].ecu": null,
                "cars.$[car].spoiler": null,
                "cars.$[car].weight": null,
                "cars.$[car].brakes": null,
                "cars.$[car].springs": null,
              },
            },
      
            {
              arrayFilters: [
                {
                  "car.Name": carindb.Name,
                },
              ],
            }
          );
            let carimage = carindb.Image || carindb.Livery || ogcar.Image;
          let embed = new EmbedBuilder()
          .setTitle(`Removed all parts on ${carindb.Name}`)
          .setDescription(`${emotes.speed} ${ogspeed} -> ${speed}\n${emotes.handling} ${oghandling} -> ${handling}\n${emotes.weight} ${ogweight} -> ${weight}\n${emotes.acceleration} ${Math.floor(ogacc * 100) / 100} -> ${Math.floor(accel * 100) / 100}`)
          .setColor(colors.blue)
          .setImage(`${carimage}`)
          .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)
      
          await interaction.reply({embeds: [embed]})

          userdata.save()
          return

    }else {

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
        let carimage = selected[0].Image || selected[0].Livery || selected.Image;
      let carspeed = selected[0].Speed
      let caracc = selected[0].Acceleration
      let carhandling = selected[0].Handling
      let carweight = selected[0].WeightStat
  
  
      let partoncar = selected[0][inputUpgrade.toLowerCase()]
  
      if(!partoncar) return interaction.reply("Try specifying the part type you want to remove. Ex; exhaust, ecu, tires")
  
      let partindb = partdb.Parts[partoncar.toLowerCase()]
  
      if(!selected[0][partindb.Type] || selected[0][partindb.Type] == null) return interaction.reply(`Your car doesn't have a ${partindb.Type}, use /upgrade first!`)
  
      let acc = selected[0].Acceleration
      let newacc = acc -= partindb.Acceleration
      
      if(partindb.Handling > 0){
     
          selected[0].Handling -= Number(partindb.Handling)
  
        
      }
      if(partindb.Power > 0){
        selected[0].Speed -= Number(partindb.Power)
      }
      if(partindb.Acceleration > 0 && cardb[selected[0].Name.toLowerCase()]["0-60"] > 2){
        
        selected[0].Acceleration += (Math.floor(partindb.Acceleration * 100) / 100)
      }
      if(partindb.RemoveAcceleration > 0 && cardb[selected[0].Name.toLowerCase()]["0-60"] > 2){
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
  
      let partvalue = partindb.Price * 0.35
      let resale = selected[0].Resale
  
      selected[0].Resale = resale -= partvalue
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
    }

     
  },
};
