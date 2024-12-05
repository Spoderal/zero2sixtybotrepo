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
        {name: "Crankshaft", value: "crankshaft"},
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
          let speed = ogcar.Speed
          let accel = ogcar["0-60"]
          let handling = ogcar.Handling
          let weight = ogcar.Weight
          let ogspeed = carindb.Speed
          let ogacc = Math.max(2, carindb.Acceleration)
          if(carindb.Class == "X"){
            ogacc = Math.max(1.5, carindb.Acceleration)
          }
          if(cardb[carindb.Name.toLowerCase()]["0-60"] < 2){
            ogacc = Math.max(cardb[carindb.Name.toLowerCase()]["0-60"], carindb.Acceleration)
    
          }
          let oghandling = carindb.Handling
          let ogweight = carindb.WeightStat
          if(carindb.Class == "X"){
            speed += (speed * 0.25)
            handling += (handling * 0.25)
          }
      let exhaust = carindb.exhaust || "stock exhaust"
      let intake = carindb.intake || "stock intake"
      let tires = carindb.tires || "stock tires"
      let turbo = carindb.turbo || "no turbo"
      let suspension = carindb.suspension || "stock suspension"
      let engine = carindb.engine || cardb[carindb.Name.toLowerCase()].Engine
      let drivetrain = carindb.drivetrain || "stock drivetrain"
      let gearbox = carindb.gearbox || "stock gearbox"
      let clutch = carindb.clutch || "stock clutch"
      let ecu = carindb.ecu || "stock ecu"
      let intercooler = carindb.intercooler || "no intercooler"
      let springs = carindb.springs || "stock springs"
      let spoiler = carindb.spoiler || "no spoiler"
      let weightreduction = carindb.weight || "no weight"
      let crankshaft = carindb.crankshaft || "stock crankshaft"

      let brakes = carindb.brakes || "stock brakes"

          if(exhaust !== "stock exhaust"){
      
            await userdata.parts.push(exhaust.toLowerCase())
          }
          if(turbo  !== "no turbo"){

              await userdata.parts.push(turbo)
          }
          if(intake  !== "stock intake"){
        
              await userdata.parts.push(intake)
          }
      
          if(tires !== "stock tires"){
       
              await  userdata.parts.push(carindb.tires)
          }
          if(suspension !== "stock suspension"){
        
              await userdata.parts.push(suspension)
          }
          if(gearbox !== "stock gearbox"){
          
              await  userdata.parts.push(gearbox)
          }
          if(clutch !== "stock clutch"){
       
              await  userdata.parts.push(clutch)
          }
          if(intercooler !== "no intercooler"){
       
            userdata.parts.push(intercooler)
          }
          if(ecu !== "stock ecu"){
           
              await userdata.parts.push(ecu)
          }
          if(spoiler !== "no spoiler"){
           
              await userdata.parts.push(spoiler)
          }
          if(brakes !== "stock brakes"){
       
            await userdata.parts.push(brakes)
         
          }
          if(springs !== "stock springs"){
              await   userdata.parts.push(springs)
          }
          if(crankshaft !== "stock crankshaft"){
      
              await   userdata.parts.push(crankshaft)
          }
 
          if(weightreduction.toLowerCase() !== "no weight"){
       
            await  userdata.parts.push(weightreduction)
          }

          let sellprice = Math.floor(ogcar.Price * 0.75)
          if(sellprice == 0){
            sellprice = ogcar.sellprice
            if(engine !== ogcar.Engine){
              sellprice = sellprice += partdb.Parts[engine.toLowerCase()].Price * 0.35

            }
            if(drivetrain !== "stock drivetrain"){
              sellprice = sellprice += partdb.Parts[drivetrain.toLowerCase()].Price * 0.35

            }
          }
          if(engine !== ogcar.Engine){
            speed = speed += partdb.Parts[engine.toLowerCase()].Power
            accel = accel -= partdb.Parts[engine.toLowerCase()].Acceleration
          }
          console.log(sellprice)
          
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
                "cars.$[car].crankshaft": null,
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
          .setDescription(`${emotes.speed} ${ogspeed} -> ${speed}\n${emotes.handling} ${oghandling} -> ${handling}\n${emotes.weight} ${ogweight} -> ${weight}\n${emotes.acceleration} ${ogacc} -> ${accel}`)
          .setColor(colors.blue)
          .setImage(`${carimage}`)
          .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)
      
          await interaction.reply({embeds: [embed]})

          await  userdata.save()
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
      
      if(partindb.Type == "drivetrain"){
        if(selected[0].drivetrain == "stock drivetrain"){
          return interaction.reply("Your car doesn't have a drivetrain swapped, use /upgrade first!")
        }
      
      }
      let acc = Math.max(2, selected[0].Acceleration)

      if(selected[0].Class == "X" || cardb[selected[0].Name.toLowerCase()]["0-60"] == 1.5){
        acc = Math.max(1.5, selected[0].Acceleration)
      }
      
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
     
          selected[0].Acceleration -= (Math.floor(partindb.RemoveAcceleration * 100) / 100)
  
        
      }
      if(partindb.RemovePower > 0){
        selected[0].Speed += Number(partindb.RemovePower)
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
  
  
      await   userdata.save()
      let newaccel = Math.max(2, selected[0].Acceleration)

      if(selected[0].Class == "X"){
        newaccel = Math.max(1.5, selected[0].Acceleration)
      }
      if(cardb[selected[0].Name.toLowerCase()]["0-60"] < 2){
        newaccel = Math.max(cardb[selected[0].Name.toLowerCase()]["0-60"], selected[0].Acceleration)

      }
      
      let embed = new EmbedBuilder()
      .setTitle(`Removed ${partindb.Emote} ${partindb.Name}`)
      .setDescription(`${emotes.speed} ${carspeed} -> ${selected[0].Speed}\n${emotes.handling} ${carhandling} -> ${selected[0].Handling}\n${emotes.weight} ${carweight} -> ${selected[0].WeightStat}\n${emotes.acceleration} ${acc} -> ${newaccel}`)
      .setColor(colors.blue)
      .setImage(`${carimage}`)
      .setThumbnail(`https://i.ibb.co/56HPHdq/upgradeicon.png`)
  
      await interaction.reply({embeds: [embed]})
    }

     
  },
};
