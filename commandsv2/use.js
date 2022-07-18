const Discord = require("discord.js")
const cars = require('../cardb.json')
const db = require('quick.db')
const ms = require('ms')
const {SlashCommandBuilder} = require('@discordjs/builders')
const itemdb = require("../items.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('use')
    .setDescription("Use an item")
    .addStringOption((option) => option
    .setName("item")
    .setRequired(true)
    .setDescription("The item to use")
    )
    .addNumberOption((option) => option
    .setName("amount")
    .setRequired(false)
    .setDescription("Amount to use")
    ),
    async execute(interaction) {

      let itemtouse = interaction.options.getString("item")
      let amount = interaction.options.getNumber("amount")
      let amount2 = amount || 1
      let user = interaction.user 

      let items = db.fetch(`items_${user.id}`)
      let emote
      let name
      if(!items.includes(itemtouse.toLowerCase())) return interaction.reply("You don't have this item!")
      let filtereduser = items.filter(function hasmany(part) {
        return part === itemtouse.toLowerCase()
      })
      console.log(filtereduser)
      if(amount2 > 50) return interaction.reply(`The max amount you can use in one command is 50!`)

    if(amount2 > filtereduser.length) return interaction.reply("You don't have that many of that item!")
      let fullname
      console.log(itemtouse)
  
        if(itemdb.Police[itemtouse.toLowerCase()]){
          db.set(`using_${user.id}`, itemtouse.toLowerCase())
          fullname =  `${itemdb.Police[itemtouse.toLowerCase()].Emote} ${itemdb.Police[itemtouse.toLowerCase()].Name}`

        }
       else if(itemdb.Multiplier[itemtouse.toLowerCase()]){
          
          fullname =  `${itemdb.Multiplier[itemtouse.toLowerCase()].Emote} ${itemdb.Multiplier[itemtouse.toLowerCase()].Name}`
        let time = itemdb.Multiplier[itemtouse.toLowerCase()].Time
        console.log(time)
          db.set(`usingmulti_${user.id}`, itemtouse)
          setTimeout(() => {
            db.delete(`usingmulti_${user.id}`)
            console.log('Deleted')
          }, time);

        }

        else  if(itemdb.Other[itemtouse.toLowerCase()] || itemdb.Collectable[0][itemtouse.toLowerCase()]){
          if(itemtouse.toLowerCase() == "pink slip"){
            db.add(`pinkslips_${interaction.user.id}`, 1)
          }
          else if(itemtouse.toLowerCase() == "bank increase"){
      
            let banklimit = db.fetch(`banklimit_${interaction.user.id}`) || 10000

            if(banklimit >= 250000000) {
              db.set(`banklimit_${interaction.user.id}`, 250000000)
            }
            if(banklimit >= 250000000) return interaction.reply(`The bank limit cap is currently $${numberWithCommas(250000000)}!`)
            if(banklimit == 10000 || !banklimit){
              db.set(`banklimit_${interaction.user.id}`, 10000)
            }

            let finalbanklimit = 5000 * amount2
            db.add(`banklimit_${interaction.user.id}`, finalbanklimit)
            let newbank = db.fetch(`banklimit_${interaction.user.id}`)
            if(newbank >= 250000000){
              db.set(`banklimit_${interaction.user.id}`, 250000000)

            }

          }
          else if(itemtouse.toLowerCase() == "super wheelspin"){
            let final = 1 * amount2

            db.add(`swheelspins_${user.id}`, final)
          }
          else if(itemtouse.toLowerCase() == "energy drink"){
            db.set(`energydrink_${user.id}`, true)
            db.set(`energytimer_${user.id}`, Date.now())
          }
          else if(itemtouse.toLowerCase() == "sponsor"){
            db.set(`sponsor_${user.id}`, true)
            db.set(`sponsortimer_${user.id}`, Date.now())
          }
          else if(itemtouse.toLowerCase() == "small vault"){
            let vault = db.fetch(`vault_${user.id}`)
            if(vault) return interaction.reply(`You already have a vault activated, prestige to deactivate it!`)
            db.set(`vault_${user.id}`, "small vault")
          }
          else if(itemtouse.toLowerCase() == "medium vault"){
            let vault = db.fetch(`vault_${user.id}`)
            if(vault) return interaction.reply(`You already have a vault activated, prestige to deactivate it!`)
            db.set(`vault_${user.id}`, "medium vault")
          }
          else if(itemtouse.toLowerCase() == "large vault"){
            let vault = db.fetch(`vault_${user.id}`)
            if(vault) return interaction.reply(`You already have a vault activated, prestige to deactivate it!`)
            db.set(`vault_${user.id}`, "large vault")
          }
          else if(itemtouse.toLowerCase() == "pet egg"){
            let pet = db.fetch(`pet_${interaction.user.id}`)

            if(pet) return interaction.reply(`You already have a pet!`)
            db.set(`pet_${interaction.user.id}`, {Condition: 100, Oil: 100, Gas: 100, Love: 100, Car: 'mini miata', Tier: 1, Color: "Red"})

          }
          else if(itemtouse.toLowerCase() == "water bottle"){
            let watercooldown = db.fetch(`watercooldown_${user.id}`)
            let timeout = 18000000 
            if (watercooldown !== null && timeout - (Date.now() - watercooldown) > 0) {
              let time = ms(timeout - (Date.now() - watercooldown));
              let timeEmbed = new Discord.MessageEmbed()
              .setColor("#60b0f4")
              .setDescription(`You can use a water bottle again in ${time}.`);
              return await interaction.reply({embeds: [timeEmbed]})
          }
            db.delete(`racing_${user.id}`)
            db.delete(`betracing_${user.id}`)
            db.delete(`racingcash_${user.id}`)
            db.delete(`hmracing_${user.id}`)

            db.set(`watercooldown_${user.id}`, Date.now())

            
          }

          
        }
        if (itemdb.Police[itemtouse.toLowerCase()]){
          emote = itemdb.Police[itemtouse.toLowerCase()].Emote
          name = itemdb.Police[itemtouse.toLowerCase()].Name
          type = itemdb.Police[itemtouse.toLowerCase()].Type

        }
        else if(itemdb.Multiplier[itemtouse.toLowerCase()]){
          emote = itemdb.Multiplier[itemtouse.toLowerCase()].Emote
          name = itemdb.Multiplier[itemtouse.toLowerCase()].Name
          type = itemdb.Multiplier[itemtouse.toLowerCase()].Type

        }
        else if(itemdb.Other[itemtouse.toLowerCase()]){
          emote = itemdb.Other[itemtouse.toLowerCase()].Emote
          name = itemdb.Other[itemtouse.toLowerCase()].Name
          type = itemdb.Other[itemtouse.toLowerCase()].Type

        }
        else if(itemdb.Collectable[0][itemtouse.toLowerCase()]){
          emote = itemdb.Collectable[0][itemtouse.toLowerCase()].Emote
          name = itemdb.Collectable[0][itemtouse.toLowerCase()].Name
          type = itemdb.Collectable[0][itemtouse.toLowerCase()].Type

        }

         fullname = `${emote} ${name}`
         db.set(`usingother_${user.id}`, itemtouse)
    
        for (var i = 0; i < amount2; i ++) items.splice(items.indexOf(itemtouse.toLowerCase()), 1)
        db.set(`items_${interaction.user.id}`, items)

  

      
      console.log(fullname)

      await interaction.reply(`Used x${amount2} ${fullname}!`)
     
      
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

