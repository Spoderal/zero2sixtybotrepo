const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageActionRow, MessageButton} = require("discord.js")
const Canvas = require("canvas")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pvp')
    .setDescription("PVP race another user")
    .addUserOption(option => option
        .setName('target')
        .setDescription('The user you want to race with')
        .setRequired(true)
        
    )
    .addStringOption((option) =>option
    .setName("car")
    .setDescription("The car id you want to race with")
    .setRequired(true))
    .addStringOption((option) =>option
    .setName("car2")
    .setDescription("The users car id they want to race you with")
    .setRequired(true))
    ,
   
    async execute(interaction) {
        
        const ms = require('pretty-ms')
        const discord = require("discord.js");
        const db = require("quick.db");
        
            const cars = require('../cardb.json');
        
            let user = interaction.user;
            let user2 = interaction.options.getUser("target")
            let car = interaction.options.getString("car")
            let car2 = interaction.options.getString("car2")

            if(!user2) return interaction.reply("Specify a user to race!")
        
           let timeout = 45000

           car = car.toLowerCase()
           car2 = car2.toLowerCase()

           let selected = db.fetch(`selected_${car}_${user.id}`);
           if(!selected) {
             let errembed = new discord.MessageEmbed()
             .setTitle("Error!")
             .setColor("DARK_RED")
             .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
             return  interaction.reply({embeds: [errembed]})
         }
         let selected2 = db.fetch(`selected_${car2}_${user2.id}`);
         if(!selected2) {
           let errembed = new discord.MessageEmbed()
           .setTitle("Error!")
           .setColor("DARK_RED")
           .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
           return  interaction.reply({embeds: [errembed]})
       }

       selected = selected.toLowerCase()
       select2 = selected2.toLowerCase()

           let user1cars = db.fetch(`cars_${user.id}`)
           let user2cars = db.fetch(`cars_${user2.id}`)

           let carindb1 = cars.Cars[selected]
           let carindb2 = cars.Cars[selected2]

           
           let row = new MessageActionRow()
           .addComponents(
            new MessageButton()
            .setCustomId("approve")
            .setStyle("SUCCESS")
            .setEmoji("✔️"),
            new MessageButton()
            .setCustomId("deny")
            .setStyle("DANGER")
            .setEmoji("✖️")
            
           )

           const canvas = Canvas.createCanvas(720, 400)
           const context = canvas.getContext('2d');
           let bg = "./track1.png"
           const  background = await Canvas.loadImage(bg);

         
           let height = canvas.height / 4
           let width = canvas.width / 4

           let carimage1 = carindb1.Image
           let carimage2 = carindb2.Image
           
           const  carimgstats = await Canvas.loadImage(carimage1);
           const  carimgstats2 = await Canvas.loadImage(carimage2);

           context.drawImage(background, 0, 0, canvas.width, canvas.height);
           context.drawImage(carimgstats, 15, 200, width, height);
           context.drawImage(carimgstats2, 15, 300, width, height);

           const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'pvppage.png');


           let embed = new discord.MessageEmbed()
           .setTitle(`${user2.username}, would you like to race ${user.username}?`)
           .addField(`${user.username}'s car`, `${carindb1.Name}`)
           .addField(`${user2.username}'s car`, `${carindb2.Name}`)
           .setImage(`attachment://pvppage.png`)
           .setColor(`#60b0f4`)

           interaction.reply({embeds: [embed], components: [row], files: [attachment]})
        
          
        
        
        function randomRange(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }
    }
}  