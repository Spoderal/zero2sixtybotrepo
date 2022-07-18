const db = require('quick.db')
const Discord = require('discord.js')
const barns = require('../junkparts.json')
const lodash = require('lodash')
const partsdb = require('../partsdb.json')
const ms = require(`pretty-ms`)
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('junkyard')
    .setDescription("Search the junkyard for parts"),
    async execute(interaction) {

      let uid = interaction.user.id
      let barntimer = db.fetch(`junkfind_${uid}`)
      
      
      let timeout = 60000;
      
      if (barntimer !== null && timeout - (Date.now() - barntimer) > 0) {
          let time = ms(timeout - (Date.now() - barntimer));
          let timeEmbed = new Discord.MessageEmbed()
          .setColor("#60b0f4")
          .setDescription(`Please wait ${time} before searching junkyards again.`);
          interaction.reply({embeds: [timeEmbed]})
          return;
      }
      var rarities = [{
          type: "Common",
          chance: 0
        }, {
          type: "Rare",
          chance: 15
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
          let barnfind = lodash.sample(barns.Parts[rarity.type.toLowerCase()])
          console.log(barnfind)
      
        
          let part = partsdb.Parts[barnfind.toLowerCase()]
      
      
          db.set(`junkfind_${uid}`, Date.now())
          db.push(`parts_${uid}`, part.Name.toLowerCase())
          let embed = new Discord.MessageEmbed()
          .setTitle(`${rarity.type} Part Find`)
          .addField(`Part`, `${part.Name}`)
          .setColor("#60b0f4")
          interaction.reply({embeds: [embed]});
        }
        
        pickRandom();
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
    }
    
  }
  