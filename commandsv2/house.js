const db = require('quick.db')
const Discord = require('discord.js')
const cars = require('../cardb.json')
const badgedb = require('../badgedb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')
const housedb = require("../houses.json")
const lodash = require("lodash")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('house')
    .setDescription("View your house and its perks")
    .addBooleanOption((option) => option
    .setName("sell")
    .setDescription("Sell your house")
    .setRequired(false)
    ),
    async execute(interaction) {

        let user = interaction.user
        let uid = user.id

        let house = db.fetch(`house_${uid}`)
        let selloption = interaction.options.getBoolean("sell")

        if(!house) return interaction.reply(`You don't have a house! View the available houses with \`/houses\``)

        if(selloption){
            let housename = house.name.toLowerCase()

            let price = housedb[housename].Price

            let items = db.fetch(`items_${uid}`) || []

            if(!items.includes("for sale sign")) return interaction.reply("You need a for sale sign!")
            for (var i = 0; i < 1; i ++) items.splice(items.indexOf("for sale sign"), 1)
            db.set(`items_${interaction.user.id}`, items)

            db.delete(`partdiscount_${interaction.user.id}`)
            db.delete(`cardiscount_${interaction.user.id}`)
        if(housedb[housename].Rewards.includes("+2 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.subtract(`garagelimit_${interaction.user.id}`, 2)
            }
            else  if(housedb[housename].Rewards.includes("+3 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.subtract(`garagelimit_${interaction.user.id}`, 3)
            }
            else  if(housedb[housename].Rewards.includes("+4 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.subtract(`garagelimit_${interaction.user.id}`, 4)
            }
            db.add(`cash_${interaction.user.id}`, housedb[housename].Price);

            interaction.reply(`You sold your ${housedb[housename].Name} for $${numberWithCommas(housedb[housename].Price)}`)

            db.delete(`house_${uid}`)

            
        }
        else {
            let perks = house.Perks
            let image = housedb[house.name.toLowerCase()].Image
            let houseperks = housedb[house.name.toLowerCase()].Rewards
            console.log(`db: ${houseperks}`)
            console.log(`user: ${perks}`)
            let containsAll = houseperks.every(element => {
              return perks.includes(element);
            });
      
            if(!containsAll){
              db.set(`house_${uid}.Perks`, houseperks)
              if(housedb[house.name.toLowerCase()].Rewards.includes("+2 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.add(`garagelimit_${interaction.user.id}`, 2)
            }
            else  if(housedb[house.name.toLowerCase()].Rewards.includes("+3 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.add(`garagelimit_${interaction.user.id}`, 3)
            }
            else if(housedb[house.name.toLowerCase()].Rewards.includes("+4 Garage spaces")){
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.add(`garagelimit_${interaction.user.id}`, 4)
            }
            }
    
            let embed = new Discord.MessageEmbed()
            .setTitle(`${house.name}`)
            .addField("Perks", `${perks.join('\n')}`)
            .setColor("#60b0f4")
            .setImage(image)
            
            interaction.reply({embeds: [embed]})

        }
    }
    
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}