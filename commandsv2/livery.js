const cars = require("../cardb.json");
const Discord = require("discord.js");
const parts = require("../partsdb.json");
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require("lodash")
const {MessageActionRow, MessageButton} = require("discord.js")


module.exports = {
  data: new SlashCommandBuilder()
  .setName('livery')
  .setDescription("View, install, or submit a livery for your car")
  .addStringOption((option) => option
  .setName("option")
  .setDescription("Install, submit, or view")
  .setRequired(true)
  .addChoice("Submit", "submit")
  .addChoice("View", "view")
  .addChoice("Install", "install")
  .addChoice("Remove", "remove")
  .addChoice("Approve", "approve")
  .addChoice("List", "list")
  )
  .addStringOption((option) => option
  .setName("car")
  .setDescription("The car you want to install, submit, or view the livery for")
  .setRequired(true)
  )
  .addStringOption((option) => option
  .setName("id")
  .setDescription("The id of the livery you want to install")
  .setRequired(false)
  )

  ,
  async execute(interaction) {

    const db = require("quick.db")

    let option = interaction.options.getString("option")

    if(option == "install"){
      
      let idtoselect = interaction.options.getString("car").toLowerCase();
      if(!idtoselect) return interaction.reply("Specify a car!")
    let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
    if(!selected) {
      let errembed = new Discord.MessageEmbed()
      .setTitle("Error!")
      .setColor("DARK_RED")
      .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
      return  interaction.reply({embeds: [errembed]})
  }

          let livid = interaction.options.getString("id")
          
          if(!livid) return interaction.reply("Specify an id!")
      let list = cars.Cars
      if(!list[selected.toLowerCase()]) return interaction.reply("That isnt an available car!")
      
      if(!db.fetch(`liveries_${cars.Cars[selected.toLowerCase()].Name}`)) return interaction.reply("This car doesn't have any livery id's")
      
      let carid =  db.fetch(`liveries_${cars.Cars[selected.toLowerCase()].Name}`)
      
      let filtered = carid.filter(e => e.id == livid);
      
      
      if(filtered == [] || filtered.length == 0 || !filtered || filtered == null) return interaction.reply("Thats not a valid ID!")
      db.set(`${cars.Cars[selected.toLowerCase()].Name}livery_${interaction.user.id}`, filtered[0].image)
      let embedapprove = new Discord.MessageEmbed()
      .setTitle(`Installed ${livid}`)
      .setImage(filtered[0].image)
      .setColor("#60b0f4")
      
      interaction.reply({embeds: [embedapprove]})
          
        }
        else if(option == "view"){
          let car = interaction.options.getString("car").toLowerCase()
          let livid = interaction.options.getString("id")
          
          if(!car) return interaction.reply("Specify a car!")
          if(!livid) return interaction.reply("Specify an id!")
      let list = cars.Cars
      if(!list[car.toLowerCase()]) return interaction.reply("That isnt an available car!")
      
      if(!db.fetch(`liveries_${cars.Cars[car.toLowerCase()].Name}`)) return interaction.reply("This car doesn't have any livery id's")
      
      let carid =  db.fetch(`liveries_${cars.Cars[car.toLowerCase()].Name}`)
      
      let filtered = carid.filter(e => e.id == livid);
      
      
      if(filtered == [] || filtered.length == 0 || !filtered || filtered == null) return interaction.reply("Thats not a valid ID!")
      let embedapprove = new Discord.MessageEmbed()
      .setTitle(`Livery ${livid} for ${cars.Cars[car].Name}`)
      .setImage(filtered[0].image)
      .setColor("#60b0f4")
      
      interaction.reply({embeds: [embedapprove]})
        }
        else if(option == "remove"){
      
          let idtoselect = interaction.options.getString("car").toLowerCase();
          if(!idtoselect) return interaction.reply("Specify a car!")
        let selected = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
        if(!selected) {
          let errembed = new Discord.MessageEmbed()
          .setTitle("Error!")
          .setColor("DARK_RED")
          .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
          return  interaction.reply({embeds: [errembed]})
      }
          
      let list = cars.Cars
      if(!list[selected.toLowerCase()]) return interaction.reply("That isnt an available car!")
      
      
      db.delete(`${cars.Cars[selected.toLowerCase()].Name}livery_${interaction.user.id}`)
      let embedapprove = new Discord.MessageEmbed()
      .setTitle(`Your car had its livery removed`)
      .setImage(cars.Cars[selected.toLowerCase()].Image)
      .setColor("#60b0f4")
      
      interaction.reply({embeds: [embedapprove]})
          
        }
        else if(option == "view"){
          let car = interaction.options.getString("car").toLowerCase()
          let livid = interaction.options.getString("id")
          
          if(!car) return interaction.reply("Specify a car!")
          if(!livid) return interaction.reply("Specify an id!")
      let list = cars.Cars
      if(!list[car.toLowerCase()]) return interaction.reply("That isnt an available car!")
      
      if(!db.fetch(`liveries_${cars.Cars[car.toLowerCase()].Name}`)) return interaction.reply("This car doesn't have any livery id's")
      
      let carid =  db.fetch(`liveries_${cars.Cars[car.toLowerCase()].Name}`)
      
      let filtered = carid.filter(e => e.id == livid);
      
      
      if(filtered == [] || filtered.length == 0 || !filtered || filtered == null) return interaction.reply("Thats not a valid ID!")
      let embedapprove = new Discord.MessageEmbed()
      .setTitle(`Livery ${livid} for ${cars.Cars[car].Name}`)
      .setImage(filtered[0].image)
      .setColor("#60b0f4")
      
      interaction.reply({embeds: [embedapprove]})
        }

        else if(option == "submit"){
          let cartosubmit = interaction.options.getString("car")
          if(!cartosubmit) return interaction.reply("Usage: /livery submit (car)")
          let list = cars.Cars
          if(!list[cartosubmit.toLowerCase()]) return interaction.reply("That isnt an available car yet! If you'd like to suggest it, use /suggest.")
          interaction.reply("What livery image would you like to submit?")
          const filter = (m = Discord.Message) => {
              return m.author.id === interaction.user.id
          }
          let collector = interaction.channel.createMessageCollector({
              filter,
              max: 1,
              time: 1000 * 30
          })
          collector.on('collect', m => {
              var linktoimg = m.attatchments
              let ImageLink
              if (m.attachments.size > 0) {
                  m.attachments.forEach(attachment => {
                   ImageLink = attachment.url;
      
                  })
                  let numberlivery = db.fetch(`liverycount_${m.author.id}`) || 0
                  db.add(`liverycount_${m.author.id}`, 1)
                  db.add(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_id`, 1)
                  let embed = new Discord.MessageEmbed()
                  .setImage(ImageLink)
                  .setDescription("Submitted for review!")
                  .addField("Car", cars.Cars[cartosubmit.toLowerCase()].Name)
                  .addField("ID", `${db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_id`)}`)
                  .setColor("#60b0f4")
                  m.reply({embeds: [embed]})
                  let submitchannel = interaction.client.channels.cache.get('931078225021521920')
                  
                 
                  
                  submitchannel.send({embeds: [embed]})
                  db.push(`liverynotifs_${interaction.user.id}`, {LiveryID: db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_id`), Approved: false, Car: cartosubmit.toLowerCase()})
                  db.set(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_image`, ImageLink)
                  const carlivery = {
                      id: db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_id`),
                      image: db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_image`),
                      uid: interaction.user.id
                  }
      
                  db.push(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liveriestosubmit`, {id: db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_id`),  image: db.fetch(`${cars.Cars[cartosubmit.toLowerCase()].Name}_liverytosubmit_image`),  uid: interaction.user.id})
                }
                else {
                    return m.reply("Specify an image!")
                }
              })       
        }
        else if(option == "approve"){
          let whitelist = ["275419902381260802", "890390158241853470", "699794627095429180", "670895157016657920", "576362830572421130", "937967206652837928", 
          "311554075298889729", "474183542797107231", "678558875846443034", "211866621684219904"]
  
          if(!whitelist.includes(interaction.user.id)) return interaction.reply({content:`You don't have permission to use this command!`, ephemeral: true})
let idtoapprove = interaction.options.getString("id")
let cartoapprove = interaction.options.getString("car")
if(!idtoapprove) return interaction.reply("Specify an id!")
if(!cartoapprove) return interaction.reply("Specify a car!")
let list = cars.Cars
if(!list[cartoapprove.toLowerCase()]) return interaction.reply("That isnt an available car!")

if(!db.fetch(`${cars.Cars[cartoapprove.toLowerCase()].Name}_liveriestosubmit`)) return interaction.reply("This car doesn't have any livery id's")

let carid =  db.fetch(`${cars.Cars[cartoapprove.toLowerCase()].Name}_liveriestosubmit`)



  let filtered = carid.filter(e => e.id == idtoapprove);


  if(filtered == [] || filtered.length == 0 || !filtered || filtered == null) return interaction.reply("Thats not a valid ID!")
  db.push(`liveries_${cars.Cars[cartoapprove.toLowerCase()].Name}`, filtered[0])
  let embedapprove = new Discord.MessageEmbed()
  .setTitle(`Approved ${idtoapprove}`)
  .setImage(filtered[0].image)
  .setColor("#60b0f4")
  let usertodm = await interaction.client.users.fetch(filtered[0].uid)


  interaction.reply({embeds: [embedapprove]})
  usertodm.send(`Your recent livery for the ${cars.Cars[cartoapprove.toLowerCase()].Name} was approved! Use /livery Install [car] [id] to use it. ${filtered[0].image}`).catch(() => console.log("Dms off"));
        }
        else if(option == "list"){
          var car = interaction.options.getString("car").toLowerCase()
          if(!car) return interaction.reply("Specify if you'd like to see the list of liveries (list), install a livery (install [id] [car]), uninstall your current livery (uninstall [car]), view a livery (view [id] [car]), or submit one for review (submit [car]).")
          var usercars = db.fetch(`cars_${interaction.user.id}`) 
          if(!cars.Cars[car]) return interaction.reply("Thats not a car!")
          let list = cars.Cars
          if(!list[car]) return interaction.reply("That isnt an available car yet! If you'd like to suggest it, use /suggest.")
          let liveriesforcar = db.fetch(`liveries_${cars.Cars[car].Name}`) || ['None']
          if(!liveriesforcar) return interaction.reply("This car doesn't have liveries yet, if you'd like to submit one, do /submitlivery")
          let liverylist = []
          for (var i = 0; i < liveriesforcar.length; i++) {
              actliv = liveriesforcar[i]
              liverylist.push(`${actliv.id}`)
              //Do something
          }
          let shopItems = db.fetch(`liveries_${cars.Cars[car].Name}`)
          if (!shopItems || !shopItems.length) return interaction.reply(`This car doesn't have any liveries!`)
          shopItems = lodash.chunk(shopItems.map((a, i) => `**${liverylist.join('\n')}**`))
          
          const embed = new Discord.MessageEmbed({color: '#60b0f4'})
          .setTitle(`Liveries for ${cars.Cars[car].Name}`)
          .setDescription(`View using \`/liveryview [id] [car]\`\nSet using \`/liveryinstall [id] [car]\`\n${shopItems[0].join('\n')}`)
          .setFooter(`Pages 1/${shopItems.length}`)
          .setThumbnail("https://i.ibb.co/Hq4p8bx/usedicon.png")
          .setTimestamp();
          
          interaction.channel.send({embeds: [embed], fetchReply: true}).then(async emb => {
  
              ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))
          
              const filter = (_, u) => u.id === interaction.user.id
              const collector = emb.createReactionCollector({ filter, time: 300000 })
              let page = 1
              collector.on('collect', async (r, user) => {
                  let current = page;
                  emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                  if (r.emoji.name === '◀️' && page !== 1) page--
                  else if (r.emoji.name === '▶️' && page !== shopItems.length) page++
                  else if (r.emoji.name === '⏮️') page = 1
                  else if (r.emoji.name === '⏭️') page = shopItems.length
                  else if (r.emoji.name === '⏹️') return collector.stop()
                
          
                  embed.setDescription(`View using \`/liveryview [id] [car]\nSet using /liveryinstall [id] [car]\`\n${shopItems[page - 1].join('\n')}`)
                  
                  if (current !== page) {
                      embed.setFooter(`Pages ${page}/${shopItems.length}`)
                      interaction.editReply({embeds: [embed]})
                  }
              })
   
          
          })
        }

    }
  
};
