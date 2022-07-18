const db = require('quick.db')
const Discord = require('discord.js')
const barns = require('../barns.json')
const lodash = require('lodash')
const carsdb = require('../cardb.json')
const ms = require(`pretty-ms`)
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('barn')
  .setDescription("Search barns for restoration cars")
   .addStringOption((option) => option 
    .setName("rarity")
    .setDescription("The barn you want to search")
    .addChoice('Common', 'common')
    .addChoice('Uncommon', 'uncommon')
    .addChoice('Rare', 'rare')
    .addChoice('Legendary', 'legendary')

    .setRequired(true))
  ,
  async execute(interaction) {
    let created = db.fetch(`created_${interaction.user.id}`)

    if(!created) return interaction.reply(`Use \`/start\` to begin!`)
        let barntimer = db.fetch(`barnfind_${interaction.user.id}`)
        let barnmaps = db.fetch(`barnmaps_${interaction.user.id}`) || 0
        let ubarnmaps = db.fetch(`ubarnmaps_${interaction.user.id}`) || 0
        let rbarnmaps = db.fetch(`rbarnmaps_${interaction.user.id}`) || 0
        let lbarnmaps = db.fetch(`lbarnmaps_${interaction.user.id}`) || 0
        let rarity2 =  interaction.options.getString("rarity")
        if(barnmaps < 0) {
          db.set(`barnmaps_${interaction.user.id}`, 0)
        }
        if(barnmaps == 0 && rarity2 == "common" || !barnmaps && rarity2 == "common") return interaction.reply("You don't have any common barn maps!")
        if(ubarnmaps == 0 && rarity2 == "uncommon" || !ubarnmaps && rarity2 == "uncommon") return interaction.reply("You don't have any uncommon barn maps!")
        if(rbarnmaps == 0 && rarity2 == "rare" || !rbarnmaps && rarity2 == "rare") return interaction.reply("You don't have any rare barn maps!")
        if(lbarnmaps == 0 && rarity2 == "legendary" || !lbarnmaps && rarity2 == "legendary") return interaction.reply("You don't have any legendary barn maps!")

        let timeout = 3600000;

        let house = db.fetch(`house_${interaction.user.id}`)

        if(house && house.Perks.includes("6 Hour cooldown on barns") || house && house.Perks.includes("30 Minutes cooldown on barns")){
          timeout = 1800000
        }
        if(house && house.Perks.includes("3 Hour cooldown on barns") || house && house.Perks.includes("5 Minute cooldown on barns")){
          timeout = 300000
        }

        let garagelimit = db.fetch(`garagelimit_${interaction.user.id}`) || 10
        let usercars = db.fetch(`cars_${interaction.user.id}`) || []
        if(usercars.length >= garagelimit) return interaction.reply("Your spaces are already filled. Sell a car or get more garage space!")

        if (barntimer !== null && timeout - (Date.now() - barntimer) > 0) {
            let time = ms(timeout - (Date.now() - barntimer));
            let timeEmbed = new Discord.MessageEmbed()
            .setColor("#60b0f4")
            .setDescription(`Please wait ${time} before searching barns again.`);
            interaction.reply({embeds: [timeEmbed]})
            return;
        }
        var rarities = [{
            type: "Common",
            chance: 0
          }, {
            type: "Legendary",
            chance: 10
          }, {
            type: "Rare",
            chance: 30
          }, {
            type: "Uncommon",
            chance: 50
          }];
          
          function pickRandom() {
            // Calculate chances for common
            var filler = 100 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
          
            if (filler <= 0) {
              console.log("chances sum is higher than 100!");
              return;
            }
          
            // Create an array of 100 elements, based on the chances field
            var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
            // Pick one
            var pIndex = Math.floor(Math.random() * 100);
            var rarity = rarities[probability[pIndex]];
            let barnfind = lodash.sample(barns.Barns[rarity2.toLowerCase()])
            let resale
            let namefor
            let color
            switch(rarity2){
              case "common":
                color = "#388eff"
                resale = "1000"
                namefor = "Common"
                break;
                case "uncommon":
                  color = "#f9ff3d"
                  resale = "2500"
                  namefor = "Uncommon"
                  break;
                  case "rare":
                  color = "#a80000"
                  resale = "10000"
                  namefor = "Rare"
                  break;
                  case "legendary":
                    color = "#44e339"
                    resale = "25000"
                    namefor = "Legendary"
                    break;
            }



            let cars = db.fetch(`cars_${interaction.user.id}`) || []
            let car = carsdb.Cars[barnfind.toLowerCase()]
            if(cars.includes(car.Name.toLowerCase())) {
            db.add(`cash_${interaction.user.id}`, resale)
            db.set(`barnfind_${interaction.user.id}`, Date.now())
             interaction.reply(`You found a ${car.Name} but you already have this car, so you found $${numberWithCommas(resale)} instead.`)
             return;
            }
            db.push(`cars_${interaction.user.id}`, car.Name.toLowerCase())
            db.set(`${car.Name}restoration_${interaction.user.id}`, 0)
            db.set(`${car.Name}speed_${interaction.user.id}`, car.Speed)
            db.set(`${car.Name}060_${interaction.user.id}`, car["0-60"])
            db.set(`barnfind_${interaction.user.id}`, Date.now())
            db.set(`isselected_${car.Name}_${interaction.user.id}`, car.alias)
           db.set(`selected_${car.alias}_${interaction.user.id}`, car.Name)

            switch(rarity2){
              case "common":
                db.subtract(`barnmaps_${interaction.user.id}`, 1)

                break;
                case "uncommon":
                db.subtract(`ubarnmaps_${interaction.user.id}`, 1)

                break;
                case "rare":
                  db.subtract(`rbarnmaps_${interaction.user.id}`, 1)
  
                  break;
                  case "legendary":
                  db.subtract(`lbarnmaps_${interaction.user.id}`, 1)
  
                  break;
            }
            let embed = new Discord.MessageEmbed()
            .setTitle(`${namefor} Barn Find`)
            .addField(`Car`, `${car.Name}`)
            .addField(`ID`, `${car.alias}`)
            .setImage(car.Image)
            .setColor(color)
            interaction.reply({embeds: [embed]});
          }
          
          pickRandom();
          
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convert(val) {
  
  // thousands, millions, billions etc..
  var s = ["", "k", "m", "b", "t"];

  // dividing the value by 3.
  var sNum = Math.floor(("" + val).length / 3);

  // calculating the precised value.
  var sVal = parseFloat((
    sNum != 0 ? (val / Math.pow(1000, sNum)) : val).toPrecision(2));
  
  if (sVal % 1 != 0) {
      sVal = sVal.toFixed(1);
  }

  // appending the letter to precised val.
  return sVal + s[sNum];
}