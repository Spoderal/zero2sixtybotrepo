

const cars = require("../data/cardb.json");
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
const Global = require("../schema/global-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("The car dealership"),
  async execute(interaction) {
    let userdata = (await User.findOne({ id: interaction.user.id })) || (await new User({ id: interaction.user.id }));
    let usercars = userdata.cars || [];
    

    let cardb = require("../data/cardb.json").Cars
    let classdb = require("../data/cardb.json").Tiers
    let dealerarray = []

    for(let car in cardb){
      dealerarray.push(cardb[car])
    }

    let featured = dealerarray.filter((car) => car.Price > 0 && !car.Police)

    let featurecar = lodash.sample(featured)

    console.log(featurecar)

    let row = new ActionRowBuilder()
    .setComponents(
      new StringSelectMenuBuilder()
      .setCustomId("class")
      .setPlaceholder("Class")
      .addOptions(
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
    let page = 0
    let disppage = 1
    let embed = new EmbedBuilder()
    .setTitle("Vehicle Dealership")
    .setThumbnail("https://i.ibb.co/MfdVnTd/icon-dealership.png")
    .setDescription(`**Featured Car**\n${featurecar.Emote} ${featurecar.Name} ${classdb[featurecar.Class.toLowerCase()].Emote}\n${emotes.cash} ${(toCurrency(featurecar.Price))}\n${emotes.speed} Power: ${featurecar.Speed}\n${emotes.acceleration} Acceleration: ${featurecar["0-60"]}\n${emotes.handling} Handling: ${featurecar.Handling}\n${emotes.weight} Weight: ${featurecar.Weight}`)
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

    collector.on('collect', async (i) => {
      
      if(i.customId !== "next" && i.customId !== "prev"){
      
          classpage = i.values[0]

        
        page = 1
      }



          if(i.customId == "next"){
             page ++
          
          }

          if(i.customId == "prev"){
            page --
            
         }
         let classfilter
         if(classpage == "new"){
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

       console.log(classmaps.length)

       if(classmaps[page - 1] == undefined) return interaction.editReply("")

       let displaycars = []       

  
          embed.data.fields = []
          embed.data.description = ""
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

         if(classpage !== "new"){
           embed.setThumbnail(`${classdb[classpage.toLowerCase()].Icon}`)

         }
         embed.setImage()
         .setFooter({text: `Page ${page}/${classmaps.length}`})

         await interaction.editReply({embeds: [embed], fetchReply: true, components: [row, row2]})

    })

  },
};
