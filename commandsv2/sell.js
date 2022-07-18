const { MessageFlags } = require('discord.js')
const splice = require('splice')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
  .setName('sell')
  .setDescription("Sell a car or part")
  .addStringOption((option) =>option
  .setName("item")
  .setDescription("The item you want to sell")
  .setRequired(true))
  .addNumberOption((option) =>option
  .setName("amount")
  .setDescription("The amount to sell")
  .setRequired(true)
  ),

  async execute(interaction) {

      let cars = require('../cardb.json')
      let parts = require('../partsdb.json')
      let userid = interaction.user.id
      let db = require('quick.db')
      let profilestuff = require('../pfpsdb.json')
      let usercars = db.fetch(`cars_${userid}`)
      let userparts = db.fetch(`parts_${userid}`)

      let selling = interaction.options.getString("item")
      let amount = interaction.options.getNumber("amount") || 1

      if(!selling) return interaction.reply("Specify a car or part!")
    
      
      
      if(cars.Cars[selling.toLowerCase()]){
          if(!usercars.includes(cars.Cars[selling.toLowerCase()].Name.toLowerCase())) return interaction.reply("You dont have that car!")
          let resale = db.fetch(`${cars.Cars[selling.toLowerCase()].Name}resale_${userid}`)
          let selected = db.fetch(`isselected_${cars.Cars[selling.toLowerCase()].Name}_${userid}`)
          let selected2 = db.fetch(`selected_${cars.Cars[selling.toLowerCase()].Name}_${userid}`)
          if(selected || selected2) return interaction.reply("You need to deselect this car before selling it! Run /ids deselect [id]")
          let filtereduser2 = usercars.filter(function hasmany(car) {
            return car === selling.toLowerCase()
          })
          console.log(filtereduser2)
        if(amount > filtereduser2.length) return interaction.reply("You don't have that many of that car!")
          for (var i = 0; i < 1; i ++) usercars.splice(usercars.indexOf(selling.toLowerCase()), amount)
          db.set(`cars_${userid}`, usercars)
          let resaletext = 0
          if(resale > 0){
              db.add(`cash_${userid}`, resale)
              resaletext = resale
          }
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}speed_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}turbo_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}engine_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}exhaust_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}tires_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}intake_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}suspension_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}speed_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}spoiler_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}060_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}drift_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}snowscore_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}ecu_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}clutch_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}clutch_${userid}`)
          db.delete(`${cars.Cars[selling.toLowerCase()].Name}handling_${userid}`)

          interaction.reply(`You sold your ${selling.toLowerCase()} for $${numberWithCommas(resaletext)}!`)
    
      }
      
      else if(parts.Parts[selling.toLowerCase()]){
          if(!userparts.includes(parts.Parts[selling.toLowerCase()].Name.toLowerCase())) return interaction.reply("You dont have that part!")
          if(parts.Parts[selling.toLowerCase()].sellprice == "N/A" || !parts.Parts[selling.toLowerCase()].sellprice) return interaction.reply("That part is unsellable!")
          let filtereduser = userparts.filter(function hasmany(part) {
              return part === selling.toLowerCase()
            })
            console.log(filtereduser)
          if(amount > filtereduser.length) return interaction.reply("You don't have that many of that part!")
          if(parts.Parts[selling.toLowerCase()].sellprice > 0){
            db.add(`cash_${userid}`, parts.Parts[selling.toLowerCase()].sellprice * amount)

        }
          let resale = parts.Parts[selling.toLowerCase()].Price * 0.35
          for (var i = 0; i < amount; i ++) userparts.splice(userparts.indexOf(selling.toLowerCase()), 1)
          db.set(`parts_${userid}`, userparts)
          let finalamount = amount * resale
          interaction.reply(`You sold your ${selling} for $${numberWithCommas(finalamount)}!`)
    
      }
      else if(selling.toLowerCase() == "legendary barn maps" || selling.toLowerCase() == "legendary barn map" || selling.toLowerCase() == "rare barn maps" || selling.toLowerCase() == "rare barn map" || selling.toLowerCase() == "uncommon barn maps" || selling.toLowerCase() == "uncommon barn map" || selling.toLowerCase() == "common barn maps" || selling.toLowerCase() == "common barn map"){

        let exchange
        let maps
        
          if( selling.startsWith("legendary")){
            exchange = 1000
            maps = db.fetch(`lbarnmaps_${interaction.user.id}`) || 0

          }
        else  if( selling.startsWith("rare")){
            exchange = 500
            maps = db.fetch(`rbarnmaps_${interaction.user.id}`) || 0

          }
          else  if( selling.startsWith("uncommon")){
            exchange = 100
            maps = db.fetch(`ubarnmaps_${interaction.user.id}`) || 0

          }
          else  if( selling.startsWith("common")){
            exchange = 50
            maps = db.fetch(`barnmaps_${interaction.user.id}`) || 0

          }
        if(maps < amount) return interaction.reply(`You dont have enough barn maps!`)

      
        let finalam = exchange * amount
        
        if( selling.startsWith("legendary")){
          db.subtract(`lbarnmaps_${interaction.user.id}`, amount)

        }
      else  if( selling.startsWith("rare")){
        db.subtract(`rbarnmaps_${interaction.user.id}`, amount)


        }
        else  if( selling.startsWith("uncommon")){
          db.subtract(`ubarnmaps_${interaction.user.id}`, amount)


        }
        else  if( selling.startsWith("common")){
           db.subtract(`barnmaps_${interaction.user.id}`, amount)

        }

        db.add(`cash_${interaction.user.id}`, finalam)

        interaction.reply(`Sold ${amount} ${selling} for $${numberWithCommas(finalam)}`)
        
      }
    
    
      else if(profilestuff.Pfps[selling.toLowerCase()]){
              let pfps = db.fetch(`pfps_${userid}`)
    
              const filtered = pfps.filter(e => e !== selling.toLowerCase());
              db.set(`pfps_${userid}`, filtered)
    
              interaction.reply(`You sold your ${selling} for $0!`)
    
          }
    
       
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
   
  }
  }
  
  