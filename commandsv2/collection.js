const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const lodash = require("lodash");
  const User = require("../schema/profile-schema");
  const colors = require("../common/colors");
  const emotes = require("../common/emotes");
  const { numberWithCommas } = require("../common/utils");
  const cardb = require("../data/cardb.json")
  const branddb = require("../data/brands.json")
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("collection")
      .setDescription("Check out your collection")
      .addUserOption((option) =>
        option
          .setName("user")
          .setRequired(false)
          .setDescription("The user to view the garage of")
      )
      .addStringOption((option) =>
        option
          .setName("brand")
          .setRequired(false)
          .setDescription("Filter your collection by brand")
      ),

      
    async execute(interaction) {
      let user = interaction.options.getUser("user") || interaction.user;
  
      let udata = await User.findOne({ id: user.id });
      let filter = interaction.options.getString("brand");
      let collection = udata.cars

      if(filter){
        await interaction.reply({content: "Please wait...", fetchReply: true})
        if(!branddb[filter.toLowerCase()]){
          return interaction.editReply({content: "Invalid brand", ephemeral: true})
        }
        let brands = []
        let cars = []
        for(let i in cardb.Cars){
          let car = cardb.Cars[i]
          cars.push({
            Emote: car.Emote,
            Name: car.Name
          })
        }
        
        cars = cars.filter((car) => car.Emote == branddb[filter.toLowerCase()].emote)

        cars = lodash.chunk(cars, 10)
        let cardisplay = []
        cars[0].map((car) => {
          let carcollected = collection.filter((car2) => car2.Name.toLowerCase() == car.Name.toLowerCase())
          let emote = "❌"
          if(carcollected.length > 0){
            emote = "✅"
          }
          cardisplay.push(`${car.Emote} ${car.Name} : ${emote}`)
        }
        )

        let embed = new EmbedBuilder()
        .setTitle(`Your Collection of ${branddb[filter.toLowerCase()].name} cars`)
        .setDescription(`${cardisplay.join('\n')}\n||EGG??? WHERE? <:egg_red:964250156981698651> CODE: FERRARIFOREVER||`)
        .setColor(colors.blue)
        .setFooter({text: `Page 1 of ${cars.length}`})
        .setAuthor({name: user.username, iconURL: user.displayAvatarURL({dynamic: true})})

        let row = new ActionRowBuilder()

        .addComponents(
          new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle("Secondary"),
          new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle("Secondary")
        )

        await interaction.editReply({embeds: [embed], components: [row], fetchReply: true})

        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        }
        let collector2 = interaction.channel.createMessageComponentCollector({
          filter: filter2,
        })

        let page = 1;

        collector2.on("collect", async (i) => {

          if(i.customId == "next"){
            if(page == cars.length){
              page = 1
            } else {
              page += 1
            }
          } else if(i.customId == "previous"){
            if(page == 1){
              page = cars.length
            } else {
              page -= 1
            }
          }

          let cardisplay = []
          cars[page - 1].map((car) => {
            let carcollected = collection.filter((car2) => car2.Name.toLowerCase() == car.Name.toLowerCase())
            let emote = "❌"
            if(carcollected.length > 0){
              emote = "✅"
            }
            cardisplay.push(`${car.Emote} ${car.Name} : ${emote}`)
          }
          )

          let embed = new EmbedBuilder()
          .setTitle(`Your Collection of ${branddb[filter.toLowerCase()].name} cars`)
          .setDescription(`${cardisplay.join('\n')}`)
          .setColor(colors.blue)
          .setFooter({text: `Page ${page} of ${cars.length}`})
          .setAuthor({name: user.username, iconURL: user.displayAvatarURL({dynamic: true})})

          await interaction.editReply({embeds: [embed], components: [row]})

        }
        )

      }
      else {

        await interaction.reply({content: "Please wait...", fetchReply: true})
          let brands = []
          let cars = []
  
          for(let i in cardb.Cars){
        let car = cardb.Cars[i]
        cars.push({
          Emote: car.Emote,
          Name: car.Name
        })
    }
  
          for(let i in branddb){
              let brand = branddb[i]
              let carbrands = cars.filter((car) => car.Emote == brand.emote)
              let brandcars = []
              for(let car in carbrands){
                  brandcars.push(carbrands[car])
              }
  
              brands.push({
                brand: brand.name,
                cars: brandcars
              })
          }
  
  
  
          let brandslist = lodash.chunk(brands, 10);
          let branddisplay = []
  
        brandslist[0].map((brand) => {
  
          let brandscollected = collection.filter((car) => cardb.Cars[car.Name.toLowerCase()].Emote == branddb[brand.brand.toLowerCase()].emote)
          
  
          branddisplay.push(`${branddb[brand.brand.toLowerCase()].emote} ${branddb[brand.brand.toLowerCase()].name} : ${brandscollected.length}/${brand.cars.length}`)
  
        })
  
      
  
        let embed = new EmbedBuilder()
        .setTitle("Your Collection")
        .setColor(colors.blue)
        .setAuthor({name: user.username, iconURL: user.displayAvatarURL({dynamic: true})})
        .setDescription(`You've collected ${collection.length}/${cars.length} cars\n\n${branddisplay.join("\n")}`)
        .setFooter({text: `Page 1 of ${brandslist.length}`})
  
        let row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle("Secondary"),
          new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle("Secondary")
        )
  
  
        await interaction.editReply({embeds: [embed], components: [row], fetchReply: true})
  
        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
        let collector2 = interaction.channel.createMessageComponentCollector({
          filter: filter2,
        });
  
        let page = 1;
  
        collector2.on("collect", async (i) => {
          if(i.customId == "next"){
            if(page == brandslist.length){
              page = 1
            } else {
              page += 1
            }
          } else if(i.customId == "previous"){
            if(page == 1){
              page = brandslist.length
            } else {
              page -= 1
            }
          }
  
          let branddisplay = []
  
          brandslist[page - 1].map((brand) => {
            console.log(brand)
            let brandscollected = collection.filter((car) => car.Emote == branddb[brand.brand.toLowerCase()].emote)
            
            if(branddb[brand.brand.toLowerCase()]){
              branddisplay.push(`${branddb[brand.brand.toLowerCase()].emote} ${branddb[brand.brand.toLowerCase()].name} : ${brandscollected.length}/${brand.cars.length}`)

            }
    
          })
  
          let embed = new EmbedBuilder()
          .setTitle("Your Collection")
          .setColor(colors.blue)
          .setAuthor({name: user.username, iconURL: user.displayAvatarURL({dynamic: true})})
          .setDescription(`You've collected ${collection.length}/${cars.length} cars\n\n${branddisplay.join("\n")}`)
          .setFooter({text: `Page ${page} of ${brandslist.length}`})
  
          await interaction.editReply({embeds: [embed], components: [row]})
  
        }
        )
      }


    },
  };
  