const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

const colors = require("../common/colors");
const cardb = require("../data/cardb.json");
const { toCurrency } = require("../common/utils");
const lodash = require("lodash")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("vault")
    .setDescription("View your vault")
    .addSubcommand((cmd) => cmd
    .setDescription("View your vault")
    .setName("view")
    
    )
    .addSubcommand((cmd) => cmd
    .setDescription("Sell the cars in your vault")
    .setName("clear")
    
    )
    .addSubcommand((cmd) => cmd
    .setDescription("Take a car out of your vault")
    .setName("remove")
    .addStringOption((option) =>
    option
      .setName("car")
      .setRequired(true)
      .setDescription("The car to remove")
  )
  
    )
    .addSubcommand((cmd) => cmd
    .setDescription("Add a car to your vault")
    .setName("add")
    .addStringOption((option) =>
    option
      .setName("car")
      .setRequired(true)
      .setDescription("The car to add")
  )
  
    ),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let command = interaction.options.getSubcommand()
    let vault = userdata.vault



    if(command == "view"){
        let displaypage = 1

        if(!vault || vault == null || vault == [] || vault.length == 0){
            return interaction.reply(`You don't have any vaulted cars! Try obtaining some cars first and they'll appear here!`)
        }
        console.log(vault)
        let vault2 = lodash.chunk(
            vault.map((a) => a),
            6
          )
        let embed = new EmbedBuilder()
        .setTitle(`Vault Page ${displaypage}/${vault2.length}`)
        .setColor(colors.blue)
        
        for(let v in vault2[0]){
            let car = vault2[0][v]
    
            embed.addFields({name: `${car.Emote} ${car.Name}`, value: `\`ID: ${car.ID}\`\nPower: ${car.Speed}`, inline: true})
        }

        let  row = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("⬅️")
            .setStyle("Secondary"),
            new ButtonBuilder()
            .setCustomId("next")
            .setLabel("➡️")
            .setStyle("Secondary")
        )
    
        let msg = await interaction.reply({embeds: [embed], components: [row]})

        let filter2 = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector2 = msg.createMessageComponentCollector({
            filter: filter2,
          });
    
          let page = 0
    
          collector2.on('collect', async (i) => {
            if(i.customId == "next"){
                page++
                if(vault[page] == undefined) {
                    page--
                    embed.setDescription("No more pages!")
    
                }
                else {
    
                
                 displaypage++
                embed.data.fields = []
                for(let v in vault2[0]){
                    let car = vault2[0][v]
            
                    embed.addFields({name: `${car.Emote} ${car.Name}`, value: `\`ID: ${car.ID}\`\nPower: ${car.Speed}`, inline: true})
                }
    
                embed.setTitle(`Vault Page ${displaypage}/${vault2.length}`)
            }
                await interaction.editReply({embeds: [embed], components: [row]})
            }
            else if(i.customId == "previous"){
                page--
              if(vault[page] == undefined) {
                page++
                    embed.setDescription("No more pages!")
    
                }
                else {
    
                
                displaypage--
                embed.data.fields = []
                for(let v in vault2[0]){
                    let car = vault2[0][v]
            
                    embed.addFields({name: `${car.Emote} ${car.Name}`, value: `\`ID: ${car.ID}\`\nPower: ${car.Speed}`, inline: true})
                }
    
                embed.setTitle(`Vault Page ${displaypage}/${vault2.length}`)
            }
                await interaction.editReply({embeds: [embed], components: [row]})
            }
          })
    }

    else if(command == "remove"){
        if(!vault || vault == null || vault == [] || vault.length == 0){
            return interaction.reply(`You don't have any vaulted cars! Try obtaining some cars first and they'll appear here!`)
        }
        let garageL = userdata.garageLimit
        let uservault = userdata.vault
        let carl = userdata.cars.length
        let newlength = carl + 1
        let cartoremove = interaction.options.getString("car")

        console.log(newlength)
        
        if(garageL <= newlength) return interaction.reply(`You don't have enough garage space!`) 
        let filt = uservault.filter((car) => car.Name.toLowerCase() == cartoremove.toLowerCase())

        if(!filt[0]) return await interaction.reply("You don't have this car! Try using the cars full name")

        for (var b = 0; b < uservault.length; b++){
            console.log(uservault[b])
            if (uservault[b].Name.toLowerCase() === cartoremove.toLowerCase()) {
                uservault.splice(b, 1);
              break;
            }
        }


        userdata.cars.push(filt[0])

        userdata.save()

        await interaction.reply(`✅`)
    }

    else if(command == "add"){
        let garageL = userdata.garageLimit
        let uservault = userdata.vault
        let usercars = userdata.cars
        let carl = userdata.cars.length
        let newlength = carl + 1
        let cartoremove = interaction.options.getString("car")

        console.log(newlength)
        
        let filt = usercars.filter((car) => car.Name.toLowerCase() == cartoremove.toLowerCase())

        if(!filt[0]) return await interaction.reply("You don't have this car! Try using the cars full name")
        console.log(filt)
        for (var c = 0; c < usercars.length; c++){
            console.log(usercars[c])
            if (usercars[c].Name.toLowerCase() === cartoremove.toLowerCase()) {
                usercars.splice(c, 1);
              break;
            }
        }


        userdata.vault.push(filt[0])

        userdata.save()

        await interaction.reply(`✅`)
    }

    else if(command == "clear"){
        let uservault = userdata.vault
        let final = 0
        
        for (let d in uservault){
            console.log(uservault[d])
            let price = cardb.Cars[uservault[d].Name.toLowerCase()].Price
            if (price == 0 || !price) {
                if(cardb.Cars[uservault[d].Name.toLowerCase()].Price == 0 && cardb.Cars[uservault[d].Name.toLowerCase()].sellprice > 0){
                  price = cardb.Cars[uservault[d].Name.toLowerCase()].sellprice
                }
                else {
                    price = cardb.Cars[uservault[d].Name.toLowerCase()].Price * 0.75;
                }
              }
              console.log(price)
         final += price
          console.log(final)
        }




        userdata.cash += final
        userdata.vault = []

        userdata.save()

        await interaction.reply(`✅ Sold all your cars in your vault for ${toCurrency(final)}`)
    }

  },
};
