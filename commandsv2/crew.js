const db = require('quick.db')
const Discord = require('discord.js')
const {MessageActionRow, MessageButton} = require("discord.js")
const icons = require('../crewicons.json')
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const crewicons = require("../crewicons.json")
const cars = require("../cardb.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("crew")
    .setDescription("Do things with crews")
    .addSubcommand((subcommand) => subcommand
    .setName("other")
    .setDescription("Join, leave, edit and view crews")
    .addStringOption((option) => option
    .setName("option")
    .setDescription("Join, create, leave, and more")
    .setRequired(true)
    .addChoice("Join", "join")
    .addChoice("Leave", "leave")
    .addChoice("View", "view")
    .addChoice("Create", "create")
    .addChoice("Global Leaderboard", "leaderboard")
    .addChoice("Set Icon (crew owner)", "icon")
    .addChoice("Delete (DANGEROUS)", "delete")
    .addChoice("Approve Icon (BOT SUPPORT)", "approveico")
    )
    .addStringOption((option) => option
    .setName("name")
    .setDescription("The name of the crew or icon")
    )
    )
    .addSubcommand((subcommand) => subcommand
      .setName("pvp")
      .setDescription("PVP race other crews")

    
      .addStringOption((option) => option
      .setName("car")
      .setDescription("The car to race with")
      .setRequired(true)

      )
      .addUserOption((option) => option 
      .setName("user")
      .setDescription("The user to race")
      .setRequired(true)
      )
    ),
    async execute(interaction) {
      let subcmd = interaction.options.getSubcommand()
      if(subcmd == "other"){

        let option = interaction.options.getString("option")
        if(option == "view"){
        let crewname = interaction.options.getString("name")
        let crew
        if(!crewname){
           crew = db.fetch(`crew_${interaction.user.id}`)
          if(!crew) return interaction.reply("You're not in a crew! Join one with /joincrew [crew name]")
          crewname = crew
        }
        let crews = db.fetch(`crews`)
        if(!crews.includes(crewname)) return interaction.reply("That crew does not exist!")
        let crew2 = db.fetch(`crew_${crewname}`)
        let rpmembers = crew2.members
        rpmembers.length = 10
        let emoji = "<:zerorp:939078761234698290>"
        var finalLb = "";
        let total = 0
        let rparray = []
        let newrparray = []
        for(i in rpmembers){
          let user = rpmembers[i]
          let rp = db.fetch(`rp_${user}`)
          if(!rp){
            db.set(`rp_${user}`, 0)
          }
          let newrp = db.fetch(`rp_${user}`)
          rparray.push({rp: newrp, user: user})
           newrparray = rparray.sort((a, b) => b.rp - a.rp)
        }
        for (var i  in newrparray) {
    
         
    
          let name = await interaction.client.users.fetch(newrparray[i].user)
          let tag = name.tag
          total += newrparray[i].rp
          finalLb += `**${newrparray.indexOf(newrparray[i])+1}.** ${tag} - **${numberWithCommas(newrparray[i].rp)}** ${emoji}\n`;
    } 

    let icon = db.fetch(`crewicons_${crewname}`) || icons.Icons.default
        let embed = new Discord.MessageEmbed()
       .setTitle(`Info for ${crew2.crewname}`)
       .setThumbnail(icon)
       .addField("Information", `${crew2.memberslength} members\n\nRank ${crew2.Rank}\n\nRP: ${total}\n\nCrew Leader: ${crew2.owner.tag}`, true)
       .addField("Leaderboard", `${finalLb}`, true)
       .addField("Rank Perks", `Rank 10: 10% Cash Gains\n\nRank 20: 15% Cash Gains\n\nRank 30: 20% Cash Gains\n\nRank 50: 25% Cash Gains\n\nRank 100: Double Cash Gains`, true)

       .setColor('#60b0f4')
    
       let row = new MessageActionRow()
       .addComponents(
         new MessageButton()
         .setCustomId("season")
         .setEmoji("💵")
         .setLabel("Season 1")
         .setStyle("SECONDARY"),
         new MessageButton()
         .setCustomId("stats")
         .setEmoji("📊")
         .setLabel("Stats")
         .setStyle("SECONDARY")
         
         )
    
    
      interaction.reply({embeds: [embed], components: [row], fetchReply: true}).then(async emb => {
        let filter = (btnInt) => {
          return interaction.user.id === btnInt.user.id
      }
     
      const collector = emb.createMessageComponentCollector({
          filter: filter
      })
     
        collector.on('collect', async (i) => {
          if(i.customId.includes("season")){
            let crewseason = require('../seasons.json').Seasons.Crew1.Rewards
            reward = []
            for(var w in crewseason)  {
              let item = crewseason[w]
              let required = item.Number
              let emote = "❌"
              if(required <= crew2.Rank){
                emote = "✅"
              }
              reward.push(`**${item.Number}** : ${item.Item} ${emote}`)
            }
            embed.setTitle(`Season 1 for ${crew2.crewname}`)
            embed.fields = []
            embed.addField("Rewards", `${reward.join('\n')}`)

            await i.update({embeds: [embed]})
          }
          else if(i.customId.includes("stats")){
            embed.fields = []
            embed.setTitle(`Info for ${crew2.crewname}`)
            .setThumbnail(icons.Icons[crew2.icon.toLowerCase()])
            .addField("Information", `${crew2.memberslength} members\n\nRank ${crew2.Rank}\n\nRP: ${total}\n\nCrew Leader: ${crew2.owner.tag}`, true)
            .addField("Leaderboard", `${finalLb}`, true)
            .addField("Rank Perks", `Rank 10: 10% Cash Gains\n\nRank 20: 15% Cash Gains\n\nRank 30: 20% Cash Gains\n\nRank 50: 25% Cash Gains\n\nRank 100: Double Cash Gains`, true)
     
            .setColor('#60b0f4')

            await i.update({embeds: [embed]})

          }
        })

      })
        
      }else if(option == "approveico"){

        let whitelist = ["275419902381260802", "890390158241853470", "699794627095429180", "670895157016657920", "576362830572421130", "937967206652837928", 
        "311554075298889729", "474183542797107231", "678558875846443034", "211866621684219904"]

        if(!whitelist.includes(interaction.user.id)) return interaction.reply({content:`You don't have permission to use this command!`, ephemeral: true})
        let crewname = interaction.options.getString("name")

        let iconchoice = db.get(`crewicons_${crewname}`)
             
        if(!iconchoice) return interaction.reply(`Wrong name!`)

        db.set(`crew_${crewname}.icon`, iconchoice.toLowerCase())

        interaction.reply(`✅`)
    
      }

      else if(option == "join"){
        let uid = interaction.user.id
        let crewname = interaction.options.getString("name")
        let crewnames = db.fetch(`crews`)
        if(!crewname) return interaction.reply("Please specify a crew name!")
        if(!crewnames.includes(crewname)) return interaction.reply("That crew doesn't exist!")
        let crew = db.fetch(`crew_${uid}`)
        if(crew) return interaction.reply("You're already in a crew!")
      
        db.push(`crew_${crewname}.members`, uid)
        db.set(`crew_${uid}`, crewname)
        db.add(`crew_${crewname}.memberslength`, 1)
        db.set(`rp_${uid}`, 0)
        db.set(`joinedcrew_${uid}`, Date.now())
      
        interaction.reply(`✅ Joined ${crewname}`)
      }
      else if(option == "create"){
        let crewname = interaction.options.getString("name")
        let crews = db.fetch(`crews`) || []
        if(!crewname) return interaction.reply("Please specify a crew name!")
        if(crews.includes(`${crewname}`)) return interaction.reply("That crew already exists!")
        let crew = db.fetch(`crew_${interaction.user.id}`)
        if(crew) return interaction.reply("You're already in a crew! If you're a member, leave with /leavecrew, and if you're the owner, delete it with /deletecrew")
      
        
      
        db.set(`crew_${crewname}`, {crewname: crewname, members: [interaction.user.id], owner: interaction.user, icon: 'Default', Rank: 1, RP: 0, memberslength: 1})
        db.push(`crews`, crewname)
        db.set(`crew_${interaction.user.id}`, crewname)
        let embed = new Discord.MessageEmbed()
        .setTitle(`${crewname}`)
        .setThumbnail(crewicons.Icons.Default)
        .setDescription(`✅ Created a crew with the name ${crewname}, and the owner as <@${interaction.user.id}>`)
        .setColor('#60b0f4')
      
        interaction.reply({embeds: [embed]})
      }

      else if (option == "leave"){
        let uid = interaction.user.id
        let crew = db.fetch(`crew_${uid}`)
        if(!crew) return interaction.reply("You're not in a crew!")
        let crews = db.fetch(`crews`)
        if(!crews.includes(crew)) return interaction.reply("That crew doesn't exist!")
        let crew2 = db.fetch(`crew_${crew}`)
        let crewmembers = crew2.members
        
        if(crew2.owner.id == uid) return interaction.reply("You're the owner of this crew! Run /delete to delete it.") 
        
        interaction.reply("Are you sure? Say yes to confirm, and anything else to cancel.")
        const filter = (m = Discord.Message) => {
          return m.author.id === interaction.user.id
      }
      let collector = interaction.channel.createMessageCollector({
          filter,
          max: 1,
          time: 1000 * 30
      })
      collector.on('collect', m => {
          if(m.content.toLowerCase() == "yes"){
            db.delete(`crew_${uid}`)
            for (var i = 0; i < 1; i ++) crewmembers.splice(crewmembers.indexOf(interaction.user.id), 1)
            db.set(`crew_${crew}.members`, crewmembers)
            db.subtract(`crew_${crew}.memberslength`, 1)
            db.delete(`cashgain_${uid}`)
            m.react('✅');

          } else {
            return interaction.channel.send("❌")
          }
      })
    }
    else if(option == "icon"){
      let crewname = db.fetch(`crew_${interaction.user.id}`)
      if(!crewname) return interaction.reply("You are not in a crew!")
      let crew2 = db.fetch(`crew_${crewname}`)
      if(crew2.owner.id !== interaction.user.id) return interaction.reply("You're not the crew owner!")
      
      interaction.reply("What crew icon would you like to submit? **Send an image below**")
      const filter = (m = discord.Message) => {
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
              let embed = new Discord.MessageEmbed()
              .setImage(ImageLink)
              .setDescription("Crew icon submitted for review!")
              .addField(`Crew Name`, `${crewname}`)
              .setColor("#60b0f4")
              m.reply({embeds: [embed]})
              let submitchannel = interaction.client.channels.cache.get('931078225021521920')
              
             
              
              submitchannel.send({embeds: [embed]})
              db.push(`crewicons_${interaction.user.id}`, {ID: crewname, Approved: false})
              db.set(`crewicons_${crewname}`, ImageLink)
             
  
              db.push(`crewicons_${crewname}_approve`, {id: db.fetch(`${crewname}`),  image: db.fetch(`crewicons_${crewname}`),  uid: interaction.user.id})
            }
            else {
                return m.reply("Specify an image!")
            }
          })       

   
    
    }

    else if(option == "leaderboard"){
      let money = db.all().filter(data => data.ID.startsWith(`rank`)).sort((a, b) => b.data - a.data)
      let emoji = "<:z_rank:933647725084430356>"
      money.length = 10;
      var finalLb = "";
      let crews = db.fetch(`crews`)
      if(!crews || !crews.length || crews.length == 0) return interaction.reply(`There aren't any crews yet!`)
  let rankarray = []
  for(i in crews){
    let crew = db.fetch(`crew_${crews[i]}`)
    let rank = db.fetch(`crew_${crews[i]}.Rank`)
    console.log(`${crew} : ${rank}`)
   
   
    rankarray.push({rank: rank, crew: crew.crewname})
    console.log(rankarray)
     newrparray = rankarray.sort((a, b) => b.rank - a.rank)
     newrparray.length = 10
  }
  for (var i  in newrparray) {
  
   
  
    let name = newrparray[i].crew
    
    
    finalLb += `**${newrparray.indexOf(newrparray[i])+1}.** ${name} - **${newrparray[i].rank}** ${emoji}\n`;
  } 
  const embed = new Discord.MessageEmbed()/*MessageEmbed*/
  .setTitle(`Crew Leaderboard`)
  .setDescription(finalLb)
  .setThumbnail("https://i.ibb.co/tHMFyps/Logo-Makr-8f-HTl4.png")
  .setColor('#60b0f4')
  interaction.reply({embeds: [embed]})
}

else if(option == "delete"){
  let uid = interaction.user.id
  let crewname = db.fetch(`crew_${uid}`)
  let crews = db.fetch(`crews`)
  if(!crewname) return interaction.reply("You're not in a crew!")
  if(!crews.includes(crewname)) return interaction.reply("Thats not a crew")
  let crew2 = db.fetch(`crew_${crewname}`)
  console.log(crew2.owner.id)
  if(crew2.owner.id !== uid) return interaction.reply("You're not the crew owner!")
  
  
  
  
  interaction.reply("Are you sure? This will permanently remove all cash gains, and perks. Say yes to confirm, and anything else to cancel.")
  const filter = (m = Discord.Message) => {
    return m.author.id === interaction.user.id
  }
  let collector = interaction.channel.createMessageCollector({
    filter,
    max: 1,
    time: 1000 * 30
  })
  collector.on('collect', m => {
    if(m.content.toLowerCase() == "yes"){
      db.delete(`crew_${uid}`)
      for(i in crew2.members){
        let user = crew2.members[i]
        db.delete(`crew_${user}`)
        db.delete(`cashgain_${user}`)
      }
          db.delete(`crew_${crewname}`)
          for (var i = 0; i < 1; i ++) crews.splice(crews.indexOf(crewname), 1)
          db.set(`crews`, crews)
          m.react('✅');

        } else {
          return interaction.channel.send("❌")
        }
      })
      
    }
  }
    else if(subcmd == "pvp"){

      let user1car = interaction.options.getString("car")
      let user2 = interaction.options.getUser("user")

      let user = interaction.user
      let timeout = 45000

      let user1cars = db.fetch(`cars_${user.id}`)
      let racing = db.fetch(`cracing_${user.id}`)
      let racing2 = db.fetch(`cracing_${user2.id}`)
      let dailytask1 = db.fetch(`dailytask_${user.id}`)
      let prestige = db.fetch(`prestige_${user.id}`)
      let prestige2 = db.fetch(`prestige_${user2.id}`)
      let crew = db.fetch(`crew_${user.id}`)
      let crew2 = db.fetch(`crew_${user2.id}`)

      if(!crew) return interaction.reply(`${user}, you need to be in a crew to battle!`)
      if(!crew2) return interaction.reply(`${user2}, you need to be in a crew to battle!`)

      if(crew == crew2) return interaction.reply(`You cant be in the same crew!`)

      let crewinf = db.fetch(`crew_${crew}`)
      let crewinf2 = db.fetch(`crew_${crew2}`)

      if (racing !== null && timeout - (Date.now() - racing) > 0) {
        let time = ms(timeout - (Date.now() - racing), {compact: true});
      
        return interaction.reply(`Please wait ${time} before racing again.`)
      } 
      if (racing2 !== null && timeout - (Date.now() - racing2) > 0) {
        let time = ms(timeout - (Date.now() - racing2), {compact: true});
      
        return interaction.reply(`The other user needs to wait ${time} before racing again.`)
      } 

      let idtoselect = interaction.options.getString("car")
      if(!idtoselect) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car! \`Command example: /race @test 1\`")
      let selected = db.fetch(`selected_${idtoselect}_${user.id}`)
      if(!selected) {
        let errembed = new Discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
        return  interaction.reply({embeds: [errembed]})
    }

    if (!user1cars) return interaction.reply("You dont have any cars!")
    let user1carchoice = selected.toLowerCase()

    if (!user1cars.some(e => e.includes(selected))) return interaction.reply(`You need to enter the car you want to verse with. E.g. \`race @user dragster\`\nYour current cars: ${user1cars.join(' ')}`)
    if(user.id === user2.id) return interaction.reply("You cant race yourself!")

    let user2cars = db.fetch(`cars_${user2.id}`);
    if (!user2cars) return interaction.reply("They dont have any cars!")
    if(!cars.Cars[user1carchoice]) return interaction.reply("Thats not a car!")

    let restoration = db.fetch(`${cars.Cars[user1carchoice.toLowerCase()].Name}restoration_${user.id}`)
    if(cars.Cars[user1carchoice.toLowerCase()].Junked && restoration < 100){
        return interaction.reply("This car is too junked to race, sorry!")
    }
    interaction.reply(`${user2}, what car do you wish to verse ${user} in?`)
    const filter = (m = Discord.Message) => {
        return m.author.id === user2.id
    }
    let collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 20
    })
    let selected2
    let user2carchoice
    let dailytask2 = db.fetch(`dailytask_${user2.id}`)
    collector.on('collect', msg => {

         user2carchoice = msg.content
      if(!user2carchoice) return interaction.reply("Specify an id! Use /ids select [id] [car] to select a car! \`Command example: /race @test 1\`")
       selected2 = db.fetch(`selected_${user2carchoice}_${msg.author.id}`)
       if(!selected2) {
        let errembed = new Discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
        return  msg.reply({embeds: [errembed]})
    }
        let restoration2 = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}restoration_${msg.author.id}`)
        if(cars.Cars[selected2.toLowerCase()].Junked && restoration2 < 100){
            return msg.reply("This car is too junked to race, sorry!")
        }
    })
    let racelevel = db.fetch(`racerank_${user.id}`)
    if(!db.fetch(`racerank_${user.id}`)) {
     db.set(`racerank_${user.id}`, 1)
    }
    let newrankrequired = racelevel * 200
    if(prestige >= 3){
      newrankrequired * 2
    }
   else if(prestige >= 5){
      newrankrequired * 3
    }
    
    let racelevel2 = db.fetch(`racerank_${user2.id}`)
    if(!db.fetch(`racerank_${user2.id}`)) {
     db.set(`racerank_${user2.id}`, 1)
    }
    let newrankrequired2 = racelevel2 * 100
    if(prestige2 >= 3){
      newrankrequired2 * 2
    }
   else if(prestige2 >= 5){
    newrankrequired2 * 3
    }
    collector.on('end', async () => {
        if (!user2carchoice) return interaction.channel.send("They didn't answer in time!")
        if(!selected2) return interaction.channel.send("They didn't answer in time!")
        let user2carspeed = db.fetch(`${cars.Cars[selected2.toLowerCase()].Name}speed_${user2.id}`);
        let user2car = cars.Cars[selected2].Name
        let user1car =  cars.Cars[user1carchoice].Name
        db.set(`cracing_${user.id}`, Date.now())
        db.set(`cracing_${user2.id}`, Date.now())

         let user1carspeed = db.fetch(`${user1car}speed_${user.id}`);
        
 

   let user1carzerosixty = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`)
   let user2carzerosixty = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)
   let range = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}range_${user.id}`)
   if(cars.Cars[user1car.toLowerCase()].Electric){
     if(range <= 0){
       return interaction.editReply(`${user}, Your EV is out of range! Run /charge to charge it!`)
     }
   }
   let range2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}range_${user2.id}`)
   if(cars.Cars[user2car.toLowerCase()].Electric){
     if(range2 <= 0){
       return interaction.editReply(`${user2}, Your EV is out of range! Run /charge to charge it!`)
     }
   }
   if (user1carzerosixty < 2) {
    db.set(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`, 2);
  }
  if (user2carzerosixty < 2) {
    db.set(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`, 2);
  }
  if(!db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)) {
    db.set(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`, cars.Cars[selected.toLowerCase()].Handling)
  }
  if(!db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`)) {
    db.set(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`, cars.Cars[user2car.toLowerCase()].Handling)
  }
  let newzero1 = db.fetch(`${cars.Cars[user1car.toLowerCase()].Name}060_${user.id}`)
  let newzero2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)

  let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling
  let handling2 = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}handling_${user2.id}`) || cars.Cars[user2car.toLowerCase()].Handling

  let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
  let otherzero2sixty = db.fetch(`${cars.Cars[user2car.toLowerCase()].Name}060_${user2.id}`)

  let newhandling = handling / 20
  let othernewhandling = handling2 / 20
  let new60 = user1carspeed / zero2sixtycar
  let new62 = user2carspeed / otherzero2sixty


  let hp = user1carspeed + newhandling
  let hp2 = user2carspeed + othernewhandling

   let weekytask1 = db.fetch(`weeklytask_${user.id}`)
   let weekytask2 = db.fetch(`weeklytask_${user2.id}`)

   let embed = new Discord.MessageEmbed()
   .setTitle("Crew Battle, 3...2...1....GO!")
   .addField(`${user.username}'s ${cars.Cars[user1car.toLowerCase()].Emote} ${cars.Cars[user1car.toLowerCase()].Name}`, `Speed: ${user1carspeed}\n\n0-60: ${newzero1}s\n\nCrew: ${crew}`)
   .addField(`${user2.username}'s ${cars.Cars[user2car.toLowerCase()].Emote} ${cars.Cars[user2car.toLowerCase()].Name}`, `Speed: ${user2carspeed}\n\n0-60: ${newzero2}s\n\nCrew: ${crew2}`)
   .setColor("#60b0f4")
   .setThumbnail("https://i.ibb.co/qmq1CJF/crewico.png")
   let msg2 = await interaction.editReply({embeds: [embed]})
  
   

   let tracklength = 0
   let tracklength2 = 0 
  
   tracklength += new60
   tracklength2 += new62

  let timer = 0
  let x = setInterval(() => {
     tracklength += hp
     tracklength2 += hp2
     timer++
     console.log(tracklength)
     console.log(tracklength2)
    
     if(timer >= 10){

      let ticketsearned = 100
      let ticketsearned2 = 100

      let energydrink = db.fetch(`energydrink_${interaction.user.id}`)
      let energytimer = db.fetch(`energytimer_${interaction.user.id}`)
      let energydrink2
      if(energydrink){
        let timeout = 300000
        if (timeout - (Date.now() - energytimer) > 0) {          
          console.log("no energy")
        } else {
            db.set(`energydrink_${interaction.user.id}`, false)
        }
         energydrink2 = db.fetch(`energydrink_${interaction.user.id}`)

      }
      if(energydrink2 == true){
        ticketsearned = ticketsearned * 2
      }

      let energydrinku2 = db.fetch(`energydrink_${user2.id}`)
      let energytimeru2 = db.fetch(`energytimer_${user2.id}`)
      let energydrink2u2
      if(energydrinku2){
        let timeout = 300000
        if (timeout - (Date.now() - energytimeru2) > 0) {          
          console.log("no energy")
        } else {
            db.set(`energydrink_${user2.id}`, false)
        }
        energydrink2u2 = db.fetch(`energydrink_${user2.id}`)

      }
      if(energydrink2 == true){
        ticketsearned2 = ticketsearned2 * 2
      }


       if(tracklength > tracklength2){
           console.log("End")
           clearInterval(x)
           embed.addField("Results", `${user.username} Won`)
           embed.addField("Earnings", `${ticketsearned} RP`)
         
           msg2.edit({embeds: [embed]})
           db.add(`cash_${user.id}`, 500)
           db.add(`racexp_${user.id}`, 25)
           db.add(`rp_${user.id}`, ticketsearned)

          if(dailytask1 && dailytask1.task == "Win 1 pvp race" && !dailytask1.completed){
              db.set(`dailytask_${user.id}.completed`, true)
              db.add(`cash_${user.id}`, dailytask1.reward)
              msg2.reply(`${user}, you just completed your daily task "${dailytask1.task}"!`)
          }
          if(weekytask1 && weekytask1.task == "Win a pvp race in a 1994 Porsche 911" && !weekytask1.completed && user1car.toLowerCase() == "1994 porsche 911"){
              db.set(`weeklytask_${user.id}.completed`, true)
              db.add(`cash_${user.id}`, weekytask1.reward)
              msg2.reply(`${user}, you just completed your weekly task "${weekytask1.task}"!`)
          }
           if(db.fetch(`racexp_${user.id}`) >= newrankrequired){
               if(db.fetch(`racerank_${user.id}`) < 20){
                   db.add(`racerank_${user.id}`, 1)
                   msg2.reply(`${user}, you just ranked up your race skill to ${db.fetch(`racerank_${user.id}`)}!`)
  
               }
              }
           return;
       }
  
       else if(tracklength < tracklength2){
          console.log("End")
          clearInterval(x)
          embed.addField("Results", `${user2.username} Won`)
          embed.addField("Earnings", `${ticketsearned2} RP`)
   
          msg2.edit({embeds: [embed]})
          db.add(`cash_${user2.id}`, 500)
          db.add(`racexp_${user2.id}`, 25)
          db.add(`rp_${user2.id}`, ticketsearned2)
 
          if(dailytask2 && dailytask2.task == "Win 1 pvp race" && !dailytask2.completed){
              db.set(`dailytask_${user2.id}.completed`, true)
              db.add(`cash_${user2.id}`, dailytask2.reward)
              msg2.reply(`${user2}, you just completed your daily task "${dailytask2.task}"!`)
  
          }
          if(weekytask2 && weekytask2.task == "Win a pvp race in a 1994 Porsche 911" && !weekytask2.completed && user2car.toLowerCase() == "1994 porsche 911"){
              db.set(`weeklytask_${user2.id}.completed`, true)
              db.add(`cash_${user2.id}`, weekytask2.reward)
              msg2.reply(`${user2}, you just completed your weekly task "${weekytask2.task}"!`)
          }
          if(db.fetch(`racexp_${user2.id}`) >= newrankrequired2){
              if(db.fetch(`racerank_${user2.id}`) < 20){
                  db.add(`racerank_${user2.id}`, 1)
                  msg2.reply(`${user2}, you just ranked up your race skill to ${db.fetch(`racerank_${user2.id}`)}!`)
  
              }
             }
          return;
   
       }
     }
     

   }, 1000);


    
})


    }


  
  }
  
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}