const db = require('quick.db')
const lodash = require('lodash')
const {SlashCommandBuilder} = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unbox')
    .setDescription("Unbox an import crate")
    .addStringOption(option => option
        .setName('crate')
        .setDescription('The crate you want to unbox')
        .addChoice("Common", "common")
        .addChoice("Rare", "rare")
        .addChoice("Exotic", "exotic")
        .addChoice("Drift", "drift")
        .addChoice("Ferrari", "ferrari")
        .addChoice("Z Crate 1", "z crate 1")
        .setRequired(true)
        
    ),
    async execute(interaction) {
        
        let db = require('quick.db')
        let crates = require('../imports.json')
        let cars = require('../cardb.json')
        let list = ['common', 'rare', 'exotic', 'drift', 'z crate 1', 'ferrari']

        let bought = interaction.options.getString("crate")
        let carsu = db.fetch(`cars_${interaction.user.id}`)
        if(!bought) return interaction.reply("**To use this command, specify the crate you want to buy. To check what crates are available check the imports shop by sending /imports.**")
        if(!list.includes(bought)) return interaction.reply("**That crate isn't available!**")
        let garagelimit = db.fetch(`garagelimit_${interaction.user.id}`) || 10

        if(carsu.length >= garagelimit) return interaction.reply(`Your garage is full! Sell a car or get more garage space.`)

        let commonkeys = db.fetch(`commonkeys_${interaction.user.id}`)
        let rarekeys = db.fetch(`rarekeys_${interaction.user.id}`)
        let exotickeys = db.fetch(`exotickeys_${interaction.user.id}`)
        let ferrarikeys = db.fetch(`ferrarikeys_${interaction.user.id}`)

        let driftkeys = db.fetch(`driftkeys_${interaction.user.id}`)
        let gold = db.fetch(`goldbal_${interaction.user.id}`)

            if (bought == "common" && commonkeys < 50) return interaction.reply(`You dont have enough keys! This crate costs 50 common keys`)
            if (bought == "rare" && rarekeys < 25) return interaction.reply(`You dont have enough keys! This crate costs 25 rare keys`)
            if (bought == "exotic" && exotickeys < 20) return interaction.reply(`You dont have enough keys! This crate costs 20 exotic keys`)
            if (bought == "drift" && driftkeys < 5) return interaction.reply(`You dont have enough keys! This crate costs 5 drift keys`)
            if (bought == "z crate 1" && gold < 5) return interaction.reply(`You dont have enough gold! This crate costs 5 gold`)
            if (bought == "ferrari" && ferrarikeys < 100) return interaction.reply(`You dont have enough keys! This crate costs 100 ferrari keys`)

            
            if(bought == "common"){
                db.subtract(`commonkeys_${interaction.user.id}`, 50)
            }
            else if(bought == "rare"){
                db.subtract(`rarekeys_${interaction.user.id}`, 25)
            }
            else if(bought == "exotic"){
                db.subtract(`exotickeys_${interaction.user.id}`, 20)
            }
            else if(bought == "drift"){
                db.subtract(`driftkeys_${interaction.user.id}`, 5)
            }
            else if(bought == "ferrari"){
                db.subtract(`ferrarikeys_${interaction.user.id}`, 100)
            }
            else if(bought == "z crate 1"){
                db.subtract(`gold_${interaction.user.id}`, 20)
            }

            let result
            let rarity
            if(bought == "z crate 1"){
                var rarities = [
                    {
                    type: "Common",
                    chance: 60
                  }, {
                    type: "Rare",
                    chance: 5
                  }, {
                    type: "Uncommon",
                    chance: 34
                  },
                  {
                    type:"Legendary",
                    chance: 1
                  }
                ];
                  
                  function pickRandom() {
                    // Calculate chances for common
                    var filler = 100 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
                  
                    if (filler < 0) {
                      console.log("chances sum is higher than 100!");
                      return;
                    }
                  
                    // Create an array of 100 elements, based on the chances field
                    var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
                    
                    // Pick one
                    var pIndex = Math.floor(Math.random() * 100);
                    console.log(probability)
                     rarity = rarities[probability[pIndex]];
                     console.log(pIndex)
                    console.log(rarity)
                     result = lodash.sample(crates['z crate'][rarity.type.toLowerCase()])
                    console.log(result)
                }

                pickRandom()
                let usercars = db.fetch(`cars_${interaction.user.id}`) || ['None']

                    let car = cars.Cars[result.toLowerCase()]
                    if(usercars.includes(car.Name.toLowerCase())) {
                        db.add(`cash_${interaction.user.id}`, 500000)
                        interaction.reply("You already own this car, so you got $500k instead.")
                        return;
                    } 
                    db.push(`cars_${interaction.user.id}`, car.Name.toLowerCase())
                    db.set(`${car.Name}speed_${interaction.user.id}`, car.Speed)
                    db.set(`${car.Name}resale_${interaction.user.id}`, car.sellprice)
                    db.set(`${car.Name}handling_${interaction.user.id}`, car.Handling)
                    db.set(`${car.Name}060_${interaction.user.id}`, car["0-60"])
                    db.set(`${car.Name}drift_${interaction.user.id}`, car.Drift)
                    db.set(`isselected_${car.Name}_${interaction.user.id}`, car.alias)
                    db.set(`selected_${car.alias}_${interaction.user.id}`, car.Name)
                    db.subtract(`goldbal_${interaction.user.id}`, 5)
                    let embed = new MessageEmbed()
                    .setTitle(`${rarity.type} Car Find`)
                    .addField(`Car`, `${car.Name}`)
                    .setImage(`${car.Image}`)
                    .setColor("#60b0f4")
                    if(car.StatTrack){
                        embed.addField(`Stack Track!`, `\u200b`)
                    }
                    interaction.reply({embeds: [embed]});
            } 

            else {
                let cratecontents = crates[bought].Contents
                let randomitem = lodash.sample(cratecontents)
                let usercars = db.fetch(`cars_${interaction.user.id}`) || ['None']
                if(usercars.includes(randomitem.toLowerCase())) {
                    db.add(`cash_${interaction.user.id}`, 3000)
                    interaction.reply("You already own this car, so you got $3k instead.")
                    return;
                } 
                db.push(`cars_${interaction.user.id}`, randomitem)
                db.set(`${ cars.Cars[randomitem].Name}speed_${interaction.user.id}`, cars.Cars[randomitem].Speed)
                db.set(`${ cars.Cars[randomitem].Name}resale_${interaction.user.id}`, cars.Cars[randomitem].sellprice)
                db.set(`${ cars.Cars[randomitem].Name}handling_${interaction.user.id}`, cars.Cars[randomitem].Handling)
                db.set(`${ cars.Cars[randomitem].Name}060_${interaction.user.id}`, cars.Cars[randomitem]["0-60"])
                db.set(`${ cars.Cars[randomitem].Name}drift_${interaction.user.id}`, cars.Cars[randomitem].Drift)
                db.set(`isselected_${cars.Cars[randomitem.toLowerCase()].Name}_${interaction.user.id}`, cars.Cars[randomitem.toLowerCase()].alias)
                db.set(`selected_${cars.Cars[randomitem].alias}_${interaction.user.id}`, cars.Cars[randomitem].Name)
    
                let embedfinal = new MessageEmbed()
                .setTitle(`Unboxing ${bought} crate...`)
                .setColor("#60b0f4")
    
                interaction.reply({embeds: [embedfinal]})
                setTimeout(() => {
                    embedfinal.setTitle(`Unboxed ${bought} crate!`)
                    embedfinal.addField(`Car`, `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].Name}`)
                    embedfinal.addField(`ID`, `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].alias}`)
                    embedfinal.setImage(cars.Cars[randomitem].Image)
                    interaction.editReply({embeds: [embedfinal]})
                }, 1000);
            }

        
        
    }
  }