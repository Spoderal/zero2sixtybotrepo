const Discord = require("discord.js");
const db = require("quick.db")
const Canvas = require("canvas")
const profilepics = require("../pfpsdb.json")
const badgedb = require("../badgedb.json")
const ms = require('pretty-ms')
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("View a profile")
   ,
    async execute(interaction) {

      const canvas = Canvas.createCanvas(920, 500)
      const context = canvas.getContext('2d');
      let defaultprofile = "./background4.png"
      let user = interaction.user
      let profilepage = db.fetch(`profilepagebg_${user.id}`) || defaultprofile
      const  background = await Canvas.loadImage(profilepage);
      let delay = db.fetch(`profiledelay_${interaction.user.id}`)
      let timeout = 5000;
       
      if (delay !== null && timeout - (Date.now() - delay) > 0) {
          let time = ms(timeout - (Date.now() - delay));
          let timeEmbed = new Discord.MessageEmbed()
          .setColor("#60b0f4")
          .setDescription(`Please wait ${time} before using this command again.`);
          return interaction.reply({embeds: [timeEmbed]})
      }
      interaction.reply("Please wait...")

      
      let profilepic = db.fetch(`currentpfp_${user.id}`) || 'Default'
      let tolowerpic = profilepic.toLowerCase() 
      let realpic = profilepics.Pfps[tolowerpic].Image
      let cash = db.fetch(`cash_${user.id}`) || 0
      let prestige = db.fetch(`prestige_${user.id}`) || 0

      let noto = db.fetch(`notoriety3_${user.id}`) || 0
      let flamelevel = db.fetch(`flamehouse_level_${user.id}`)
      let skulllevel = db.fetch(`skullcrunchers_level_${user.id}`)
      let speedlevel = db.fetch(`thespeed_level_${user.id}`)
      let scraplevel = db.fetch(`scrapheads_level_${user.id}`)
      let snowlevel = db.fetch(`snowmonsters_level_${user.id}`)
      let tunerlevel = db.fetch(`tuner4life_level_${user.id}`)
      let bikerlevel = db.fetch(`bikergang_level_${user.id}`)
      let zerolevel = db.fetch(`zeroracers_level_${user.id}`)

      let badges = db.fetch(`badges_${user.id}`) || ['']
      
      db.set(`profiledelay_${interaction.user.id}`, Date.now())
      let title = db.fetch(`profile_description_${user.id}`) || 'No Description Set'
      
      let name = user.username
      let avatar = await Canvas.loadImage(realpic);
      let badgeflame = await Canvas.loadImage(badgedb["Flamehouse"].Image)
      let badgeskull = await Canvas.loadImage(badgedb["Skullcrunchers"].Image)
      let badgespeed = await Canvas.loadImage(badgedb["Thespeed"].Image)
      let badgescrap = await Canvas.loadImage(badgedb["Scrapheads"].Image)
      let badgesnow = await Canvas.loadImage(badgedb["Snow"].Image)
      let badgetuner = await Canvas.loadImage(badgedb["Tuner"].Image)
      let badgebiker = await Canvas.loadImage(badgedb["BikerGang"].Image)
      let badgezero = await Canvas.loadImage(badgedb["ZeroRacers"].Image)

      let badgewins = await Canvas.loadImage(badgedb["100wins"].Image)
      let badgecash = await Canvas.loadImage(badgedb["1mcash"].Image)
      let badgecars = await Canvas.loadImage(badgedb["10cars"].Image)
      let badgedrift = await Canvas.loadImage(badgedb["driftking"].Image)
      let badgehow = await Canvas.loadImage(badgedb["how?"].Image)
      let badgetime = await Canvas.loadImage(badgedb["timemaster"].Image)
      let badgerich = await Canvas.loadImage(badgedb["carrich"].Image)
      let badgeez = await Canvas.loadImage(badgedb["2ez"].Image)
      let badgesecret = await Canvas.loadImage(badgedb["secret"].Image)
      let badgeearth = await Canvas.loadImage(badgedb["earth badge"].Image)
      let badgewinter = await Canvas.loadImage(badgedb["winter badge"].Image)
      let badgeworld = await Canvas.loadImage(badgedb["world cup"].Image)
      let badgeworld2 = await Canvas.loadImage(badgedb["world cup 2"].Image)

      let emptybadge =  await Canvas.loadImage("https://i.ibb.co/s3HkzHZ/Logo-Makr-3ydra-C.png");

      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      
      context.drawImage(emptybadge, 600, 100, 75, 75);
      context.drawImage(emptybadge, 700, 100, 75, 75);
      context.drawImage(emptybadge, 800, 100, 75, 75);
      context.drawImage(emptybadge, 600, 200, 75, 75);
      context.drawImage(emptybadge, 700, 200, 75, 75);
      context.drawImage(emptybadge, 800, 200, 75, 75);
      context.drawImage(emptybadge, 600, 300, 75, 75);
      context.drawImage(emptybadge, 700, 300, 75, 75);

      //badges
      context.drawImage(emptybadge, 375, 210, 55, 55);
      context.drawImage(emptybadge, 485, 210, 55, 55);
      context.drawImage(emptybadge, 430, 210, 55, 55);
      context.drawImage(emptybadge, 375, 275, 55, 55);
      context.drawImage(emptybadge, 485, 275, 55, 55);
      context.drawImage(emptybadge, 430, 275, 55, 55);
      context.drawImage(emptybadge, 375, 340, 55, 55);
      context.drawImage(emptybadge, 485, 340, 55, 55);
      context.drawImage(emptybadge, 430, 340, 55, 55);
      context.drawImage(emptybadge, 375, 405, 55, 55);
      context.drawImage(emptybadge, 485, 405, 55, 55);
      context.drawImage(emptybadge, 430, 405, 55, 55);

      if(flamelevel >= 5){
        context.drawImage(badgeflame, 600, 100, 75, 75);
      }
      if(skulllevel >= 5){
        context.drawImage(badgeskull, 700, 100, 75, 75);
      }
      if(speedlevel >= 5){
        context.drawImage(badgespeed, 800, 100, 75, 75);
      }
      if(scraplevel >= 5){
        context.drawImage(badgescrap, 600, 200, 75, 75);
      }
      if(snowlevel >= 5){
        context.drawImage(badgesnow, 700, 200, 75, 75);
      }
      if(tunerlevel >= 5){
        context.drawImage(badgetuner, 800, 200, 75, 75);
      }
      if(bikerlevel >= 5){
        context.drawImage(badgebiker, 600, 300, 75, 75);
      }
      if(zerolevel >= 5){
        context.drawImage(badgezero, 700, 300, 75, 75);
      }
      if(badges.includes('100wins')){
        context.drawImage(badgewins, 375, 210, 55, 55);
      }
      if(badges.includes('1mcash')){
        context.drawImage(badgecash, 485, 210, 55, 55);
      }
      if(badges.includes('10cars')){
        context.drawImage(badgecars, 430, 210, 55, 55);
      }
      if(badges.includes('driftking')){
        context.drawImage(badgedrift, 375, 275, 55, 55);
      }
      if(badges.includes('how?')){
        context.drawImage(badgehow, 430, 275, 55, 55);
      }
      if(badges.includes('timemaster')){
        context.drawImage(badgetime, 485, 275, 55, 55);
      }
      if(badges.includes('carrich')){
        context.drawImage(badgerich, 375, 340, 55, 55);
      }
      if(badges.includes('2ez')){
        context.drawImage(badgeez, 430, 340, 55, 55);
      }
      if(badges.includes('secret')){
        context.drawImage(badgesecret, 485, 340, 55, 55);
      }
      if(badges.includes('earth badge')){
        context.drawImage(badgeearth, 430, 405, 55, 55);
      }
      if(badges.includes('winter badge')){
        context.drawImage(badgewinter, 375, 405, 55, 55);
      }
   
      if(badges.includes('world cup')){
        context.drawImage(badgeworld, 850, 450, 55, 55);
      }

      if(badges.includes('world cup 2')){
        context.drawImage(badgeworld2, 850, 450, 55, 55);
      }
      // Pick up the pen
      
      const applyText = (canvas, text) => {
      const context = canvas.getContext('2d');
      
      // Declare a base size of the font
      let fontSize = 70;
      
      do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
      } while (context.measureText(text).width > canvas.width - 300);
      
      // Return the result to use in the actual canvas
      return context.font;
      };
      
      // Actually fill the text with a solid color
      // ...
     
      // Assign the decided font to the canvas
      context.font = applyText(canvas, name);
      context.fillStyle = '#ffffff';
      if(prestige == 10){
        context.fillStyle = '#FFD700';
      }
      context.fillText(name, 150, 100);
      context.font = '35px sans-serif';
      
      context.fillText(`${title}`, 50, 180);
      
      context.font = '28px sans-serif';
      context.fillText(`Cash: $${abbreviateNumber(cash)}`, 50, 350);
      context.fillText(`Notoriety: ${abbreviateNumber(noto)}`, 50, 250);
      
      context.font = '45px sans-serif';
      
      context.fillText(`Squads Beat`, 610, 60);
      context.drawImage(avatar, 25, 25, 100, 100);
      
      context.font = '30px sans-serif';
      context.fillText(`Badges`, 410, 170);
      
      let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profilepage.png');
      
      interaction.channel.send({ files: [attachment] })
      
      
      function abbreviateNumber(value) {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "k", "m", "b","t"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
      }
    }
};