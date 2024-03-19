const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, numberWithCommas } = require("../common/utils");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const { userGetFromInteraction } = require("../common/user");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json").Parts
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("View the parts and cars dealership")
    .addSubcommand((subcommand) => subcommand
    .setName("cars")
    .setDescription("View cars for sale")
    )
    .addSubcommand((subcommand) => subcommand
    .setName("parts")
    .setDescription("View parts for sale")
    ),
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand()
    let userdata = await User.findOne({ id: interaction.user.id });

    if(!userdata){
      return interaction.reply({content: GET_STARTED_MESSAGE, ephemeral: true})
    }

    if(subcommand == "cars"){

    
    let cardb = require("../data/cardb.json").Cars
    let classdb = require("../data/cardb.json").Tiers
    let dealerarray = []

    for(let car in cardb){
      dealerarray.push(cardb[car])
    }

    let featured = dealerarray.filter((car) => car.Price > 0 && !car.Police)

    let featurecar = lodash.sample(featured)


    let row = new ActionRowBuilder()
    .setComponents(
      new StringSelectMenuBuilder()
      .setCustomId("class")
      .setPlaceholder("Class")
      .addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel('Car Packs')
        .setDescription('View the list of Car Packs')
        .setEmoji(`🚙`)
        .setValue('carpack'),
        new StringSelectMenuOptionBuilder()
					.setLabel('Class D')
					.setDescription('View the list of D Class cars')
          .setEmoji(`${classdb.d.Emote}`)
					.setValue('d'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Class C')
					.setDescription('View the list of C Class cars')
          .setEmoji(`${classdb.c.Emote}`)
					.setValue('c'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Class B')
					.setDescription('View the list of B Class cars')
          .setEmoji(`${classdb.b.Emote}`)
					.setValue('b'),
      
          new StringSelectMenuOptionBuilder()
					.setLabel('Class A')
					.setDescription('View the list of A Class cars')
          .setEmoji(`${classdb.a.Emote}`)
					.setValue('a'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Class S')
					.setDescription('View the list of S Class cars')
          .setEmoji(`${classdb.s.Emote}`)
					.setValue('s'),
          new StringSelectMenuOptionBuilder()
					.setLabel('New')
					.setDescription('View the list of new cars')
          .setEmoji(`⭐`)
					.setValue('new'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Type Takeover')
					.setDescription('View the list of Type Takeover event cars')
          .setEmoji(`<:key_z:1140029565360668783>`)
					.setValue('typetakeover'),
      )
    )

    let row2 = new ActionRowBuilder()
    .setComponents(
      new ButtonBuilder()
      .setCustomId("prev")
      .setEmoji("⬅️")
      .setStyle("Primary"),
      new ButtonBuilder()
      .setCustomId("next")
      .setStyle("Primary")
      .setEmoji("➡️")
    )
    let row3 = new ActionRowBuilder()

    let row4 = new ActionRowBuilder()
    

    let page = 0
    let embed = new EmbedBuilder()
    .setTitle("Vehicle Dealership")
    .setThumbnail("https://i.ibb.co/Fs8KR56/icons8-car-rental-480.png")
    .setDescription(`**${classdb[featurecar.Class.toLowerCase()].Emote} __Featured Car__**\n${featurecar.Emote} ${featurecar.Name}\n${emotes.cash} ${(toCurrency(featurecar.Price))}\n${emotes.speed} Power: ${featurecar.Speed}\n${emotes.acceleration} Acceleration: ${featurecar["0-60"]}\n${emotes.handling} Handling: ${featurecar.Handling}\n${emotes.weight} Weight: ${featurecar.Weight}\n\n||Wow look, an egg! <:egg_porsche:1219112541347905607> CODE: \`HORSESARECOOL\`||`)
    .setImage(`${featurecar.Image}`)
    .setColor(colors.blue)

   let msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})


    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
    });
    let classpage
    let typetakover = false
    collector.on('collect', async (i) => {
 
      if(i.customId !== "next" && i.customId !== "prev"){
        console.log(i.customId)
        let caridfilter = dealerarray.filter((car) => car.alias == `${i.customId}`)
        console.log(caridfilter)
        if(caridfilter[0]){
          userdata = await User.findOne({ id: interaction.user.id });
          let car = caridfilter[0]
          let usercarsin = userdata.cars.find((car) => car.alias == i.customId)
          if(userdata.cash < car.Price || usercarsin){
            return interaction.followUp({content: "You can't afford this car or you already own it", ephemeral: true})
          }
          else if(userdata.cars.length >= userdata.garageLimit){
            return await interaction.followUp({ content: `Your garage is full, you need to upgrade your garage to store more cars`, ephemeral: true })
          }
          else {
             userdata = await User.findOne({ id: interaction.user.id });
             userdata.cash -= car.Price
            let sellprice = car.Price * 0.75
            let carobj = {
              ID: car.alias,
              Name: car.Name,
              Speed: car.Speed,
              Acceleration: car["0-60"],
              Handling: car.Handling,
              WeightStat: car.Weight,
              Emote: car.Emote,
              Livery: car.Image,
              Miles: 0,
              Resale:sellprice,
              Gas: 10,
              MaxGas: 10,
            };
            userdata.cars.push(carobj)
            userdata.save()
            let embed2 = new EmbedBuilder()
            .setTitle(`You bought a ${car.Name}`)
            .setDescription(`You bought a ${car.Emote} ${car.Name} for ${toCurrency(car.Price)}`)
            .setColor(colors.blue)
            .setImage(car.Image)
            .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})
            return interaction.editReply({embeds: [embed2], components: []})
          }
          
        }
        else {

        
          classpage = i.values[0]

          console.log(classpage)

          if(i.values[0] && i.values[0] == "carpack" && i.customId !== "next" && i.customId !== "prev" && !caridfilter[0]){
            let carpacks = require("../data/carpacks.json")
            let roadsters = carpacks["rad roadsters"].cars
            let roadfinal = []
            let suvs = carpacks["suv adventures"].cars
            let suvsfinal = []
    
            for(let road in roadsters){
              let car  = roadsters[road]
              console.log(car)
              console.log(cardb[car])
              roadfinal.push(`${cardb[car].Emote} ${cardb[car].Name}`)
            }
            for(let suv in suvs){
              let car  = suvs[suv]
              suvsfinal.push(`${cardb[car].Emote} ${cardb[car].Name}`)
            }
            let carpackembed = new EmbedBuilder()
            .setTitle("Car Packs")
            .setDescription(`__${carpacks["rad roadsters"].Name}__ : ${emotes.gold} ${carpacks["rad roadsters"].Gold}\n
            ${roadfinal.join('\n')}\n
            __${carpacks["suv adventures"].Name}__ : ${emotes.gold} ${carpacks["suv adventures"].Gold}\n
            ${suvsfinal.join('\n')}
            `)
            .setThumbnail("https://i.ibb.co/Fs8KR56/icons8-car-rental-480.png")
            .setColor(colors.blue)
            await interaction.editReply({embeds: [carpackembed], fetchReply: true})
            return
          }
          else if(i.values[0] && i.values[0] == "typetakeover" && i.customId !== "next" && i.customId !== "prev" && !caridfilter[0]){
           
            console.log("type")
           
            typetakover = true
            let embed3 = new EmbedBuilder()
            .setTitle("Type Takeover")
            
            .setThumbnail("https://i.ibb.co/Fs8KR56/icons8-car-rental-480.png")
            .setColor(colors.blue)

            for(let c in cardb){
              let car = cardb[c]
              if(car.Exclusive){
                console.log(car)
                embed3.addFields({name: `${car.Emote} ${car.Name}`, value: `<:key_z:1140029565360668783> ${numberWithCommas(car.Exclusive)}\n${emotes.speed} Power: ${car.Speed}\n${emotes.acceleration} Acceleration: ${car["0-60"]}\n${emotes.handling} Handling: ${car.Handling}\n${emotes.weight} Weight: ${car.Weight}`, inline: true})
              }
            }

            await interaction.editReply({embeds: [embed3], fetchReply: true})
            
          }

        
        page = 1
        }
      }



          if(i.customId == "next"){
             page ++
          
          }

          if(i.customId == "prev"){
            page --
            
         }
         let classfilter
         let new2 = false
         if(classpage == "new"){
          new2 = true
          classfilter = dealerarray.filter((carclass) => carclass.New == true)
         }
         else {

           classfilter = featured.filter((carclass) => carclass.Class.toLowerCase() == classpage)
           classfilter.sort(function(a, b){return a.Price - b.Price});
         }
           let classmaps = lodash.chunk(
         classfilter.map((a) => a),
         6
       );


       if(classmaps[page - 1] == undefined) return interaction.editReply("")


          let classpage2 = classmaps[page - 1]
  
          embed.data.fields = []
          embed.data.description = ""
          row3 = new ActionRowBuilder()
          row4 = new ActionRowBuilder()
          let buyrow1 = classpage2.slice(0, 3)
          let buyrow2 = classpage2.slice(3)
          console.log(buyrow1)
         for(let car3 in classmaps[page - 1]){
           let cartodisplay = classmaps[page - 1][car3]
           let price = ""
           if(cartodisplay.Price == 0){
            price = `Obtained: ${cartodisplay.Obtained}`
           }
           else {
            price = `${toCurrency(cartodisplay.Price)}`
           }
           embed.addFields(
            {name: `${cartodisplay.Emote} ${cartodisplay.Name}`, value: `${emotes.cash} ${price}\n${emotes.speed} Power: ${cartodisplay.Speed}\n${emotes.acceleration} Acceleration: ${cartodisplay["0-60"]}\n${emotes.handling} Handling: ${cartodisplay.Handling}\n${emotes.weight} Weight: ${cartodisplay.Weight}`, inline: true}
           )
         }



         
         for(let car3 in buyrow1){
          let cartodisplay = buyrow1[car3]
          let usercarsin = userdata.cars.find((car) => car.alias == cartodisplay.alias)
          
          if(userdata.cash < cartodisplay.Price || usercarsin){
          row3.addComponents(
              new ButtonBuilder()
              .setCustomId(`${cartodisplay.alias}`)
              .setLabel(`Buy ${cartodisplay.Name}`)
              .setStyle("Success")
              .setEmoji(`${cartodisplay.Emote}`)
              .setDisabled(true)
            )
          }
          else {
            row3.addComponents(
              new ButtonBuilder()
              .setCustomId(`${cartodisplay.alias}`)
              .setLabel(`Buy ${cartodisplay.Name}`)
              .setStyle("Success")
              .setEmoji(`${cartodisplay.Emote}`)
            )
          }


         }
         for(let car4 in buyrow2){
          let cartodisplay = buyrow2[car4]
          let usercarsin = userdata.cars.find((car) => car.alias == cartodisplay.alias)
    
          if(userdata.cash < cartodisplay.Price || usercarsin){
          row4.addComponents(
              new ButtonBuilder()
              .setCustomId(`${cartodisplay.alias}`)
              .setLabel(`Buy ${cartodisplay.Name}`)
              .setStyle("Success")
              .setEmoji(`${cartodisplay.Emote}`)
              .setDisabled(true)
            )
          }
          else {
            row4.addComponents(
              new ButtonBuilder()
              .setCustomId(`${cartodisplay.alias}`)
              .setLabel(`Buy ${cartodisplay.Name}`)
              .setStyle("Success")
              .setEmoji(`${cartodisplay.Emote}`)
            )
          }
      

         }
        

         if(classpage !== "new"){
           embed.setThumbnail(`${classdb[classpage.toLowerCase()].Icon}`)

         }
         embed.setImage()
         .setDescription(`**${classdb[classpage.toLowerCase()].Emote} __Class Cars__**\nYou have ${emotes.cash} ${toCurrency(userdata.cash)}\n\n`)
         .setFooter({text: `Page ${page}/${classmaps.length}`})
         let rows = [row, row2]
         if(row3.components.length > 0){
          rows.push(row3)
         }
         if(row4.components.length >0){
            rows.push(row4)
         }

         if(new2 == true || typetakover == true){
          await interaction.editReply({embeds: [embed], fetchReply: true, components:[row, row2]})

         }
      
         else {
           await interaction.editReply({embeds: [embed], fetchReply: true, components:rows})

         }


    })
  }
  else if(subcommand == "parts"){
    let partarray = []

    for(let part in partdb){
        partarray.push(partdb[part])
    }

    let featured = partarray.filter((part) => part.Price > 0)

    let featurepart = lodash.sample(featured)


    let row = new ActionRowBuilder()
    .setComponents(
      new StringSelectMenuBuilder()
      .setCustomId("part")
      .setPlaceholder("Part")
      .addOptions(
        new StringSelectMenuOptionBuilder()
					.setLabel('Exhausts')
					.setDescription('View the list of exhausts')
          .setEmoji(`${partdb.t1exhaust.Emote}`)
					.setValue('exhaust'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Turbos')
					.setDescription('View the list of turbos')
          .setEmoji(`${partdb.turbo.Emote}`)
					.setValue('turbo'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Engines')
					.setDescription('View the list of engines')
					.setValue('engine'),
      
          new StringSelectMenuOptionBuilder()
					.setLabel('Intakes')
					.setDescription('View the list of intakes')
          .setEmoji(`${partdb.t1intake.Emote}`)
					.setValue('intake'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Tires')
					.setDescription('View the list of tires')
          .setEmoji(`${partdb.t1tires.Emote}`)
					.setValue('tires'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Clutch')
					.setDescription('View the list of clutches')
          .setEmoji(`${partdb.t1clutch.Emote}`)
					.setValue('clutch'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Suspension')
					.setDescription('View the list of suspensions')
          .setEmoji(`${partdb.t1suspension.Emote}`)
					.setValue('suspension'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Brakes')
					.setDescription('View the list of brakes')
          .setEmoji(`${partdb.t1brakes.Emote}`)
					.setValue('brakes'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Gearbox')
					.setDescription('View the list of gearboxes')
          .setEmoji(`${partdb.t1gearbox.Emote}`)
					.setValue('gearbox'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Drivetrain')
					.setDescription('View the list of drivetrains')
          .setEmoji(`${partdb.awd.Emote}`)
					.setValue('drivetrain'),
          new StringSelectMenuOptionBuilder()
					.setLabel('ECU')
					.setDescription('View the list of ecu')
          .setEmoji(`${partdb.t1ecu.Emote}`)
					.setValue('ecu'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Weight')
					.setDescription('View the list of weight')
          .setEmoji(`${partdb.t1weight.Emote}`)
					.setValue('weight'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Spoilers')
					.setDescription('View the list of spoilers')
          .setEmoji(`${partdb.t1spoiler.Emote}`)
					.setValue('spoiler'),

     
      )
    )


    let stats = []
    if(featurepart.Power > 0){
      stats.push(`${emotes.speed} Speed: +${featurepart.Power}`)
    }
    if(featurepart.RemovePower > 0){
      stats.push(`${emotes.speed} Speed: -${featurepart.RemovePower}`)
    }
    if(featurepart.Acceleration > 0){
      stats.push(`${emotes.acceleration} Acceleration: -${featurepart.Acceleration}`)
    }
    if(featurepart.RemoveAcceleration > 0){
      stats.push(`${emotes.acceleration} Acceleration: +${featurepart.RemoveAcceleration}`)
    }
    if(featurepart.Handling > 0){
      stats.push(`${emotes.handling} Handling: +${featurepart.Handling}`)
    }
    if(featurepart.RemoveHandling > 0){
      stats.push(`${emotes.handling} Handling: -${featurepart.RemoveHandling}`)
    }
    if(featurepart.RemoveWeight > 0){
      stats.push(`${emotes.weight} Weight: -${featurepart.RemoveWeight}`)
    }
    if(featurepart.Weight > 0){
      stats.push(`${emotes.weight} Weight: +${featurepart.Weight}`)
    }
    if(featurepart.Stars > 0){
      stats.push(`⭐ Rating: +${featurepart.Stars}`)
    }
    let embed = new EmbedBuilder()
    .setTitle("Parts Store")
    .setThumbnail(`${featurepart.Image}`)
    .addFields({name: `Featured Part`, value: `__${featurepart.Emote} ${featurepart.Name}__\n${toCurrency(featurepart.Price)}\n${stats.join(`\n`)}`})
    .setColor(colors.blue)

   let msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})
   if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 4 && userdata.tutorial.type == "starter"){
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

    interaction.channel.send(`**TUTORIAL:** Ok, we're here at the upgrade shop, now go to the exhausts section of the dealership and run \`/buy [t1exhaust]\` to buy a part`)
  }

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on('collect', async (i) => {
        let partf = i.values[0]
        let partsfilter = partarray.filter((part) => part.Type == partf && part.Price > 0)

        let embed = new EmbedBuilder()
        .setTitle(`Store for ${partf}`)
        .setColor(colors.blue)
        for(let p in partsfilter){
            let par = partsfilter[p]
            let stats = []
            if(par.Power > 0){
              stats.push(`${emotes.speed} Speed: +${par.Power}`)
            }
            if(par.RemovePower > 0){
              stats.push(`${emotes.speed} Speed: -${par.RemovePower}`)
            }
            if(par.Acceleration > 0){
              stats.push(`${emotes.acceleration} Acceleration: -${par.Acceleration}`)
            }
            if(par.RemoveAcceleration > 0){
              stats.push(`${emotes.acceleration} Acceleration: +${par.RemoveAcceleration}`)
            }
            if(par.Handling > 0){
              stats.push(`${emotes.handling} Handling: +${par.Handling}`)
            }
            if(par.RemoveHandling > 0){
              stats.push(`${emotes.handling} Handling: -${par.RemoveHandling}`)
            }
            if(par.RemoveWeight > 0){
              stats.push(`${emotes.weight} Weight: -${par.RemoveWeight}`)
            }
            if(par.Weight > 0){
              stats.push(`${emotes.weight} Weight: +${par.Weight}`)
            }
            if(par.Stars > 0){
              stats.push(`⭐ Rating: +${par.Stars}`)
            }
          
              embed.addFields(
                  {name: `${par.Emote} ${par.Name}`, value: `${emotes.cash} Cost: ${toCurrency(par.Price)}\n${stats.join("\n")}`, inline: true}
              )
        }
        
        await msg.edit({embeds: [embed]})

    })
  }
  },
};
