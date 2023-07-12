const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const { capitalize } = require("lodash");
const colors = require("../common/colors");
const emotes = require("../common/emotes").emotes;
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json").Cars;
const parttiersdb = require("../data/parttiers.json");
const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a part from your car")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Your car ID")
        .setRequired(true)
    ),

  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let usercars = userdata.cars || []

    let selected = usercars.filter((car) => car.Name.toLowerCase() == inputCarIdOrName.toLowerCase() || car.ID == inputCarIdOrName)

    if(selected.length == 0) return interaction.reply("Thats not a car! Make sure to specify a car ID, or car name")
    let carimage = selected[0].Image || cardb[selected[0].Name.toLowerCase()].Image
    let carindb = cardb[selected[0].Name.toLowerCase()]
    let carprice = carindb.Price
    if(carindb.Price == 0){
      carprice = 1000
    }

    let exhausttier = selected[0].exhaust || 1
    let turbotier = selected[0].turbo || 1
    let tiretier = selected[0].tires || 1
    let suspensiontier = selected[0].suspension || 1
    let enginetier = selected[0].engine || 1
    let clutchtier = selected[0].clutch || 1
    let intercoolertier = selected[0].intercooler || 1
    let braketier = selected[0].brakes || 1
    let intaketier = selected[0].intake || 1
    let ecutier = selected[0].ecu || 1
    let gearboxtier = selected[0].gearbox || 1

    

    


    let exhaustpower = Math.round(parttiersdb[`exhaust${exhausttier}`].Power * selected[0].Speed)
    let turbopower = Math.round(parttiersdb[`turbo${turbotier}`].Power * selected[0].Speed)
    let tirepower = Math.round(parttiersdb[`tires${tiretier}`].Handling * selected[0].Handling)
    let suspensionpower = Math.round(parttiersdb[`suspension${suspensiontier}`].Handling * selected[0].Handling)
    let enginepower = Math.round(parttiersdb[`engine${enginetier}`].Power * selected[0].Speed)
    let clutchpower = Math.round(parttiersdb[`clutch${clutchtier}`].Power * selected[0].Speed)
    let intercoolerpower = Math.round(parttiersdb[`intercooler${intercoolertier}`].Power * selected[0].Speed)
    let intakepower = Math.round(parttiersdb[`intake${intaketier}`].Power * selected[0].Speed)
    let ecupower = Math.round(parttiersdb[`ecu${ecutier}`].Power * selected[0].Speed)
    let gearboxpower = Math.round(parttiersdb[`gearbox${gearboxtier}`].Handling * selected[0].Handling)

    let exhaustemote = partdb.Parts[`t${exhausttier}exhaust`].Emote
    let turboemote = partdb.Parts[`turbo`].Emote
    let tireemote = partdb.Parts[`t${tiretier}tires`].Emote
    let suspensionemote = partdb.Parts[`loan suspension`].Emote
    let engineemote = partdb.Parts[`no engine`].Emote
    let clutchemote = partdb.Parts[`t${clutchtier}clutch`].Emote
    let intercooleremote = partdb.Parts[`t${intercoolertier}intercooler`].Emote
    let intakeemote = partdb.Parts[`t${intaketier}intake`].Emote
    let ecuemote = partdb.Parts[`t${ecutier}ecu`].Emote
    let gearboxemote = partdb.Parts[`t${gearboxtier}gearbox`].Emote

    let embed = new EmbedBuilder()
    .setTitle(`Remove parts from your ${selected[0].Name}`)
    .addFields(
      {
        name:`${exhaustemote} Exhaust`,
        value: `Tier: ${exhausttier}\nPower: ${exhaustpower}\nAcceleration: ${parttiersdb[`exhaust${exhausttier}`].Acceleration}`,
        inline: true
      },
      {
        name:`${tireemote} Tires`,
        value: `Tier: ${tiretier}\nHandling: ${tirepower}`,
        inline: true
      },
      {
        name:`${suspensionemote} Suspension`,
        value: `Tier: ${suspensiontier}\nHandling: ${suspensionpower}`,
        inline: true
      },
      {
        name:`${turboemote} Turbo`,
        value: `Tier: ${turbotier}\nPower: ${turbopower}\nAcceleration: ${parttiersdb[`turbo${turbotier}`].Acceleration}`,
        inline: true
      },
      {
        name:`${intakeemote} Intake`,
        value: `Tier: ${intaketier}\nPower: ${intakepower}\nAcceleration: ${parttiersdb[`intake${intaketier}`].Acceleration}`,
        inline: true
      },
      {
        name:`${engineemote} Engine`,
        value: `Tier: ${enginetier}\nPower: ${enginepower}`,
        inline: true
      }
      ,
      {
        name:`${intercooleremote} Intercooler`,
        value: `Tier: ${intercoolertier}\nPower: ${intercoolerpower}\nAcceleration: ${parttiersdb[`intercooler${intercoolertier}`].Acceleration}`,
        inline: true
      }
      ,
      {
        name:`${ecuemote} ECU`,
        value: `Tier: ${ecutier}\nPower: ${ecupower}`,
        inline: true
      },
      {
        name:`${clutchemote} Clutch`,
        value: `Tier: ${clutchtier}\nPower: ${clutchpower}`,
        inline: true
      },
      {
        name:`${gearboxemote} Gearbox`,
        value: `Tier: ${gearboxtier}\nHandling: ${gearboxpower}`,
        inline: true
      }
    )
    .setColor(colors.blue)
    .setThumbnail(carimage)
    .setDescription(`You will need to upgrade your tier 1 twice to get to the next tier.`)



    let row = new ActionRowBuilder()
    .setComponents(
      new ButtonBuilder()
      .setCustomId("exhaust")
      .setLabel("Remove Exhaust")
      .setEmoji(exhaustemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("tires")
      .setLabel("Remove Tires")
      .setEmoji(tireemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("suspension")
      .setLabel("Remove Suspension")
      .setEmoji(suspensionemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("turbo")
      .setLabel("Remove Turbo")
      .setEmoji(turboemote)
      .setStyle("Success")
    )
    let row2 = new ActionRowBuilder()
    .setComponents(
      new ButtonBuilder()
      .setCustomId("intake")
      .setLabel("Remove Intake")
      .setEmoji(intakeemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("engine")
      .setLabel("Remove Engine")
      .setEmoji(engineemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("intercooler")
      .setLabel("Remove Intercooler")
      .setEmoji(intercooleremote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("ecu")
      .setLabel("Remove ECU")
      .setEmoji(ecuemote)
      .setStyle("Success")
    )
    let row3 = new ActionRowBuilder()
    .setComponents(
      new ButtonBuilder()
      .setCustomId("clutch")
      .setLabel("Remove Clutch")
      .setEmoji(clutchemote)
      .setStyle("Success"),
      new ButtonBuilder()
      .setCustomId("gearbox")
      .setLabel("Remove Gearbox")
      .setEmoji(gearboxemote)
      .setStyle("Success")
    )
    for(let butt in row.components){
      let button = row.components[butt]
      let tier = selected[0][button.data.custom_id] || 1
      let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
      if(tier <= 1) {
        button.setDisabled(true)
      }
      
    }

    for(let butt in row2.components){
      let button = row2.components[butt]
      let tier = selected[0][button.data.custom_id] || 1
      let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
      console.log(tier)
      if(tier <= 1) {
        button.setDisabled(true)
      }
 
      
    }

    for(let butt in row3.components){
      let button = row3.components[butt]
    
      let tier = selected[0][button.data.custom_id.toLowerCase()] || 1

      let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
      if(tier <= 1) {
        button.setDisabled(true)
      }

   

      
    }
    

    let msg = await interaction.reply({embeds: [embed], components: [row, row2, row3], fetchReply: true})

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector.on('collect', async (i) => {
      
      console.log(selected[0])
      let tier = selected[0][i.customId] || 0
      let newtier = tier 
      let price = Math.round(carprice * parttiersdb[`${i.customId}${newtier}`].Cost) * newtier
      let power = Math.round(selected[0].Speed * parttiersdb[`${i.customId}${newtier}`].Power)
      let acceleration = parttiersdb[`${i.customId}${newtier}`].Acceleration
      console.log(parttiersdb[`${i.customId}${newtier}`])
      let handling = Math.floor(selected[0].Handling * parttiersdb[`${i.customId}${newtier}`].Handling)
      let useracc = selected[0].Acceleration
      let newacc = useracc -= acceleration
      console.log(power)
      if(parttiersdb[`${i.customId}${newtier}`].Power){
        selected[0].Speed -= power
      }
      if(parttiersdb[`${i.customId}${newtier}`].Handling){
        selected[0].Handling -= handling
      }
      if(parttiersdb[`${i.customId}${newtier}`].Acceleration && newacc >= 2){
        selected[0].Acceleration += acceleration
      }

      selected[0][i.customId] -= 1
      
      console.log(selected[0])

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": selected[0],
          },
        },
  
        {
          arrayFilters: [
            {
              "car.Name": selected[0].Name,
            },
          ],
        }
      )


      userdata.save()

      for(let butt in row.components){
        let button = row.components[butt]
        let tier = selected[0][button.data.custom_id] || 1
        let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
        if(tier <= 1) {
          button.setDisabled(true)
        }
        
      }
  
      for(let butt in row2.components){
        let button = row2.components[butt]
        let tier = selected[0][button.data.custom_id] || 1
        let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
        console.log(tier)
        if(tier <= 1) {
          button.setDisabled(true)
        }
       
        
      }
  
      for(let butt in row3.components){
        let button = row3.components[butt]
      
        let tier = selected[0][button.data.custom_id.toLowerCase()] || 1
  
        let price = carprice * parttiersdb[`${button.data.custom_id}${tier}`].Cost
        if(tier <= 1) {
          button.setDisabled(true)
        }
  
        
      }

      await i.update({content: `✅`, components: [row, row2, row3]})
      
    })
  },
};
