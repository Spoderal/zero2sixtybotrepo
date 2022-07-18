const db = require('quick.db')
const Discord = require('discord.js')
const pfpdb = require('../pfpsdb.json')
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require("lodash")
const colors = require('../colordb.json')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("editprofile")
    .setDescription("Edit your profile card")
    .addStringOption((option) => option
    .setName("option")
    .setDescription("Description or helmet")
    .addChoice("Helmet", "helmet")
    .addChoice("Description", "description")
    .addChoice("View Helmets", "view helmets")
    .addChoice("Background", "background")
    .addChoice("View backgrounds", "vbackground")

    .setRequired(true)
   
    )
    .addStringOption((option) => option
    .setName("item")
    .setDescription("The helmet, or description you'd like to set")
    .setRequired(false)
  
    ),
    async execute(interaction) {

        let option = interaction.options.getString("option")

        if(option == "helmet"){
            let userpfps = db.fetch(`pfps_${interaction.user.id}`)
            
            let pfp = interaction.options.getString("item")
            if(!pfp) return interaction.reply("Specify a helmet!")
            let pfplist = pfpdb
            if(!pfplist.Pfps[pfp.toLowerCase()]) return interaction.reply("Thats not a profile picture.")
            if(!userpfps) return interaction.reply("You dont have any profile pictures.")
            if(!userpfps.includes(pfp.toLowerCase())) return interaction.reply("You dont own that profile picture.")
            
            db.set(`currentpfp_${interaction.user.id}`, pfp.toLowerCase())
            
            interaction.reply(`Set your profile picture to "${pfp}"`)

        }
        else if(option == "description"){
            let titletoset = interaction.options.getString("item")
            let letterCount = titletoset.replace(/\s+/g, '').length;
            if(letterCount > 35) return interaction.reply("Max characters 35!")
        
            db.set(`profile_description_${interaction.user.id}`, titletoset.toLowerCase())
        
            interaction.reply(`Set your profile description to "${titletoset}"`)
    

        }
        else if(option == "background"){
            let bgdb = require("../backgrounds.json")
            let pfp = interaction.options.getString("item")
            if(!pfp) return interaction.reply("Specify a background! The available backgrounds are: Space, Flames, Police, Finish Line, Ocean, and Default")
            if(!bgdb[pfp.toLowerCase()]) return interaction.reply("Thats not a profile background! The available backgrounds are: Space, Flames, Police, Finish Line, Ocean, and Default")
            
            db.set(`profilepagebg_${interaction.user.id}`, bgdb[pfp.toLowerCase()].Image)
            let dailytask = db.fetch(`dailytask_${interaction.user.id}`);
            if (
                dailytask &&
                !dailytask.completed &&
                dailytask.task == "Change your profile background"
              ) {
                interaction.channel.send(`Task completed!`)
                db.set(`dailytask_${interaction.user.id}.completed`, true);
                db.add(`cash_${interaction.user.id}`, dailytask.reward);
              }
            interaction.reply(`Set your profile background to "${pfp}"`)

        }
        else if(option == "vbackground"){
            let bgdb = require("../backgrounds.json")
            var bgs = []
            for(bg in bgdb){
                bgs.push(`${bgdb[bg].Emote} ${bgdb[bg].Name}`)
            }

            let embed = new Discord.MessageEmbed()
            .setTitle("Backgrounds Available")
            .setDescription(`${bgs.join('\n\n')}`)
             .setColor("#60b0f4")            

            interaction.reply({embeds: [embed]})



        }
        
        else if(option == "view helmets"){
            let userpfps = db.fetch(`pfps_${interaction.user.id}`)
        if(userpfps == ['None'] || userpfps == null || !userpfps) return interaction.reply("You don't have any helmets!")
        var userhelmets = []
        let actpfp
        for (var i = 0; i < userpfps.length; i++ && userpfps !== ['None']) {
            actpfp = userpfps[i]
            userhelmets.push(`${pfpdb.Pfps[actpfp].Name} ${pfpdb.Pfps[actpfp].Emote}`)

        }
        userhelmets = lodash.chunk(userhelmets.map((a, i) => `${a}\n`), 10)
        let embed = new Discord.MessageEmbed()
        .setTitle("Your Profile Helmets")
        .setDescription(`${userhelmets[0].join(` \n`)}`)

embed.setColor('#60b0f4')
        .setThumbnail("https://i.ibb.co/F0hLvQt/newzerologo.png")
        interaction.reply("Please wait...")
        interaction.channel.send({embeds: [embed]}).then(async emb => {
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️'].forEach(async m => await emb.react(m))
            const filter = (_, u) => u.id === interaction.user.id
            const collector = emb.createReactionCollector({ filter, time: 30000 })
            let page = 1
            collector.on('collect', async (r, user) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(user.id)
                if (r.emoji.name === '◀️' && page !== 1) page--
                else if (r.emoji.name === '▶️' && page !== userhelmets.length) page++
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = userhelmets.length
                else if (r.emoji.name === '⏹️') return collector.stop()
               
                embed.setDescription(`\n${userhelmets[page - 1].join('\n')}`)
  
                
                if (current !== page) {
                    embed.setFooter(`Pages ${page}/${userhelmets.length}`)
                    emb.edit({embeds: [embed]})
                }
            })
  
  
        })
    

        }


    }
}