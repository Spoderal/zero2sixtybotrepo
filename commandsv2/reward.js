const discord = require('discord.js')
const db = require('quick.db')
const seasons = require('../seasons.json')
const cardb = require('../cardb.json')
const ms = require('pretty-ms')
const {SlashCommandBuilder} = require('@discordjs/builders')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('reward')
    .setDescription("Redeem a summer reward")
    .addStringOption((option) => option 
    .setName("type")
    .setRequired(true)
    .setDescription("Decide if you want to claim a reward from a crew or season")
    .addChoice("Season", "season")
    .addChoice("Crew", "crew")
    )
    .addStringOption((option) => option 
    .setName("reward")
    .setDescription("The # of the reward you'd like to redeem")
    .setRequired(true)
    
    ),
    async execute(interaction) {

        let type = interaction.options.getString("type")

        if(type == "season"){

            let rew = interaction.options.getString("reward")
            let uid = interaction.user.id
      

            let redeemed = db.fetch(`summer_redeemed_rewards_${uid}`) || ['']
            if(!db.fetch(`summer_redeemed_rewards_${uid}`) || db.fetch(`summer_redeemed_rewards_${uid}`) == null || redeemed == ['']){
                db.push(`summer_redeemed_rewards_${uid}`, 'Started')
            }
            let newredeemed = db.fetch(`summer_redeemed_rewards_${uid}`) 
            
            let noto = db.fetch(`notoriety3_${uid}`) || 0
            if(!rew) return interaction.reply({content:"Specify which reward you'd like to redeem. (1, 2, 3, etc)", ephemeral: true})
            if(newredeemed.includes(rew)) return interaction.reply({content:"You've already claimed this reward!", ephemeral: true})
            if(rew > 50 || isNaN(rew)) return interaction.reply({content:"Thats not a reward!", ephemeral: true})
            if(!newredeemed.includes(`${rew - 1}`) && rew != "1") return interaction.reply({content:"You need to claim the reward before this before you can claim it!", ephemeral: true})
            let item = seasons.Seasons.Summer.Rewards[rew]
            if(noto < item.Required) return interaction.reply({content:`You need ${item.Required} notoriety for this reward!`, ephemeral: true})
            if(item.Item.endsWith("Cash")){
                console.log("Cash")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed $${amount}`)
                db.add(`cash_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("RP")) {
                console.log("RP")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} RP`)
                db.add(`rp_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Barn Maps") || item.Item.endsWith("Barn Map")) {
                console.log("Barn Maps")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Barn Maps`)
                db.add(`barnmaps_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
                
            }
    
            else if (item.Item.endsWith("Common Keys")) {
                console.log("Common Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Common Keys`)
                db.add(`commonkeys_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Drift Keys")) {
                console.log("Drift Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Drift Keys`)
                db.add(`driftkeys_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Garage Space") || item.Item.endsWith("Garage Spaces")) {
                console.log("Garage Space")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Garage Spaces`)
                if(!db.fetch(`garagelimit_${uid}`)){
                    db.set(`garagelimit_${uid}`, 10)
                }
                db.add(`garagelimit_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Rare Keys")) {
                console.log("Rare Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Rare Keys`)
                db.add(`rarekeys_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Exotic Keys")) {
                console.log("Exotic Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Exotic Keys`)
                db.add(`exotickeys_${uid}`, amount)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Helmet")) {
                console.log("Helmet")
                console.log(item.Number)
            
                interaction.reply(`Redeemed ${item.Item}`)
                db.push(`pfps_${uid}`, item.Item.toLowerCase())
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Part")) {
                console.log("Part")
                console.log(item.Number)
                let part = item.Item.split(' ')[0]
            
                interaction.reply(`Redeemed ${part}`)
                db.push(`parts_${uid}`, part.toLowerCase())
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Badge")){
                let badge = item.Item
                db.push(`badges_${uid}`, badge.toLowerCase())
                interaction.reply(`Redeemed ${badge}`)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            
            }
            
            else {
                console.log("Car")
                console.log(item.Item)
                let cartogive = cardb.Cars[item.Item.toLowerCase()]
                db.push(`cars_${uid}`, cartogive.Name.toLowerCase())
                db.set(`${cartogive.Name}speed_${uid}`, cartogive.Speed)
                db.set(`${cartogive.Name}resale_${uid}`, cartogive.sellprice)
                db.set(`${cartogive.Name}060_${uid}`, cartogive["0-60"])
                if(cardb.Cars[item.Item.toLowerCase()].Rally){
                    db.set(`${cartogive.Name}offroad_${uid}`, cartogive.Rally)
    
                }
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
                interaction.reply(`Redeemed ${cartogive.Name}`)
                db.push(`summer_redeemed_rewards_${uid}`, `${item.Number}`)
            
            }
    
            db.subtract(`notoriety3_${uid}`, item.Required)
        }
        else if(type == "crew"){
            let rew = interaction.options.getString("reward")
            let uid = interaction.user.id

            let crew = db.fetch(`crew_${uid}`)

            if(!crew) return interaction.reply(`You need to be in a crew!`)
            let timeout = 259200000
            let joined = db.fetch(`joinedcrew_${uid}`)

            if (joined !== null && timeout - (Date.now() - joined) > 0) {
                let time = ms(timeout - (Date.now() - joined));
                let timeEmbed = new discord.MessageEmbed()
                .setColor("#60b0f4")            
                .setDescription(`You need to be in this crew for ${time} before claiming rewards.`);
               return interaction.reply({embeds: [timeEmbed]})
            }
            let redeemed = db.fetch(`crew1redeemed_${uid}`) || ['']
            if(!db.fetch(`crew1redeemed_${uid}`) || db.fetch(`crew1redeemed_${uid}`) == null || redeemed == ['']){
                db.push(`crew1redeemed_${uid}`, 'Started')
            }
            let rewardss = require('../seasons.json').Seasons.Crew1.Rewards
            let newredeemed = db.fetch(`crew1redeemed_${uid}`) 
            
            let crewinf = db.fetch(`crew_${crew}`)
            let crewrank = crewinf.Rank
            if(!rew) return interaction.reply({content:"Specify which reward you'd like to redeem. (1, 2, 3, etc)", ephemeral: true})
            if(newredeemed.includes(rew)) return interaction.reply({content:"You've already claimed this reward!", ephemeral: true})
            if(!rewardss[rew] || isNaN(rew)) return interaction.reply({content:"Thats not a reward!", ephemeral: true})
            if(!newredeemed.includes(`${rew - 1}`) && rew != "1" && rew != "100") return interaction.reply({content:"You need to claim the reward before this before you can claim it!", ephemeral: true})
            let item = seasons.Seasons.Crew1.Rewards[rew]
            if(crewrank < item.Number) return interaction.reply({content:`You need crew rank ${item.Number} for this reward!`, ephemeral: true})
            if(item.Item.endsWith("Cash")){
                console.log("Cash")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed $${amount}`)
                db.add(`cash_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Notoriety")) {
                console.log("Notoriety")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Notoriety`)
                db.add(`notoriety3_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Legendary Barn Maps") || item.Item.endsWith("Legendary Barn Map")) {
                console.log("Barn Maps")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Barn Maps`)
                db.add(`lbarnmaps_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
                
            }
            else if (item.Item.endsWith("Bank Increase")) {
                console.log("Bank Increase")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Bank Increase`)
                db.push(`items_${uid}`, "bank increase")
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
                
            }
            else if (item.Item.endsWith("Super wheelspin") || item.Item.endsWith("Super wheelspins")) {
                console.log("Super wheelspin")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Super wheelspins`)
                db.add(`swheelspins_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
                
            }
    
            else if (item.Item.endsWith("Common Keys")) {
                console.log("Common Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Common Keys`)
                db.add(`commonkeys_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Drift Keys")) {
                console.log("Drift Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Drift Keys`)
                db.add(`driftkeys_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Garage Space") || item.Item.endsWith("Garage Spaces")) {
                console.log("Garage Space")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Garage Spaces`)
                if(!db.fetch(`garagelimit_${uid}`)){
                    db.set(`garagelimit_${uid}`, 10)
                }
                db.add(`garagelimit_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Rare Keys")) {
                console.log("Rare Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Rare Keys`)
                db.add(`rarekeys_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Exotic Keys")) {
                console.log("Exotic Keys")
                let amount = item.Item.split(' ')[0]
                console.log(item.Number)
                console.log(amount)
                interaction.reply(`Redeemed ${amount} Exotic Keys`)
                db.add(`exotickeys_${uid}`, amount)
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            else if (item.Item.endsWith("Part")) {
                console.log("Part")
                console.log(item.Number)
                let part = item.Item.split(' ')[0]
            
                interaction.reply(`Redeemed ${part}`)
                db.push(`parts_${uid}`, part.toLowerCase())
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
            }
            
            else {
                console.log("Car")
                console.log(item.Item)
                let cartogive = cardb.Cars[item.Item.toLowerCase()]
                db.push(`cars_${uid}`, cartogive.Name.toLowerCase())
                db.set(`${cartogive.Name}speed_${uid}`, cartogive.Speed)
                db.set(`${cartogive.Name}resale_${uid}`, cartogive.sellprice)
                db.set(`${cartogive.Name}060_${uid}`, cartogive["0-60"])
                if(cardb.Cars[item.Item.toLowerCase()].Rally){
                    db.set(`${cartogive.Name}offroad_${uid}`, cartogive.Rally)
    
                }
                db.push(`crew1redeemed_${uid}`, `${item.Number}`)
                interaction.reply(`Redeemed ${cartogive.Name}`)
            
            }
    
        }
        }
    
}
