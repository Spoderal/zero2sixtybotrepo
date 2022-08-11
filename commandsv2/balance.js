const Discord = require('discord.js')
const {SlashCommandBuilder} = require('@discordjs/builders')
const cars = require('../cardb.json')
const lodash = require(`lodash`)
const User = require('../schema/profile-schema')
module.exports = {
  data: new SlashCommandBuilder()
  .setName('bal')
  .setDescription("Check your balance")
  .addUserOption((option) => option
    .setName("user")
    .setDescription("The user id to check")
    .setRequired(false)
  ),
  async execute(interaction) {
        let emote = '<:zecash:983966383408832533>'
        let goldemote = '<:z_gold:933929482518167552>'
        let rpemote = '<:rp:983968476060336168>'
        let key1emote = "<:ckey:993011409132728370>"
      let key2emote = "<:rkey:993011407681486868>"
      let key3emote = "<:ekey:993011410210672671>"
    let key4emote = "<:driftkey:970486254896570469>"

        let user = interaction.options.getUser("user") || interaction.user
          let userid = user.id
          let userdata =  await User.findOne({id: user.id}) || new User({id: user.id})
          let cash = userdata.cash
          let gold = userdata.gold

          let rp = userdata.rp
          let barnmaps = userdata.cmaps
          let ubarnmaps = userdata.ucmaps
          let rbarnmaps = userdata.rmaps
          let lbarnmaps = userdata.lmaps
          let ckeys = userdata.ckeys
          let rkeys = userdata.rkeys
          let ekeys = userdata.ekeys
          let dkeys = userdata.dkeys
          let fkeys = userdata.fkeys

          let bank = userdata.bank
          let banklimit = userdata.banklimit

          let notoriety = userdata.noto
          let wheelspins = userdata.wheelspins
          let swheelspins =  userdata.swheelspins

          let wheelemote = "<:wheelspin:985048616865517578>"
          let swheelemote = "<a:superwheel:985049981482311740>"
          let tips = ["Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!", 
          "You can upgrade cars with /upgrade", "Create a crew and get benefits such as cash bonuses!", 
          "Use /weekly, /daily, and /vote to get a small cash boost!", 
          "Notoriety is used for seasons, check the current season with /season",
          "Use keys to purchase import crates with exclusive cars", "View events with /event"]
          let tip = lodash.sample(tips)
          let map = "<:zbarns:941571059600195594>"
          let embed = new Discord.MessageEmbed()
          .setTitle(`${user.username}'s Balance`)
          .setDescription(`${emote} Z Cash: $${numberWithCommas(cash)}\n
          🏦 Bank: $${numberWithCommas(bank)}/$${numberWithCommas(banklimit)}\n
          ${goldemote} Gold: ${gold}\n
          ${rpemote} RP: ${numberWithCommas(rp)}\n
          ${wheelemote} Wheel spins: ${wheelspins} ${swheelemote} Super Wheel spins: ${swheelspins}\n
          `)
          .setColor("#60b0f4")
          .addField("Barn Maps", `
          \n${map} Common: ${numberWithCommas(barnmaps)}
          <:zbarns_u:958540705964371978> Uncommon: ${numberWithCommas(ubarnmaps)}
          <:zbarns_r:958539547828965406> Rare: ${numberWithCommas(rbarnmaps)}
          <:zbarns_l:958539547736674314> Legendary: ${numberWithCommas(lbarnmaps)}`, true)
          .addField("Keys", `
          ${key1emote} Common: ${ckeys}
          ${key2emote} Rare: ${rkeys}
          ${key3emote} Exotic: ${ekeys}
          ${key4emote} Drift: ${dkeys}
          `, true)
          .addField("Event Items", `
          <:zeronotor:962785804202176574> Notoriety: ${numberWithCommas(notoriety)}
         `, true)
          .setThumbnail('https://i.ibb.co/FB8RwK9/Logo-Makr-5-Toeui.png')
          .setFooter(`Tip: ${tip}`)
          interaction.reply({embeds: [embed]})
   
       
        
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

  function randomRange(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }