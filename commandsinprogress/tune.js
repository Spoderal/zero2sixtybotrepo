const {
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const colors = require("../common/colors");
  const User = require("../schema/profile-schema")
  const partdb = require("../data/partsdb.json").Parts
  const emotes = require("../common/emotes").emotes

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("tune")
      .setDescription("Tune a car!")
      .addStringOption((option) => option
      .setName("car")
      .setRequired(true)
      .setDescription("The car to tune")
      ),
    async execute(interaction) {

        let cartofind = interaction.options.getString("car")
        let userdata = await User.findOne({id: interaction.user.id}) 

        let selected = userdata.cars.filter((car) => car.ID.toLowerCase() == cartofind.toLowerCase())

        selected = selected[0]
        let tunes = []
        let rowturbo = new ActionRowBuilder()
        let rowsuspension = new ActionRowBuilder()
        let rowecu = new ActionRowBuilder()
        let rows = []

        if(selected.Turbo){
            rowturbo.addComponents(
                new ButtonBuilder()
                .setEmoji("➕")
                .setCustomId("plusturbo")
                .setStyle("Success")
                .setLabel("1 PSI"),
                new ButtonBuilder()
                .setEmoji("➖")
                .setCustomId("minusturbo")
                .setLabel("1 PSI")
                .setStyle("Danger")
            )
            rows.push(rowturbo)
                let psi = selected.PSI || partdb[selected.Turbo.toLowerCase()].PSI
                tunes.push(`${partdb[selected.Turbo.toLowerCase()].Emote} PSI: ${psi}`)

            
        }
        
        if(selected.Suspension){
            if(partdb[selected.Suspension.toLowerCase()].Tier >= 3){
                rowsuspension.addComponents(
                    new ButtonBuilder()
                    .setEmoji("➕")
                    .setCustomId("plusheight")
                    .setStyle("Success")
                    .setLabel("1 Ride Height"),
                    new ButtonBuilder()
                    .setEmoji("➖")
                    .setCustomId("minusheight")
                    .setLabel("1 Ride Height")
                    .setStyle("Danger")
                )
                rows.push(rowsuspension)
                let rideheight = selected.Height || partdb[selected.Suspension.toLowerCase()].Height
                tunes.push(`${partdb[selected.Suspension.toLowerCase()].Emote} Ride Height: ${rideheight} in`)

            }
        }

        if(selected.ECU){
            if(partdb[selected.ECU.toLowerCase()].Tier >= 3){
                rowecu.addComponents(
                    new ButtonBuilder()
                    .setEmoji("➕")
                    .setCustomId("plusrev")
                    .setStyle("Success")
                    .setLabel("100 Rev Limit"),
                    new ButtonBuilder()
                    .setEmoji("➖")
                    .setCustomId("minusrev")
                    .setLabel("100 Rev Limit")
                    .setStyle("Danger")
                )
                rows.push(rowecu)
                let revlimit = selected.revlimit || partdb[selected.ECU.toLowerCase()].RevLimit
                tunes.push(`${partdb[selected.ECU.toLowerCase()].Emote} Rev Limit: ${revlimit}`)

            }
        }
        

        let embed = new EmbedBuilder()
        .setTitle(`Tune`)
        .setDescription(`${emotes.speed} Power: ${selected.Speed}\n${tunes.join('\n')}`)
        .setColor(colors.blue)

       let msg = await interaction.reply({embeds: [embed], components: rows})

        let filter = (btnInt) => {
            return interaction.user.id === btnInt.user.id;
          };
          let collector = msg.createMessageComponentCollector({
            filter: filter,
            time: 60000,
          });

          
          collector.on('collect', async (i) => {
            if(i.customId == "plusturbo"){
                let psi = selected.PSI || partdb[selected.Turbo.toLowerCase()].PSI
                let revlimit = selected.RevLimit || 2000

                if((psi * 100) > revlimit) {
                    selected.Speed -= Math.floor(psi / 5)
                }
                else if((psi * 100) < revlimit) {
                    selected.Speed += Math.floor(psi / 5)
                }
                if((selected.PSI += 1) > partdb[selected.Turbo.toLowerCase()].MaxPSI){
                   return await i.update("Max PSI!")
                }
                selected.PSI = psi += 1

                

                await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "cars.$[car]": selected,
                      },
                    },
              
                    {
                      arrayFilters: [
                        {
                          "car.Name": selected.Name,
                        },
                      ],
                    }
                  );
                  userdata.save()
                  selected = userdata.cars.filter((car) => car.ID.toLowerCase() == cartofind.toLowerCase())
                  selected = selected[0]
                  console.log(selected)
                  psi = selected.PSI || partdb[selected.Turbo.toLowerCase()].PSI
                  tunes = [`${partdb[selected.Turbo.toLowerCase()].Emote} PSI: ${psi}`]
             embed = new EmbedBuilder()
        .setTitle(`Tune`)
        .setDescription(`${emotes.speed} Power: ${selected.Speed}\n${tunes.join('\n')}`)
        .setColor(colors.blue)
            }
            else if(i.customId == "minusturbo"){
                let psi = selected.PSI || partdb[selected.Turbo.toLowerCase()].PSI
                let revlimit = selected.RevLimit || 2000

                if((psi * 100) < revlimit) {
                    selected.Speed -= Math.floor(psi / 5)
                }
                else if((psi * 100) > revlimit) {
                    selected.Speed += Math.floor(psi / 5)
                }
                selected.PSI = psi -= 1


                await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "cars.$[car]": selected,
                      },
                    },
              
                    {
                      arrayFilters: [
                        {
                          "car.Name": selected.Name,
                        },
                      ],
                    }
                  );
                  userdata.save()
                  selected = userdata.cars.filter((car) => car.ID.toLowerCase() == cartofind.toLowerCase())
                  selected = selected[0]
                  console.log(selected)
                  psi = selected.PSI || partdb[selected.Turbo.toLowerCase()].PSI
                  tunes = [`${partdb[selected.Turbo.toLowerCase()].Emote} PSI: ${psi}`]
             embed = new EmbedBuilder()
        .setTitle(`Tune`)
        .setDescription(`${emotes.speed} Power: ${selected.Speed}\n${tunes.join('\n')}`)
        .setColor(colors.blue)
            }
            else if(i.customId == "plusrev"){
                let speed = selected.Speed
                let revlimit = selected.RevLimit || 2000

                if((speed * 10) < revlimit) {
                    selected.Speed -= 5
                }
                
                selected.RevLimit += 100


                await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "cars.$[car]": selected,
                      },
                    },
              
                    {
                      arrayFilters: [
                        {
                          "car.Name": selected.Name,
                        },
                      ],
                    }
                  );
                  userdata.save()
                  selected = userdata.cars.filter((car) => car.ID.toLowerCase() == cartofind.toLowerCase())
                  selected = selected[0]
                  console.log(selected)
                  revlimit = selected.RevLimit
                  tunes = [`${partdb[selected.ECU.toLowerCase()].Emote} Rev Limit: ${revlimit}`]
             embed = new EmbedBuilder()
        .setTitle(`Tune`)
        .setDescription(`${emotes.speed} Power: ${selected.Speed}\n${tunes.join('\n')}`)
        .setColor(colors.blue)
            }
            else if(i.customId == "minusrev"){
                let speed = selected.Speed
                let revlimit = selected.RevLimit || 2000
                let psi = selected.PSI || 17

                if((speed * 10) < revlimit) {
                    selected.Speed += 5
                }

                if((psi * 100) > revlimit){
                    return await i.update(`Your PSI is too high! Lower it first`)
                }
                
                selected.RevLimit -= 100


                await User.findOneAndUpdate(
                    {
                      id: interaction.user.id,
                    },
                    {
                      $set: {
                        "cars.$[car]": selected,
                      },
                    },
              
                    {
                      arrayFilters: [
                        {
                          "car.Name": selected.Name,
                        },
                      ],
                    }
                  );
                  userdata.save()
                  selected = userdata.cars.filter((car) => car.ID.toLowerCase() == cartofind.toLowerCase())
                  selected = selected[0]
                  console.log(selected)
                  revlimit = selected.RevLimit
                  tunes = [`${partdb[selected.ECU.toLowerCase()].Emote} Rev Limit: ${revlimit}`]
             embed = new EmbedBuilder()
        .setTitle(`Tune`)
        .setDescription(`${emotes.speed} Power: ${selected.Speed}\n${tunes.join('\n')}`)
        .setColor(colors.blue)
            }

            await i.update({embeds: [embed]})
          })
      

    },
  };
  