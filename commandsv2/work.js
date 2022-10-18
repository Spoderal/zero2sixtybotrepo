const Discord = require("discord.js");
const carsdb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");

const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const {ActionRowBuilder, ButtonBuilder} = require("discord.js");

const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("job")
    .setDescription("Manage your job, work, etc")
    .addSubcommand((cmd) => cmd
    .setName("work")
    .setDescription("Work at your job")
    
    )
    .addSubcommand((cmd) => cmd
    .setName("hire")
    .setDescription("Hire yourself for a job")
    .addStringOption((option) => option
    .setName("job")
    .setDescription("The job to hire yourself for")
    .setRequired(true)
    .addChoices(
        {name: "Zuber", value: "zuber"},
        {name: "Pizza Delivery", value: "pizza delivery"},
        {name: "Police", value: "police"},
    )
    )
    
    ),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: uid });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let subcommand = interaction.options.getSubcommand();
    if(subcommand == "hire"){
           if(userdata.work) return interaction.reply("You already have a job!")
           let job = interaction.options.getString("job")
           let jobtoset = {
               name: `${job}`,
               rank: 1,
               rating: 0,
   
           }
           userdata.work = jobtoset
           userdata.save()
           console.log(jobtoset)
           interaction.reply(`Hired for ${job}`)
       }

 else if(subcommand == "work"){
    if(!userdata.work) return interaction.reply("You don't have a job.")

    let jobtowork = userdata.work

    if(jobtowork.name == "zuber"){
        let locations = [{name: "Zero City", miles: 50},{name: "Zero Shores", miles: 30}, {name: "Zero Plaza", miles: 20}, {name: "Speed Street", miles: 10}]
        let people = [{name: "Spoder", rating: 10, pay: 2000},{name: "Barry", rating: 0, pay: 200}, {name: "Josh", rating: 0, pay: 200}, {name: "Kayla", rating: 5, pay: 500}, {name: "Fred", rating: 7, pay: 700}]

        let filteredpeople = people.filter((person) => person.rating <= jobtowork.rating)
        let person = lodash.sample(filteredpeople)
        let location = lodash.sample(locations)
        let row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("yes")
          .setStyle("Secondary")
          .setEmoji("✔️"),
          new ButtonBuilder()
          .setCustomId("no")
          .setStyle("Secondary")
          .setEmoji("✖️")
        )
        let embed = new Discord.EmbedBuilder()
        .setTitle(`Working for Zuber...`)
        .setDescription(`${person.name} is asking to be dropped off at ${location.name}, do you want to take this job?`)
        .addFields({name: "Miles", value: `${location.miles}`})
        .setColor(colors.blue)
       let msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})

        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
        let collector = msg.createMessageComponentCollector({
          filter: filter2,
        });
        
        collector.on("collect", async (i) => {
          if(i.customId == "yes"){
           let msg2 =  await i.update({content:`Please send the car id you wish to use to transport ${person.name}`, fetchReply: true})
            let filter = (m = Discord.Message) => {
              return m.author.id === interaction.user.id;
            };
            let collector = interaction.channel.createMessageCollector({
              filter,
              time: 1000 * 30,
            });
            collector.on('collect', async(msg) => {
              let idtoselect = msg.content.toLowerCase()

              let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
              let selected = filteredcar[0] || "No ID";
              if (selected == "No ID") {
                let errembed = new Discord.EmbedBuilder()
                  .setTitle("Error!")
                  .setColor(colors.discordTheme.red)
                  .setDescription(
                    `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
                  );
                return await interaction.reply({ embeds: [errembed] });
              }

              let comfort = selected.Comfort || 0

            

              let time = location.miles * 1000

              let speed = selected.Speed
              let z2s = selected.Acceleration
              let finalz
              if(z2s >= 10){
                finalz = 1
              }
              else if(z2s <= 8){
                finalz = 2
              }
              else if(z2s <= 5){
                finalz = 4
              }
              else if(z2s <= 2){
                finalz = 6
              }

              let score = (speed * finalz) / 100
              console.log(score)

              let miles = 0
              
              let x = setInterval(async () => {
                miles += score
                time -= 1000
                console.log(miles)
                console.log(time)

                if(time <= 0){
                  if(miles >= location.miles) {
                    let extratime = miles -= location.miles
                    let finalsc = extratime += comfort
                   let rating 

                   if(finalsc >= 100){
                    rating = 10
                   }
                   else if(finalsc > 90){
                    rating = 9
                   }
                   else if(finalsc > 80){
                    rating = 8
                   }
                   else if(finalsc > 70){
                    rating = 7
                   }
                   else if(finalsc > 60){
                    rating = 6
                   }
                   else if(finalsc > 50){
                    rating = 5
                   }
                   else if(finalsc > 40){
                    rating = 4
                   }
                   else if(finalsc > 30){
                    rating = 3
                   }
                   else if(finalsc > 20){
                    rating = 2
                   }
                   else {
                    rating = 1
                   }

                    console.log(`score: ${finalsc}`)
                    await msg2.edit(`Success! you got a rating of ${Math.floor(rating)}/10`)
                    clearInterval(x)

                  }
                  else {
                    
                    await msg2.edit("Failed!")
                    clearInterval(x)
                  }
                }
              
              }, 1000);

              
            })
          }

        })

    }


    }

  },
};
