const cars = require("../cardb.json");
const Discord = require("discord.js");
const {SlashCommandBuilder} = require('@discordjs/builders')
const parts = require("../partsdb.json")
const Canvas = require("canvas")
const db = require('quick.db')
const {MessageActionRow, MessageButton} = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName('stats')
  .setDescription("View the default stats of a car or part")
  .addSubcommand((subcommand) => subcommand
  .setName("car_part")
  .setDescription("Get the default stats of a car or part")
  .addStringOption((option) =>option
  .setName("item")
  .setDescription("The car you want to see the stats for")
  .setRequired(true))
  )
  .addSubcommand((subcommand) => subcommand
  .setName("dealership")
  .setDescription("Get the information of a car in the dealer")
  .addStringOption((option) =>option
  .setName("item")
  .setDescription("The car you want to see the stats for")
  .setRequired(true))
  )
  .addSubcommand((subcommand) => subcommand
    .setName("carid")
    .setDescription("Get the stats and parts of your car")
    .addStringOption((option) =>option
    .setName("item")
    .setDescription("The car you want to see the stats for")
    .setRequired(true))
    .addUserOption((option) =>option
    .setName("user")
    .setDescription("If you'd like to see the stats of a users car")
    .setRequired(false)))
  ,
  async execute(interaction) {
    let useroption =  interaction.options.getUser("user") || interaction.user 
    let subcommandfetch = interaction.options.getSubcommand()

    

    var list = cars.Cars
    var list2 = parts.Parts
    var car = interaction.options.getString("item")
 
    if(!car) return interaction.reply("Specify what car or part you want to see the stats of! Examples: /stats 1995 Mazda Miata")
    if(subcommandfetch === "carid"){
      let carid = db.fetch(`selected_${car}_${useroption.id}`);
  if (!carid)
    return interaction.reply(
      "That id doesn't have a car! Use /ids select [id] [car] to select it!"
    );
  let uid = useroption.id
  if(!carid) return interaction.reply("Specify a car!")
  carid = carid.toLowerCase()
  var usercars = db.fetch(`cars_${uid}`) 
  if(!cars.Cars[carid]) return interaction.reply("Thats not a car!")
  let list = cars.Cars
  if(!usercars.includes(`${carid}`)) return interaction.reply("You dont have that car!")
  
  let driftscore = db.fetch(`${cars.Cars[carid].Name}drift_${uid}`) || 0
  let speed = db.fetch(`${cars.Cars[carid].Name}speed_${uid}`) || 0
  let range = db.fetch(`${cars.Cars[carid].Name}range_${uid}`) || "N"
  let maxrange = db.fetch(`${cars.Cars[carid].Name}maxrange_${uid}`) || "N"
  let spoiler = db.fetch(`${cars.Cars[carid].Name}spoiler_${uid}`) || "None"
  let zero60 = db.fetch(`${cars.Cars[carid].Name}060_${uid}`) || cars.Cars[carid]["0-60"]
  if(db.fetch(`${cars.Cars[carid].Name}060_${uid}`) == null || !db.fetch(`${cars.Cars[carid].Name}060_${uid}`)){
      db.set(`${cars.Cars[carid].Name}060_${uid}`, cars.Cars[carid]["0-60"])
  }
  let licenseplate  = db.fetch(`${cars.Cars[carid.toLowerCase()].Name}license_plate_${uid}`) || "00000"
  let restoration = db.fetch(`${cars.Cars[carid].Name}restoration_${uid}`)
  let offroad = db.fetch(`${cars.Cars[carid].Name}offroad_${uid}`) || 0
  
  
  let kmh = speed * 1.609344
  var flooredkmh = Math.floor(kmh)
  let licensePlate = db.fetch(`${cars.Cars[carid].Name}license_plate_${uid}`) || '000000'
  var resale = db.fetch(`${cars.Cars[carid].Name}resale_${uid}`) || 0
  
  let speedemote = "<:speeddefault:932423319020531753>"
  let caremote = cars.Cars[carid].Emote || "<:z_none:898352936785178645>"
  let handling = db.fetch(`${cars.Cars[carid.toLowerCase()].Name}handling_${uid}`)

  if(!handling){
      db.set(`${cars.Cars[carid.toLowerCase()].Name}handling_${uid}`, parseInt(cars.Cars[carid.toLowerCase()].Handling))
  }
  let newhandling = db.fetch(`${cars.Cars[carid.toLowerCase()].Name}handling_${uid}`)
  
  let exhaust = db.fetch(`${cars.Cars[carid].Name}exhaust_${uid}`) || 'Stock Exhaust'
  let gearbox = db.fetch(`${cars.Cars[carid].Name}gearbox_${uid}`) || 'Stock Gearbox'
  let tires = db.fetch(`${cars.Cars[carid].Name}tires_${uid}`) || 'Stock Tires'
  let turbo = db.fetch(`${cars.Cars[carid].Name}turbo_${uid}`) || 'No Turbo'
  let intake = db.fetch(`${cars.Cars[carid].Name}intake_${uid}`) || 'Stock Intake'
  let clutch = db.fetch(`${cars.Cars[carid].Name}clutch_${uid}`) || 'Stock Clutch'
  let ecu = db.fetch(`${cars.Cars[carid].Name}ecu_${uid}`) || 'Stock ECU'
  let suspension = db.fetch(`${cars.Cars[carid].Name}suspension_${uid}`) || 'Stock Suspension'
  let intercooler = db.fetch(`${cars.Cars[carid].Name}intercooler_${uid}`) || 'None'

  let weight = db.fetch(`${cars.Cars[carid].Name}weight_${uid}`) || 'No Kit'
  let snowscore = db.fetch(`${cars.Cars[carid].Name}snowscore_${uid}`)
  let nitro = db.fetch(`${cars.Cars[carid].Name}nitro_${uid}`) || "None"
  let bodykit = db.fetch(`${cars.Cars[carid].Name}body_${uid}`) || "None"

  let engine = db.fetch(`${cars.Cars[carid].Name}engine_${uid}`) || cars.Cars[carid].Engine
  
  
  
  
  let carimage = db.fetch(`${cars.Cars[carid].Name}livery_${uid}`) || cars.Cars[carid].Image
  
  console.log(carid)
  const canvas = Canvas.createCanvas(720, 400)
  const context = canvas.getContext('2d');
  let bg = "./bg.png"
  let statspage = "./statspage.png"
  let carimg = carimage
  const  background = await Canvas.loadImage(bg);
  const  obackground = await Canvas.loadImage(statspage)
  const  carimgstats = await Canvas.loadImage(carimg);

  let height = canvas.height / 1.04
  let width = canvas.width / 1.04

  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.drawImage(carimgstats, 5, 8, width, height);
  context.drawImage(obackground, 0, 0, canvas.width, canvas.height);

  let carname = cars.Cars[carid].Name
  const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');
    
    // Declare a base size of the font
    let fontSize = 70;
    
    do {
      // Assign the font to the context and decrement it so it can be measured again
      context.font = `${fontSize -= 10}px sans-serif`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 300);
    
    // Return the result to use in the actual canvas
    return context.font;
    };
    
    // Actually fill the text with a solid color

    
   
    // Assign the decided font to the canvas
    context.font = applyText(canvas, carname);
    context.fillStyle = '#ffffff';
    context.font = '30px sans-serif';
    context.fillText(`Your ${carname}`, 25, 45);
    context.font = '20px sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText(`${speed} mph`, 40, 360);
    context.fillText(`${flooredkmh} kmh`, 40, 385);
    context.fillText(`${(Number(zero60).toFixed(1))}s`, 178, 360);
    context.fillText(`${newhandling}`, 295, 360);
    context.font = '25px sans-serif';

    context.fillText(`${offroad}`, 660, 70);
    context.fillText(`${driftscore}`, 660, 150);
    context.fillText(`${range}/${maxrange}`, 660, 240);
    context.fillText(`${licenseplate}`, 640, 320)
  
    context.fillText(`$${numberWithCommas(resale)}`, 500, 360);

    const canvas2 = Canvas.createCanvas(720, 400)
    
    const context2 = canvas2.getContext('2d');
    const canvas3 = Canvas.createCanvas(720, 400)
    
    const context3 = canvas3.getContext('2d');
    let partspage = "./partspage.png"
    let winspage = "./winspage.png"

    let carimg2 = carimage
    const  background2 = await Canvas.loadImage(partspage);
    const  background4 = await Canvas.loadImage(winspage);

    context2.drawImage(carimgstats, 0, 0, canvas2.width, canvas2.height);
    context2.drawImage(background2, 0, 0, canvas2.width, canvas2.height);
    context3.drawImage(carimgstats, 0, 0, canvas3.width, canvas3.height);
    context3.drawImage(background4, 0, 0, canvas3.width, canvas3.height);

    const applyText2 = (canvas2, text) => {
      
      // Declare a base size of the font
      let fontSize = 70;
      
      do {
        // Assign the font to the context and decrement it so it can be measured again
        context2.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
      } while (context2.measureText(text).width > canvas2.width - 300);
      
      // Return the result to use in the actual canvas
      return context2.font;
      };
      
      // Actually fill the text with a solid color

      
     
      // Assign the decided font to the canvas
      context2.font = applyText2(canvas2, carname);
      context2.fillStyle = '#ffffff';
      context2.font = '20px sans-serif';
      context2.fillStyle = '#ffffff';
      context2.fillText(`${exhaust}`, 18, 165);
      context2.fillText(`${tires}`, 18, 240);
      context2.fillText(`${intake}`, 18, 320);
      context2.fillText(`${suspension}`, 18, 390);
      context2.fillText(`${turbo}`, 230, 165);
      context2.fillText(`${clutch}`, 230, 240);
      context2.fillText(`${ecu}`, 230, 320);
      context2.fillText(`${nitro}`, 230, 390);
      context2.fillText(`${weight}`, 380, 165);
      context2.fillText(`${engine}`, 380, 240);
      context2.fillText(`${gearbox}`, 380, 320);
      context2.fillText(`${bodykit}`, 380, 390);
      context2.fillText(`${spoiler}`, 550, 165);
      context2.fillText(`${intercooler}`, 550, 240);

      let wins = db.fetch(`${cars.Cars[carid].Name}wins_${uid}`) || 0
      let dwins = db.fetch(`${cars.Cars[carid].Name}driftwins_${uid}`) || 0
      let pvpwins = db.fetch(`${cars.Cars[carid].Name}pvpwins_${uid}`) || 0
      let dpvpwins = db.fetch(`${cars.Cars[carid].Name}dpvpwins_${uid}`) || 0
      let timetrial = db.fetch(`${cars.Cars[carid].Name}timetrial_${uid}`) || 0

      context3.font = applyText2(canvas2, carname);
      context3.fillStyle = '#ffffff';
      context3.font = '20px sans-serif';
      
      context3.fillText(`${wins} Bot Wins`, 18, 165);
      context3.fillText(`${dwins} Drift Bot Wins`, 18, 240);
      context3.fillText(`${pvpwins} PVP Wins`, 18, 320);
      context3.fillText(`${dpvpwins} Drift PVP Wins`, 230, 240);
      context3.fillText(`Best Time Trial: ${timetrial}s`, 230, 165);



  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'statpage.png');
  const attachment2 = new Discord.MessageAttachment(canvas2.toBuffer(), 'partspage.png');
  const attachment3 = new Discord.MessageAttachment(canvas3.toBuffer(), 'winspage.png');

      interaction.reply({content: "Please wait...", fetchReply: true}).then(async msg => {

        let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId("parts")
          .setEmoji("⚙️")
          .setLabel("Parts")
          .setStyle("SECONDARY"),
          new MessageButton()
          .setCustomId("stats")
          .setEmoji("📊")
          .setLabel("Stats")
          .setStyle("SECONDARY")
          
          )
          if(cars.Cars[carid].StatTrack){
            let wins = db.fetch(`${cars.Cars[carid].Name}wins_${uid}`) || 0
            row.addComponents(
              new MessageButton()
              .setCustomId(`wins`)
              .setEmoji("🏆")
              .setLabel("Wins")
              .setStyle("SECONDARY")
            )
          }
          interaction.channel.send({ files: [attachment], components: [row],  fetchReply: true}).then(async emb => {
   let filter = (btnInt) => {
     return interaction.user.id === btnInt.user.id
 }

 const collector = emb.createMessageComponentCollector({
     filter: filter
 })

   collector.on('collect', async (i) => {
     if(i.customId.includes("parts")){
       
       await i.update({files: [attachment2]})

     }
    else if(i.customId.includes("stats")){
      
      await i.update({files: [attachment]})


     }
     else if(i.customId.includes("wins")){
      
      await i.update({files: [attachment3]})


     }
   })

   
 

  })
})

   }
   else if(subcommandfetch === "dealership"){

    if(list[car.toLowerCase()]){
      car = car.toLowerCase()

      let trims = cars.Cars[car].Trims 

      let embed = new Discord.MessageEmbed()
      .setTitle(`Information for ${cars.Cars[car].Name}`)
      .setColor("#60b0f4")
      .setImage(cars.Cars[car].Image)
      if(trims){
        let trimcar
        let finaltrims = []
        for(trim in trims){
          trime = trims[trim]
          
          trimcar = cars.Cars[trime.toLowerCase()]
          finaltrims.push(`${trimcar.Name} : $${numberWithCommas(trimcar.Price)}`)
        }
        embed.addField("Trims", `${finaltrims.join(`\n`)}`)
      }

      interaction.reply({embeds: [embed]})
    }

   }

   else if(subcommandfetch === "car_part"){
     if(list[car.toLowerCase()]){
       car = car.toLowerCase()
       let speedcar = cars.Cars[car.toLowerCase()].Speed
       let kmh = cars.Cars[car.toLowerCase()].Speed * 1.609344
       let drift = cars.Cars[car.toLowerCase()].Drift || 0
       let zerosixty = cars.Cars[car.toLowerCase()]["0-60"] || 0
       let handling = cars.Cars[car].Handling
       var flooredkmh = Math.floor(kmh)
       let offroad = cars.Cars[car].Rally || 0
       let range = cars.Cars[car].Range || "N"
       let price = cars.Cars[car].Price || "0"
       let carimg = cars.Cars[car].Image
       interaction.reply({content:"Please wait...", fetchReply: true, ephemeral: true})
   
     
   
 
        const canvas = Canvas.createCanvas(720, 400)
          const context = canvas.getContext('2d');
          let statspage = "./statspage.png"
          let bg = "./bg.png"

          const  background = await Canvas.loadImage(bg);
          const  obackground = await Canvas.loadImage(statspage)
          const  carimgstats = await Canvas.loadImage(carimg);
        
          let height = canvas.height / 1.04
          let width = canvas.width / 1.04
        
          context.drawImage(background, 0, 0, canvas.width, canvas.height);
          context.drawImage(carimgstats, 5, 8, width, height);
          context.drawImage(obackground, 0, 0, canvas.width, canvas.height);
          let carname = cars.Cars[car].Name
          const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
            
            // Declare a base size of the font
            let fontSize = 70;
            
            do {
              // Assign the font to the context and decrement it so it can be measured again
              context.font = `${fontSize -= 10}px sans-serif`;
              // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 300);
            
            // Return the result to use in the actual canvas
            return context.font;
            };
            
            // Actually fill the text with a solid color
    
            
           
            // Assign the decided font to the canvas
            context.font = applyText(canvas, carname);
            context.fillStyle = '#ffffff';
            context.fillText(carname, 25, 45);
            context.font = '35px sans-serif';
            context.font = '20px sans-serif';
            context.fillStyle = '#ffffff';
            context.fillText(`${speedcar} mph`, 40, 360);
            context.fillText(`${flooredkmh} kmh`, 40, 385);
            context.fillText(`${zerosixty}s`, 178, 360);
            context.fillText(`${handling}`, 295, 360);
            context.font = '25px sans-serif';
    
            context.fillText(`${offroad}`, 660, 70);
            context.fillText(`${drift}`, 660, 150);
            context.fillText(`${range}`, 660, 240);
    
            if(cars.Cars[car].Exhaust || cars.Cars[car].Turbo || cars.Cars[car].Intake || cars.Cars[car].Tires){
              context.fillText(`This car comes with extra parts!`, 25, 80);
    
            }
    
    
            let finalprice
            if(cars.Cars[car].Obtained){
              finalprice = `${cars.Cars[car].Obtained}`
            }
            else{
              finalprice = `$${numberWithCommas(price)}`
    
            }
            context.fillText(`${finalprice}`, 450, 350);
    
          const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'statpage.png');
          
          
          interaction.channel.send({ files: [attachment] })
      }
 
      else if(parts.Parts[car.toLowerCase()]){
        car = car.toLowerCase()
        let sellprice = parts.Parts[car.toLowerCase()].sellprice || 'N/A'
  var emote = parts.Parts[car.toLowerCase()].Emote
  var tier = parts.Parts[car.toLowerCase()].Tier || "N/A"
  let color
  let stats = [""]
  if(tier == "1"){
    color ="#ff6b64"
  }
  else if(tier == "2"){
    color = "#3ca6ff"
  }
  else if(tier == "3"){
    color = "#ffbf00"
  }
  else if(tier == "4"){
    color = "#c16ec8"
  }
  else if(tier == "5"){
    color = parts.Parts[car.toLowerCase()].Color
    stats.push("**FUSE PART**")
  }
  else if(tier == "j"){
    color = "#ebd7cc"
  }
  else if(tier == "N/A"){
    color = "#0000"
  }
  else if(tier == "BM1"){
    color = "#bababa"
  }
   
    if(parts.Parts[car.toLowerCase()].AddedSpeed && parts.Parts[car.toLowerCase()].AddedSpeed > 0){
      stats.push(`Speed: +${parts.Parts[car.toLowerCase()].AddedSpeed}`)
    }
   
    if(parts.Parts[car.toLowerCase()].AddedSixty && parts.Parts[car.toLowerCase()].AddedSixty > 0){
      stats.push(`0-60: -${parts.Parts[car.toLowerCase()].AddedSixty}`)
    }
    if(parts.Parts[car.toLowerCase()].AddHandling && parts.Parts[car.toLowerCase()].AddHandling > 0){
      stats.push(`Handling: +${parts.Parts[car.toLowerCase()].AddHandling}`)
    }
    if(parts.Parts[car.toLowerCase()].DecreasedSixty && parts.Parts[car.toLowerCase()].DecreasedSixty > 0){
      stats.push(`0-60: +${parts.Parts[car.toLowerCase()].DecreasedSixty}`)
    }
    if(parts.Parts[car.toLowerCase()].AddedDrift && parts.Parts[car.toLowerCase()].AddedDrift > 0){
      stats.push(`Drift: +${parts.Parts[car.toLowerCase()].AddedDrift}`)
    }
    if(parts.Parts[car.toLowerCase()].DecreasedDrift && parts.Parts[car.toLowerCase()].DecreasedDrift > 0){
      stats.push(`Drift: -${parts.Parts[car.toLowerCase()].DecreasedDrift}`)
    }
    if(parts.Parts[car.toLowerCase()].AddedOffRoad && parts.Parts[car.toLowerCase()].AddedOffRoad > 0){
      stats.push(`Offroad: +${parts.Parts[car.toLowerCase()].AddedOffRoad}`)
    }
    if(parts.Parts[car.toLowerCase()].AddedDown && parts.Parts[car.toLowerCase()].AddedDown > 0){
      stats.push(`Downforce: +${parts.Parts[car.toLowerCase()].AddedDown}`)
    }
    
    
    let embed = new Discord.MessageEmbed()
    .setTitle(`${emote} ${parts.Parts[car.toLowerCase()].Name} Stats`)
    .setDescription(`${stats.join('\n')}`)
    .addField(`Tier`, `${parts.Parts[car.toLowerCase()].Tier}`, true)
    .addField(`Price`, `$${numberWithCommas(parts.Parts[car.toLowerCase()].Price)}`, true)
    .addField(`Type`, `${numberWithCommas(parts.Parts[car.toLowerCase()].Type)}`, true)

    .setColor(color)
    
    interaction.reply({embeds: [embed]})
  }
  else return interaction.reply(`Thats not a valid car, or part!`)
     }
     
    
    
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};