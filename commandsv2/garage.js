const Discord = require('discord.js')
const { Client, Intents, MessageEmbed } = require('discord.js');
const cardb = require('../cardb.json')
const partdb = require('../partsdb.json')
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_MESSAGES)
myIntents.add(Intents.FLAGS.GUILDS)
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require("lodash")
const itemdb = require('../items.json')
const colors = require('../colordb.json')
const {MessageActionRow, MessageButton} = require("discord.js")
const wait = require('node:timers/promises').setTimeout;
const User = require('../schema/profile-schema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('garage')
    .setDescription("Check your garage")
    .addSubcommand((subcommand) => subcommand
    .setName("cars")
   .setDescription("View your cars")
   .addUserOption((option) => option
   .setName("user")
   .setDescription("The user id to check")
   .setRequired(false)

    )
    )
    .addSubcommand((subcommand) => subcommand
    .setName("parts")
   .setDescription("View your parts")
   .addUserOption((option) => option
   .setName("user")
   .setDescription("The user id to check")
   .setRequired(false)

    )
    )
    .addSubcommand((subcommand) => subcommand
    .setName("items")
   .setDescription("View your items")
   .addUserOption((option) => option
   .setName("user")
   .setDescription("The user id to check")
   .setRequired(false)

    )
    ),
    async execute(interaction) {
      let subcommand = interaction.options.getSubcommand()

        const target = interaction.options.getUser("user") || interaction.user
        let targetId = target.id
   
        await User.findOne({id: targetId})
        let userdata =  await User.findOne({id: targetId}) || new User({id: targetId})

        let cars = userdata.cars
        if(cars == null || cars == [] || cars.length <= 0 || !cars.length) return interaction.reply("You dont own any cars!")
        let parts = userdata.parts
        let badges = userdata.badges
        let garagelimit = userdata.garageLimit
        var usercars = []
        var actcar
        var userparts = []
        var actpart
        var partarraylength = parts.length;
        var speeds = []
        let items = userdata.items
        var actitems = []
        var actitem
        let option = interaction.options.getString("option")
        let newspeeds = []
        let highestspeed
        let filteredcar
        let actuserparts = []
        let valuearr = []
        let xessence = userdata.xessence
        let finalid = "NO ID"
        let fetch

        for (var i = 0; i < items.length; i++ && items !== ['no items'] && items.length > 0) {
          items = userdata.items
          if(!items || items.length == 0 || items == ['no items']) return interaction.reply(`You don't have any items!`)

          actitem = items[i]
          let emote
          let name
          let type

            if (itemdb.Police[actitem.toLowerCase()]){
              emote = itemdb.Police[actitem.toLowerCase()].Emote
              name = itemdb.Police[actitem.toLowerCase()].Name
              type = itemdb.Police[actitem.toLowerCase()].Type

            }
            else if(itemdb.Multiplier[actitem.toLowerCase()]){
              emote = itemdb.Multiplier[actitem.toLowerCase()].Emote
              name = itemdb.Multiplier[actitem.toLowerCase()].Name
              type = itemdb.Multiplier[actitem.toLowerCase()].Type

            }
            else if(itemdb.Other[actitem.toLowerCase()]){
              emote = itemdb.Other[actitem.toLowerCase()].Emote
              name = itemdb.Other[actitem.toLowerCase()].Name
              type = itemdb.Other[actitem.toLowerCase()].Type

            }
            else if(itemdb.Collectable[0][actitem.toLowerCase()]){
              emote = itemdb.Collectable[0][actitem.toLowerCase()].Emote
              name = itemdb.Collectable[0][actitem.toLowerCase()].Name
              type = itemdb.Collectable[0][actitem.toLowerCase()].Type

            }
          

            //Do something
           let x2 = items.filter(x => x == `${actitem.toLowerCase()}`).length
           let finalitem = `${emote} ${name} x${x2}\n\`${type}\``
           if(!actitems.includes(finalitem)){
             actitems.push(finalitem)

           }
            
        }
        for (var i = 0; i < partarraylength; i++ && parts !== ['no parts']) {
        
        if(!parts || parts.length == 0) {
        actpart = "no parts"
        }
        actpart = parts[i]
        //Do something
        userparts.push(`${partdb.Parts[actpart.toLowerCase()].Emote} ${partdb.Parts[actpart.toLowerCase()].Name}`)
        
      }
    
      let sum = 0;

for (let i = 0; i < valuearr.length; i++) {
    sum += valuearr[i];
}
      var list = userparts;

      var quantities = list.reduce(function(obj, n) {
        if (obj[n]) obj[n]++;
        else        obj[n] = 1;
        
        return obj;
      }, {});
      
      
      for (var n in quantities) {
        actuserparts.push(`${n} x${quantities[n]}`)

      }
        
        for(var i = 0; i < speeds.length; i++){
        highestspeed = Math.max.apply(Math, newspeeds)
        filteredcar = speeds.filter(e => e.speed == highestspeed);
        }

        let garageimg = userdata.showcase || "https://t3.ftcdn.net/jpg/02/70/01/64/360_F_270016456_CJAh2KQGnBKUzJfjDTkD0vEruHX9T2tV.jpg"
     
        usercars = lodash.chunk(usercars.map((a, i) => `${a}\n`), 5)
        actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}\n`), 10)

        if(subcommand == "parts"){
          let embed1 = new MessageEmbed()
          .setTitle(`${target.username}'s parts`)
          .setThumbnail('https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png') 

          .setDescription(`${xessence} Xessence\n\n${actuserparts[0].join('\n')}`)
          .addField("​", "​")
          
          .setColor('#60b0f4')
          
          let row = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId("previous")
            .setEmoji('◀️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("next")
            .setEmoji('▶️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("first")
            .setEmoji('⏮️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("last")
            .setEmoji('⏭️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("filter")
            .setEmoji('🔍')
            .setLabel("Filter")
            .setStyle('SECONDARY')
          )
          let row2 = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId('t1')
            .setLabel("T1")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('t2')
            .setLabel("T2")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('t3')
            .setLabel("T3")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('t4')
            .setLabel("T4")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('t5')
            .setLabel("T5")
            .setStyle('SECONDARY')
          )
          await interaction.deferReply();
        let msg = await interaction.editReply({embeds: [embed1], components: [row], fetchReply: true})
           
        let filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id
      }
      let collector = msg.createMessageComponentCollector({
        filter: filter
    })
            let page = 1
            collector.on('collect', async (i) => {
              if(i.customId.includes('filter')){
                row.components[4].setDisabled(true)
               await msg.edit({components: [row, row2]})

                
              }
                let current = page;
                if(i.customId.includes('t1')) {
                  for(part in parts){

                    const filterItems = (arr, query) => {
                      return arr.filter(el => el.indexOf(query.toLowerCase()) !== -1)
                    }
                    actuserparts = filterItems(parts, "t1")
                    if(!actuserparts || actuserparts.length == 0) return i.update(`No T1 parts available`)

                    
                  }
                  actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}`), 10)
                  let newuserparts = []
                  for(p in actuserparts){
                    let part2 = actuserparts[0][p]
                    console.log(`part: ${part2}`)

                  }
                  let sum = 0;

                  for (let i = 0; i < valuearr.length; i++) {
                      sum += valuearr[i];
                  }
                        var list = actuserparts[0];
                  
                        var quantities = list.reduce(function(obj, n) {
                          if (obj[n]) obj[n]++;
                          else        obj[n] = 1;
                          
                          return obj;
                        }, {});
                        
                        
                        for (var n in quantities) {
                          newuserparts.push(`${partdb.Parts[n.toLowerCase()].Emote} ${partdb.Parts[n].Name} x${quantities[n]}`)
                  
                        }
                  newuserparts = lodash.chunk(newuserparts.map((a, i) => `${a}\n`), 10)

                  embed1.setDescription(`${xessence} Xessence\n\n${newuserparts[page - 1].join('\n')}`)

                  i.update({embeds: [embed1]})

                  return

                  console.log(actuserparts)
                 
                }
                else   if(i.customId.includes('t2')) {
                  for(part in parts){

                    const filterItems = (arr, query) => {
                      return arr.filter(el => el.indexOf(query.toLowerCase()) !== -1)
                    }
                    actuserparts = filterItems(parts, "t2")
                    if(!actuserparts || actuserparts.length == 0) return i.update(`No T2 parts available`)

                    
                  }
                  actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}`), 10)
                  let newuserparts = []
                  for(p in actuserparts){
                    let part2 = actuserparts[0][p]
                    console.log(`part: ${part2}`)

                  }
                  let sum = 0;

                  for (let i = 0; i < valuearr.length; i++) {
                      sum += valuearr[i];
                  }
                        var list = actuserparts[0];
                  
                        var quantities = list.reduce(function(obj, n) {
                          if (obj[n]) obj[n]++;
                          else        obj[n] = 1;
                          
                          return obj;
                        }, {});
                        
                        
                        for (var n in quantities) {
                          newuserparts.push(`${partdb.Parts[n.toLowerCase()].Emote} ${partdb.Parts[n].Name} x${quantities[n]}`)
                  
                        }
                  newuserparts = lodash.chunk(newuserparts.map((a, i) => `${a}\n`), 10)

                  embed1.setDescription(`${xessence} Xessence\n\n${newuserparts[page - 1].join('\n')}`)

                  i.update({embeds: [embed1]})

                  return

                  console.log(actuserparts)
                 
                }
                else   if(i.customId.includes('t3')) {
                  for(part in parts){

                    const filterItems = (arr, query) => {
                      return arr.filter(el => el.indexOf(query.toLowerCase()) !== -1)
                    }
                    actuserparts = filterItems(parts, "t3")
                    if(!actuserparts || actuserparts.length == 0) return i.update(`No T3 parts available`)

                    
                  }
                  actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}`), 10)
                  let newuserparts = []
                  for(p in actuserparts){
                    let part2 = actuserparts[0][p]
                    console.log(`part: ${part2}`)

                  }
                  let sum = 0;

                  for (let i = 0; i < valuearr.length; i++) {
                      sum += valuearr[i];
                  }
                        var list = actuserparts[0];
                  
                        var quantities = list.reduce(function(obj, n) {
                          if (obj[n]) obj[n]++;
                          else        obj[n] = 1;
                          
                          return obj;
                        }, {});
                        
                        
                        for (var n in quantities) {
                          newuserparts.push(`${partdb.Parts[n.toLowerCase()].Emote} ${partdb.Parts[n].Name} x${quantities[n]}`)
                  
                        }
                  newuserparts = lodash.chunk(newuserparts.map((a, i) => `${a}\n`), 10)

                  embed1.setDescription(`${xessence} Xessence\n\n${newuserparts[page - 1].join('\n')}`)

                  i.update({embeds: [embed1]})

                  return

                  console.log(actuserparts)
                 
                }
                else   if(i.customId.includes('t4')) {
                  for(part in parts){

                    const filterItems = (arr, query) => {
                      return arr.filter(el => el.indexOf(query.toLowerCase()) !== -1)
                    }
                    actuserparts = filterItems(parts, "t4")

                    if(!actuserparts || actuserparts.length == 0) return i.update(`No T4 parts available`)
                     
                  }
                  actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}`), 10)
                  let newuserparts = []
                  for(p in actuserparts){
                    let part2 = actuserparts[0][p]
                    console.log(`part: ${part2}`)

                  }
                  let sum = 0;

                  for (let i = 0; i < valuearr.length; i++) {
                      sum += valuearr[i];
                  }
                        var list = actuserparts[0];
                  
                        var quantities = list.reduce(function(obj, n) {
                          if (obj[n]) obj[n]++;
                          else        obj[n] = 1;
                          
                          return obj;
                        }, {});
                        
                        
                        for (var n in quantities) {
                          newuserparts.push(`${partdb.Parts[n.toLowerCase()].Emote} ${partdb.Parts[n].Name} x${quantities[n]}`)
                  
                        }
                  newuserparts = lodash.chunk(newuserparts.map((a, i) => `${a}\n`), 10)

                  embed1.setDescription(`${xessence} Xessence\n\n${newuserparts[page - 1].join('\n')}`)

                  i.update({embeds: [embed1]})

                  return

                  console.log(actuserparts)
                 
                }
                else   if(i.customId.includes('t5')) {
                  for(part in parts){

                    const filterItems = (arr, query) => {
                      return arr.filter(el => el.indexOf(query.toLowerCase()) !== -1)
                    }
                    actuserparts = filterItems(parts, "t5")
                    if(!actuserparts || actuserparts.length == 0) return i.update(`No T5 parts available`)

                    
                  }
                  actuserparts = lodash.chunk(actuserparts.map((a, i) => `${a}`), 10)
                  let newuserparts = []
                  for(p in actuserparts){
                    let part2 = actuserparts[0][p]
                    console.log(`part: ${part2}`)

                  }
                  let sum = 0;

                  for (let i = 0; i < valuearr.length; i++) {
                      sum += valuearr[i];
                  }
                        var list = actuserparts[0];
                  
                        var quantities = list.reduce(function(obj, n) {
                          if (obj[n]) obj[n]++;
                          else        obj[n] = 1;
                          
                          return obj;
                        }, {});
                        
                        
                        for (var n in quantities) {
                          newuserparts.push(`${partdb.Parts[n.toLowerCase()].Emote} ${partdb.Parts[n].Name} x${quantities[n]}`)
                  
                        }
                  newuserparts = lodash.chunk(newuserparts.map((a, i) => `${a}\n`), 10)

                  embed1.setDescription(`${xessence} Xessence\n\n${newuserparts[page - 1].join('\n')}`)

                  i.update({embeds: [embed1]})

                  return

                  console.log(actuserparts)
                 
                }
             
              
                else if (i.customId.includes('previous') && page !== 1) page--
                else if (i.customId.includes('next') && page !== actuserparts.length) page++
                else if (i.customId.includes('first')) page = 1
                else if (i.customId.includes('last')) page = actuserparts.length
                
               
                embed1.setDescription(`${xessence} Xessence\n\n${actuserparts[page - 1].join('\n')}`)
                
                if (current !== page) {
                    embed1.setFooter(`Pages ${page}/${actuserparts.length}`)
                    i.update({embeds: [embed1]})
                }
                if(current == page){
                  i.update({content: `No pages left!`})
                }

              
            })

          //   let filter2 = (btnInt) => {
          //     return interaction.user.id === btnInt.user.id
          // }
         
          // const collector2 = emb.createMessageComponentCollector({
          //     filter: filter2
          // })
           
                
        
                
                // collector2.on('collect', async (i, user) => {

                //   if(i.customId.includes("filter")){
                //     let filtrow = new MessageActionRow()
                //     .addComponents(
                //       new MessageButton()
                //       .setLabel("T1")
                //       .setCustomId("t1")
                //       .setStyle("SUCCESS"),
                //       new MessageButton()
                //       .setLabel("T2")
                //       .setCustomId("t2")
                //       .setStyle("SUCCESS"),
                //       new MessageButton()
                //       .setLabel("T3")
                //       .setCustomId("t3")
                //       .setStyle("SUCCESS"),
                //       new MessageButton()
                //       .setLabel("T4")
                //       .setCustomId("t4")
                //       .setStyle("SUCCESS"),
                //       new MessageButton()
                //       .setLabel("T5")
                //       .setCustomId("t5")
                //       .setStyle("SUCCESS")
                //     )

                //     i.update({components: [row, filtrow]})

                //     let filter3 = (btnInt) => {
                //       return interaction.user.id === btnInt.user.id
                //   }
                 
                //   const collector3 = emb.createMessageComponentCollector({
                //       filter: filter3
                //   })

                //   collector3.on("collect", async (i, user) => {
                //     if(i.customId.includes("t1") || i.customId.includes("t2") || i.customId.includes("t3") || i.customId.includes("t4") || i.customId.includes("t5")){
                //       var flist = userparts;
  
                //       var quantities = flist.reduce(function(obj, n) {
                //         if (obj[n]) obj[n]++;
                //         else        obj[n] = 1;
                        
                //         return obj;
                //       }, {});
                      
                      
                //       for (var n in quantities) {
                //         if(n.startsWith(`T2`)){
                //           actuserparts.push(`${n} x${quantities[n]}`)

                //         }
                //         console.log(`filtered: ${actuserparts}`)
                
                //       }

                //     }
                //   })
                   
                //   }

                // })

              
  
  
 
    
        } else  if(subcommand == "items"){
         
          if(!items || items.length == 0) return interaction.channel.send(`You don't have any items!`)
          actitems = lodash.chunk(actitems.map((a, i) => `${a}\n`), 10) || ['No Items']

          if(actitems == [""] || actitems.length == 0 || !actitems.length){
            actitems = ["No Items"]
          }

          let embed1 = new MessageEmbed()
          .setTitle(`${target.username}'s items`)
          .setThumbnail('https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png') 

          .setDescription(`${actitems[0].join('\n')}`)
          .addField("​", "​")
          .setColor('#60b0f4')
             
          let row = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setCustomId("previous")
            .setEmoji('◀️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("next")
            .setEmoji('▶️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("first")
            .setEmoji('⏮️')
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId("last")
            .setEmoji('⏭️')
            .setStyle('SECONDARY')
          )
          await interaction.deferReply();

          let msg = await interaction.editReply({embeds: [embed1], components: [row], fetchReply: true})

            let filter = (btnInt) => {
              return interaction.user.id === btnInt.user.id
          }
          let collector = msg.createMessageComponentCollector({
            filter: filter
        })
            let page = 1
            collector.on('collect', async (i) => {
                let current = page;
                  if (i.customId.includes('previous') && page !== 1) page--
                else if (i.customId.includes('next') && page !== actitems.length) page++
                else if (i.customId.includes('first')) page = 1
                else if (i.customId.includes('last')) page = actitems.length
               
                embed1.setDescription(`\n${actitems[page - 1].join('\n')}`)
  
                
                if (current !== page) {
                    embed1.setFooter(`Pages ${page}/${actitems.length}`)
                    i.update({embeds: [embed1]})
                }
                else {
                  return i.update({content: "No pages left!"})
                }
            })
  
  
        
        }  
        
        else {
          let usercars = userdata.cars
          let displaycars = []
          for(i in usercars){
            let car = usercars[i]

            displaycars.push(`${car.Emote} ${car.Name} \`${car.ID}\``)
          }
          displaycars = lodash.chunk(displaycars.map((a, i) => `${a}\n`), 10) || ['No Cars']

          let yacht = userdata.yacht
          if(yacht){
            displaycars[0].push(`🚢 Yacht`)
            sum += 1000000000
          }

        let embed1 = new MessageEmbed()
        .setTitle(`${target.username}'s cars`)
        .setDescription(`${displaycars[0].join('\n')}\n\nGarage Value: $${numberWithCommas(sum)}\n\nGarage Limit: ${cars.length}/${garagelimit}`)
        .setThumbnail('https://i.ibb.co/DCNwJrs/Logo-Makr-0i1c-Uy.png') 
        .setImage(garageimg)
        .addField("​", "​")
        embed1.setFooter(`Page 1/${displaycars.length}`)

        .setColor('#60b0f4')
        
                  
        let row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId("previous")
          .setEmoji('◀️')
          .setStyle('SECONDARY'),
          new MessageButton()
          .setCustomId("next")
          .setEmoji('▶️')
          .setStyle('SECONDARY'),
          new MessageButton()
          .setCustomId("first")
          .setEmoji('⏮️')
          .setStyle('SECONDARY'),
          new MessageButton()
          .setCustomId("last")
          .setEmoji('⏭️')
          .setStyle('SECONDARY')
        )
        await interaction.deferReply();

        let msg = await interaction.editReply({embeds: [embed1], components: [row], fetchReply: true})
        let filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id
      }
      let collector = msg.createMessageComponentCollector({
        filter: filter
    })
          let page = 1
          collector.on('collect', async (i) => {
              let current = page;
              if (i.customId.includes('previous') && page !== 1) page--
              else if (i.customId.includes('next') && page !== displaycars.length) page++
              else if (i.customId.includes('first')) page = 1
              else if (i.customId.includes('last')) page = displaycars.length
             
              embed1.setDescription(`${displaycars[page - 1].join('\n')}\n\nGarage Value: $${numberWithCommas(sum)}\n\nGarage Limit: ${cars.length}/${garagelimit}`)
              
              
              if (current !== page) {
                  embed1.setFooter(`Page ${page}/${displaycars.length}`)
                  i.update({embeds: [embed1]})

              }
              else {
                return i.update({content: "No pages left!"})

              }
          })


   
      
    }
        if(sum >= 50000000 && !badges.includes("carrich")){
          
          badges.push(`badges_${targetId}`, "carrich")
          userdata.save()
          interaction.channel.send(`${target}, You just earned the "Car Rich" badge for having a total garage value of $50M!`)
        }
        
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
          
   
       
    }
  
}