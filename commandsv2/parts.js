const Discord = require("discord.js")
const parts = require('../partsdb.json')
const db = require('quick.db')

const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('parts')
    .setDescription("Check the parts shop"),
    async execute(interaction) {

      const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton, DiscordAPIError } = require('discord.js');
    
    
    
      const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select')
          .setPlaceholder('Select a part')
          .addOptions([
            {
              label: 'Exhaust',
              description: 'Select this for the list of exhausts',
              value: 'first_option',
              customId: 'd_class',
              emoji:"<:exhaustdefault:968751109252448256>"
            },
             {
              label: 'Tires',
              description: 'Select this for the list of tires',
              value: 'first_option_2',
              customId: 'd_class',
              emoji:"<:tiresdefault:968751426148921354>"
            },
            {
              label: 'Intakes',
              description: 'Select this for the list of intakes',
              value: 'second_option',
              customId: 'c_class',
              emoji:"<:intakedefault:968751143276662865>"
            },
            {
              label: 'Turbos',
              description: 'Select this for the list of turbos',
              value: 'second_option_2',
              customId: 'c_class',
              emoji:"<:turbodefault:968751445983789057>"
            },
            {
              label: 'Suspension',
              description: 'Select this for the list of suspensions',
              value: 'third_option',
              emoji:"<:suspensiondefault:968751186255708190>"
            },
            {
              label: 'Engines',
              description: 'Select this for the list of engines',
              value: 'third_option_2',
              emoji:"<:enginedefault:968751121361420308>"
            },
            {
              label: 'Gearboxes',
              description: 'Select this for the list of gearboxes',
              value: 'third_option_3',
              emoji:"<:gearboxdefault:968751095629348894>"
            },
            {
              label: 'Body',
              description: 'Select this for the list of body options',
              value: 'body_option',
              emoji:"<:gearboxdefault:968751095629348894>"
            },
            {
              label: 'Extras',
              description: 'Select this for the list of clutch/ecus/nitrous/EV Upgrades',
              value: 'fifth_option',
              emoji:"<:defaultecu:968751246896939008>"
            },
           
         
          ]),
      );
    
      let embed = new MessageEmbed()
      .setTitle('Car Parts')
      .setThumbnail("https://i.ibb.co/89GbzcB/Logo-Makr-8u-BQuo.png")
      .addField(`Available Parts`, `*Choose a part from the drop down below*\n\nExhausts <:exhaustdefault:968751109252448256>
      Tires <:tiresdefault:968751426148921354>
      Intakes <:intakedefault:968751143276662865>
      Turbos <:turbodefault:968751445983789057>
      Suspension <:suspensiondefault:968751186255708190>
      Engines <:enginedefault:968751121361420308>
      Gearboxes <:gearboxdefault:968751095629348894>
      Body (REWORKING)
      Extras (Clutch, ECU, Nitrous, EV) <:defaultecu:968751246896939008>
     `, true)
      .setColor("#60b0f4")
      .setDescription(`\`/buy (part)\` to buy a part\n\n[Official Server](https://discord.gg/bHwqpxJnJk)`)
      interaction.reply({embeds: [embed], components: [row]}).then(async msg => {
    
        try{
        const filter = (interaction) => interaction.isSelectMenu() && interaction.user.id === interaction.user.id;
    
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 1000 * 30,
        })
    
    
        collector.on('collect', async (collected) => {
          
          const value = collected.values[0];
          if (value === 'first_option') {
    
            let embed2
                  embed2 = new MessageEmbed()
    
                 .setTitle('Exhausts')
       .setFooter('Tip: Purchase a part with "/buy [part]"')
       .setDescription(`**
       Page 1\n
            ${parts.Parts["t1exhaust"].Emote}  ${parts.Parts["t1exhaust"].Name} : $${numberWithCommas(parts.Parts["t1exhaust"].Price)}\n
            ${parts.Parts["t2exhaust"].Emote}  ${parts.Parts["t2exhaust"].Name} : $${numberWithCommas(parts.Parts["t2exhaust"].Price)}\n
            ${parts.Parts["t3exhaust"].Emote}  ${parts.Parts["t3exhaust"].Name} : $${numberWithCommas(parts.Parts["t3exhaust"].Price)}\n
    
    
       **`)
       .setColor("#60b0f4")
       .setThumbnail("https://i.ibb.co/sP3F1p2/exhaustdefault.png")
       interaction.editReply({embeds: [embed2], components: [row]})
      }
    
      else   if (value === 'first_option_2') {
        let embed2
              embed2 = new MessageEmbed()
    
             .setTitle('Tires')
    .setFooter('Tip: Purchase a part with "/buy [part]"')
    .setDescription(`**
    Page 1\n
        ${parts.Parts["t1tires"].Emote}  ${parts.Parts["t1tires"].Name} : $${numberWithCommas(parts.Parts["t1tires"].Price)}\n
        ${parts.Parts["t2tires"].Emote}  ${parts.Parts["t2tires"].Name} : $${numberWithCommas(parts.Parts["t2tires"].Price)}\n
        ${parts.Parts["t3tires"].Emote}  ${parts.Parts["t3tires"].Name} : $${numberWithCommas(parts.Parts["t3tires"].Price)}\n
        ${parts.Parts["t1drifttires"].Emote}  ${parts.Parts["t1drifttires"].Name} : $${numberWithCommas(parts.Parts["t1drifttires"].Price)}\n
        ${parts.Parts["t2drifttires"].Emote}  ${parts.Parts["t2drifttires"].Name} : $${numberWithCommas(parts.Parts["t2drifttires"].Price)}\n
        ${parts.Parts["t3drifttires"].Emote}  ${parts.Parts["t3drifttires"].Name} : $${numberWithCommas(parts.Parts["t3drifttires"].Price)}\n

    
    **`)
    .setColor("#60b0f4")
    .setThumbnail("https://i.ibb.co/NKHhh2r/tiresdefault.png")
    interaction.editReply({embeds: [embed2], components: [row]})
    }
    
          else  if (value === 'second_option') {
    
            let embed2
            embed2 = new MessageEmbed()
    
            .setTitle('Intakes')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
                 ${parts.Parts["t1intake"].Emote}  ${parts.Parts["t1intake"].Name} : $${numberWithCommas(parts.Parts["t1intake"].Price)}\n
                 ${parts.Parts["t2intake"].Emote}  ${parts.Parts["t2intake"].Name} : $${numberWithCommas(parts.Parts["t2intake"].Price)}\n
                 ${parts.Parts["t3intake"].Emote}  ${parts.Parts["t3intake"].Name} : $${numberWithCommas(parts.Parts["t3intake"].Price)}\n
                
         
         
            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/ZhZ3W91/intakedefault.png")
            interaction.editReply({embeds: [embed2], components: [row]})
    
          }
    
          else  if (value === 'second_option_2') {
    
            let embed2
            embed2 = new MessageEmbed()
    
            .setTitle('Turbos')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
                 ${parts.Parts["turbo"].Emote}  ${parts.Parts["turbo"].Name} : $${numberWithCommas(parts.Parts["turbo"].Price)}\n
                 ${parts.Parts["dualturbo"].Emote}  ${parts.Parts["dualturbo"].Name} : $${numberWithCommas(parts.Parts["dualturbo"].Price)}\n
                 ${parts.Parts["supercharger"].Emote}  ${parts.Parts["supercharger"].Name} : $${numberWithCommas(parts.Parts["supercharger"].Price)}\n
                
         
         
            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/zP8H95J/turbodefault.png")
            interaction.editReply({embeds: [embed2], components: [row]})
    
          }
          else  if (value === 'body_option') {
    
            let embed2
            embed2 = new MessageEmbed()
    
            .setTitle('Body')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
                 ${parts.Parts["t1bodykit"].Emote}  ${parts.Parts["t1bodykit"].Name} : $${numberWithCommas(parts.Parts["t1bodykit"].Price)}\n
                 ${parts.Parts["t2bodykit"].Emote}  ${parts.Parts["t2bodykit"].Name} : $${numberWithCommas(parts.Parts["t2bodykit"].Price)}\n
                 ${parts.Parts["t1spoiler"].Emote}  ${parts.Parts["t1spoiler"].Name} : $${numberWithCommas(parts.Parts["t1spoiler"].Price)}\n
                 ${parts.Parts["t2spoiler"].Emote}  ${parts.Parts["t2spoiler"].Name} : $${numberWithCommas(parts.Parts["t2spoiler"].Price)}\n
                 ${parts.Parts["t3spoiler"].Emote}  ${parts.Parts["t3spoiler"].Name} : $${numberWithCommas(parts.Parts["t3spoiler"].Price)}\n
                 ${parts.Parts["t1weightreduction"].Emote}  ${parts.Parts["t1weightreduction"].Name} : $${numberWithCommas(parts.Parts["t1weightreduction"].Price)}\n
                 ${parts.Parts["t2weightreduction"].Emote}  ${parts.Parts["t2weightreduction"].Name} : $${numberWithCommas(parts.Parts["t2weightreduction"].Price)}\n

            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/zP8H95J/turbodefault.png")
            interaction.editReply({embeds: [embed2], components: [row]})
    
          }
    
          else  if (value === 'third_option') {
    
            let embed2
            embed2 = new MessageEmbed()
    
            .setTitle('Suspension')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
                 ${parts.Parts["racesuspension"].Emote}  ${parts.Parts["racesuspension"].Name} : $${numberWithCommas(parts.Parts["racesuspension"].Price)}\n
                 ${parts.Parts["driftsuspension"].Emote}  ${parts.Parts["driftsuspension"].Name} : $${numberWithCommas(parts.Parts["driftsuspension"].Price)}\n
                 ${parts.Parts["t1offroadsuspension"].Emote}  ${parts.Parts["t1offroadsuspension"].Name} : $${numberWithCommas(parts.Parts["t1offroadsuspension"].Price)}\n
                 ${parts.Parts["t2racesuspension"].Emote}  ${parts.Parts["t2racesuspension"].Name} : $${numberWithCommas(parts.Parts["t2racesuspension"].Price)}\n
                 ${parts.Parts["t2driftsuspension"].Emote}  ${parts.Parts["t2driftsuspension"].Name} : $${numberWithCommas(parts.Parts["t2driftsuspension"].Price)}\n
                 ${parts.Parts["t3driftsuspension"].Emote}  ${parts.Parts["t3driftsuspension"].Name} : $${numberWithCommas(parts.Parts["t3driftsuspension"].Price)}\n
                 ${parts.Parts["t2offroadsuspension"].Emote}  ${parts.Parts["t2offroadsuspension"].Name} : $${numberWithCommas(parts.Parts["t2offroadsuspension"].Price)}\n
                 ${parts.Parts["t3racesuspension"].Emote}  ${parts.Parts["t3racesuspension"].Name} : $${numberWithCommas(parts.Parts["t3racesuspension"].Price)}\n

         
         
            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/mFb3mMk/suspensiondefault.png")
            interaction.editReply({embeds: [embed2], components: [row]})
    
    }
    else  if (value === 'third_option_2') {
    
    
    let embed2
    embed2 = new MessageEmbed()
    
    .setTitle('Engines')
    .setFooter('Tip: Purchase a part with "/buy [part]"')
    .setDescription(`**
    Page 1\n
     ${parts.Parts["2jz-gte"].Emote}  ${parts.Parts["2jz-gte"].Name} : $${numberWithCommas(parts.Parts["2jz-gte"].Price)}\n
     ${parts.Parts["v10"].Emote}  ${parts.Parts["v10"].Name} : $${numberWithCommas(parts.Parts["v10"].Price)}\n
     ${parts.Parts["v12"].Emote}  ${parts.Parts["v12"].Name} : $${numberWithCommas(parts.Parts["v12"].Price)}\n
     ${parts.Parts["ls1"].Emote}  ${parts.Parts["ls1"].Name} : $${numberWithCommas(parts.Parts["ls1"].Price)}\n
     ${parts.Parts["ls2"].Emote}  ${parts.Parts["ls2"].Name} : $${numberWithCommas(parts.Parts["ls2"].Price)}\n
     ${parts.Parts["ls3"].Emote}  ${parts.Parts["ls3"].Name} : $${numberWithCommas(parts.Parts["ls3"].Price)}\n
     ${parts.Parts["rocket engine"].Emote}  ${parts.Parts["rocket engine"].Name} : $${numberWithCommas(parts.Parts["rocket engine"].Price)}\n

    
    **`)
    .setColor("#60b0f4")
    .setThumbnail("https://i.ibb.co/MC6gH5B/enginedefault.png")
    interaction.editReply({embeds: [embed2], components: [row]})
    
          }
          else  if (value === 'third_option_3') {
    
    
            let embed2
            embed2 = new MessageEmbed()
            
            .setTitle('Gearboxes')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
             ${parts.Parts["t1gearbox"].Emote}  ${parts.Parts["t1gearbox"].Name} : $${numberWithCommas(parts.Parts["t1gearbox"].Price)}\n
             ${parts.Parts["t2gearbox"].Emote}  ${parts.Parts["t2gearbox"].Name} : $${numberWithCommas(parts.Parts["t2gearbox"].Price)}\n
             ${parts.Parts["t3gearbox"].Emote}  ${parts.Parts["t3gearbox"].Name} : $${numberWithCommas(parts.Parts["t3gearbox"].Price)}\n
            
            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/NFxgY5N/gearboxdefault.png")
            interaction.editReply({embeds: [embed2], components: [row]})
            
                  }
    
        
          else  if (value === 'fifth_option') {
    
    
            let embed2
            embed2 = new MessageEmbed()
    
            .setTitle('ECUs & Clutches')
            .setFooter('Tip: Purchase a part with "/buy [part]"')
            .setDescription(`**
            Page 1\n
                 ${parts.Parts["t1clutch"].Emote}  ${parts.Parts["t1clutch"].Name} : $${numberWithCommas(parts.Parts["t1clutch"].Price)}\n
                 ${parts.Parts["t2clutch"].Emote}  ${parts.Parts["t2clutch"].Name} : $${numberWithCommas(parts.Parts["t2clutch"].Price)}\n
                 ${parts.Parts["t3clutch"].Emote}  ${parts.Parts["t3clutch"].Name} : $${numberWithCommas(parts.Parts["t3clutch"].Price)}\n
                 ${parts.Parts["t1ecu"].Emote}  ${parts.Parts["t1ecu"].Name} : $${numberWithCommas(parts.Parts["t1ecu"].Price)}\n
                 ${parts.Parts["t2ecu"].Emote}  ${parts.Parts["t2ecu"].Name} : $${numberWithCommas(parts.Parts["t2ecu"].Price)}\n
                 ${parts.Parts["t3ecu"].Emote}  ${parts.Parts["t3ecu"].Name} : $${numberWithCommas(parts.Parts["t3ecu"].Price)}\n
                 ${parts.Parts["t1nitro"].Emote}  ${parts.Parts["t1nitro"].Name} : $${numberWithCommas(parts.Parts["t1nitro"].Price)} **1 USE**\n
                 ${parts.Parts["t1rangeboost"].Emote}  ${parts.Parts["t1rangeboost"].Name} : $${numberWithCommas(parts.Parts["t1rangeboost"].Price)}\n
                 ${parts.Parts["t2rangeboost"].Emote}  ${parts.Parts["t2rangeboost"].Name} : $${numberWithCommas(parts.Parts["t2rangeboost"].Price)}\n
                 ${parts.Parts["t3rangeboost"].Emote}  ${parts.Parts["t3rangeboost"].Name} : $${numberWithCommas(parts.Parts["t3rangeboost"].Price)}\n

            **`)
            .setColor("#60b0f4")
            .setThumbnail("https://i.ibb.co/ctkwJ64/clutch1.png")
            interaction.editReply({embeds: [embed2], components: [row]})
    
          }

          
        })
      } catch(err) {
        return msg.reply(`Error: ${err}`)
      }
    
    })
    
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    }
    
  }