const db = require('quick.db')
const Discord = require('discord.js')
const barns = require('../barns.json')
const lodash = require('lodash')
const carsdb = require('../cardb.json')
const ms = require(`pretty-ms`)
const {SlashCommandBuilder} = require('@discordjs/builders')
const User = require('../schema/profile-schema')
const Cooldowns = require('../schema/profile-schema')

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

    let userid = interaction.user.id

    let userdata =  await User.findOne({id: userid}) || new User({id: userid})
    let cooldowns =  await Cooldowns.findOne({id: userid}) || new Cooldowns({id: userid})

        let barntimer = cooldowns.barn
        let barnmaps = userdata.cmaps
        let ubarnmaps = userdata.ucmaps
        let rbarnmaps = userdata.rmaps
        let lbarnmaps = userdata.lmaps
        let rarity2 =  interaction.options.getString("rarity")
       
        if(barnmaps == 0 && rarity2 == "common" || !barnmaps && rarity2 == "common") return interaction.reply("You don't have any common barn maps!")
        if(ubarnmaps == 0 && rarity2 == "uncommon" || !ubarnmaps && rarity2 == "uncommon") return interaction.reply("You don't have any uncommon barn maps!")
        if(rbarnmaps == 0 && rarity2 == "rare" || !rbarnmaps && rarity2 == "rare") return interaction.reply("You don't have any rare barn maps!")
        if(lbarnmaps == 0 && rarity2 == "legendary" || !lbarnmaps && rarity2 == "legendary") return interaction.reply("You don't have any legendary barn maps!")

        let timeout = 3600000;

        let house = userdata.house

        if(house){
          timeout = 1800000
        }
        if(house){
          timeout = 300000
        }

        let garagelimit = userdata.garageLimit
        let usercars = userdata.cars
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
                resale = 1000
                namefor = "Common"
                break;
                case "uncommon":
                  color = "#f9ff3d"
                  resale = 2500
                  namefor = "Uncommon"
                  break;
                  case "rare":
                  color = "#a80000"
                  resale = 10000
                  namefor = "Rare"
                  break;
                  case "legendary":
                    color = "#44e339"
                    resale = 25000
                    namefor = "Legendary"
                    break;
            }



            let cars = userdata.cars
            let carindb = carsdb.Cars[barnfind.toLowerCase()]
            let carobj = {
              ID: carindb.alias,
              Name: carindb.Name,
              Speed: carindb.Speed,
              Acceleration: carindb["0-60"],
              Handling: carindb.Handling,
              Parts: [],
              Emote: carindb.Emote,
              Livery: carindb.Image,
              Miles: 0
            }
            function filterByID(item) {
              if (item.ID == carobj.ID) {
                return true
              }
              return false;
            }
            
            let arrByID = cars.filter(filterByID)
            console.log(arrByID)
            if(arrByID.length > 0) {
              cooldowns.barn = Date.now()
              Number(resale)
              Number(userdata.cash)
              userdata.cash += resale
              cooldowns.save()
              userdata.save()
             interaction.reply(`You found a ${carindb.Name} but you already have this car, so you found $${numberWithCommas(resale)} instead.`)
             return;
            }
            
            userdata.cars.push(carobj)
            userdata.save()
            cooldowns.barn = Date.now()
            cooldowns.save()

          

            switch(rarity2){
              case "common":
                barnmaps -= 1

                break;
                case "uncommon":
                  ubarnmaps -= 1


                break;
                case "rare":
                  rbarnmaps -= 1

  
                  break;
                  case "legendary":
                    lbarnmaps -= 1

                    
                    break;
                    userdata.save()
            }
            let embed = new Discord.MessageEmbed()
            .setTitle(`${namefor} Barn Find`)
            .addField(`Car`, `${carobj.Name}`)
            .addField(`ID`, `${carobj.ID}`)
            .setImage(carobj.Livery)
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