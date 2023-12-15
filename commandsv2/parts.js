

const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, numberWithCommas } = require("../common/utils");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const partdb = require("../data/partsdb.json").Parts
module.exports = {
  data: new SlashCommandBuilder()
    .setName("parts")
    .setDescription("The parts store"),
  async execute(interaction) {
    let userdata = (await User.findOne({ id: interaction.user.id })) || (await new User({ id: interaction.user.id }));
    let usercars = userdata.cars || [];
    

    let cardb = require("../data/cardb.json").Cars
    let partarray = []

    for(let part in partdb){
        partarray.push(partdb[part])
    }

    let featured = partarray.filter((part) => part.Price > 0)

    let featurepart = lodash.sample(featured)


    let row = new ActionRowBuilder()
    .setComponents(
      new StringSelectMenuBuilder()
      .setCustomId("part")
      .setPlaceholder("Part")
      .addOptions(
        new StringSelectMenuOptionBuilder()
					.setLabel('Exhausts')
					.setDescription('View the list of exhausts')
          .setEmoji(`${partdb.t1exhaust.Emote}`)
					.setValue('exhaust'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Turbos')
					.setDescription('View the list of turbos')
          .setEmoji(`${partdb.turbo.Emote}`)
					.setValue('turbo'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Engines')
					.setDescription('View the list of engines')
					.setValue('engine'),
      
          new StringSelectMenuOptionBuilder()
					.setLabel('Intakes')
					.setDescription('View the list of intakes')
          .setEmoji(`${partdb.t1intake.Emote}`)
					.setValue('intake'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Tires')
					.setDescription('View the list of tires')
          .setEmoji(`${partdb.t1tires.Emote}`)
					.setValue('tires'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Clutch')
					.setDescription('View the list of clutches')
          .setEmoji(`${partdb.t1clutch.Emote}`)
					.setValue('clutch'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Suspension')
					.setDescription('View the list of suspensions')
          .setEmoji(`${partdb.t1suspension.Emote}`)
					.setValue('suspension'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Brakes')
					.setDescription('View the list of brakes')
          .setEmoji(`${partdb.t1brakes.Emote}`)
					.setValue('brakes'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Gearbox')
					.setDescription('View the list of gearboxes')
          .setEmoji(`${partdb.t1gearbox.Emote}`)
					.setValue('gearbox'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Drivetrain')
					.setDescription('View the list of drivetrains')
          .setEmoji(`${partdb.awd.Emote}`)
					.setValue('drivetrain'),
          new StringSelectMenuOptionBuilder()
					.setLabel('ECU')
					.setDescription('View the list of ecu')
          .setEmoji(`${partdb.t1ecu.Emote}`)
					.setValue('ecu'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Body')
					.setDescription('View the list of bodykits')
          .setEmoji(`${partdb.t1bodykit.Emote}`)
					.setValue('bodykit'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Weight')
					.setDescription('View the list of weight')
          .setEmoji(`${partdb.t1weight.Emote}`)
					.setValue('weight'),
          new StringSelectMenuOptionBuilder()
					.setLabel('Spoilers')
					.setDescription('View the list of spoilers')
          .setEmoji(`${partdb.t1spoiler.Emote}`)
					.setValue('spoiler'),
     
      )
    )



    let embed = new EmbedBuilder()
    .setTitle("Parts Store")
    .setThumbnail(`${featurepart.Image}`)
    .setColor(colors.blue)

   let msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})


    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    const collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on('collect', async (i) => {
        let partf = i.values[0]

        let partsfilter = partarray.filter((part) => part.Type == partf && part.Price > 0)

        let embed = new EmbedBuilder()
        .setTitle(`Store for ${partf}`)
        .setColor(colors.blue)
        for(let p in partsfilter){
            let par = partsfilter[p]
            console.log(partsfilter)
            let stats = []
            if(par.Power > 0){
              stats.push(`${emotes.speed} Speed: +${par.Power}`)
            }
            if(par.RemovePower > 0){
              stats.push(`${emotes.speed} Speed: -${par.RemovePower}`)
            }
            if(par.Acceleration > 0){
              stats.push(`${emotes.acceleration} Acceleration: -${par.Acceleration}`)
            }
            if(par.RemoveAcceleration > 0){
              stats.push(`${emotes.acceleration} Acceleration: +${par.RemoveAcceleration}`)
            }
            if(par.Handling > 0){
              stats.push(`${emotes.handling} Handling: +${par.Handling}`)
            }
            if(par.RemoveHandling > 0){
              stats.push(`${emotes.handling} Handling: -${par.RemoveHandling}`)
            }
            if(par.RemoveWeight > 0){
              stats.push(`${emotes.weight} Weight: -${par.RemoveWeight}`)
            }
            if(par.Weight > 0){
              stats.push(`${emotes.weight} Weight: +${par.Weight}`)
            }
            if(par.Stars > 0){
              stats.push(`⭐ Rating: +${par.Stars}`)
            }
            embed.addFields(
                {name: `${par.Emote} ${par.Name}`, value: `${emotes.cash} Cost: ${toCurrency(par.Price)}\n${stats.join("\n")}`, inline: true}
            )
        }
        
        await msg.edit({embeds: [embed]})

    })

  },
};
