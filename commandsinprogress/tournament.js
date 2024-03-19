

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
} = require("discord.js");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const emotes = require("../common/emotes").emotes;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tournament")
    .setDescription("For server use")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("race")
        .setDescription("Race against other users")
        .addUserOption((option) =>
          option
            .setName("user1")
            .setDescription("The user you want to race with")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user2")
            .setDescription("The car id you want to race with")
            .setRequired(true)
        )
        .addStringOption((option) =>
        option
          .setName("car")
          .setDescription("The car id you want to race with")
          .setRequired(true)
      )
      .addStringOption((option) =>
      option
        .setName("car2")
        .setDescription("The car id you want to race with")
        .setRequired(true)
    )
    )
   ,
  async execute(interaction) {
    const dorace = function(speed, acceleration, handling, weight) {
      // Define the importance of each factor
      var speedImportance = 0.40;
      var accelerationImportance = 0.30;
      var handlingImportance = 0.25;
      var weightImportance = 0.05;
  

  
      var normalizedSpeed = speed
      var normalizedAcceleration = acceleration  // Lower acceleration is better
      var normalizedHandling = handling 
      var normalizedWeight = weight / 100  // Lower weight is better
  
      // Calculate the final score
      var score = (speedImportance * normalizedSpeed +
                   accelerationImportance * normalizedAcceleration +
                   handlingImportance * normalizedHandling -
                   weightImportance - normalizedWeight);
  
      return score;
  }
    const discord = require("discord.js");
    const cars = require("../data/cardb.json");
    let subcommand = interaction.options.getSubcommand();
    
    if (subcommand == "race") {
    await interaction.deferReply({ ephemeral: false });
      let user = interaction.options.getUser("user1");
      let user2 = interaction.options.getUser("user2");
      let car = interaction.options.getString("car");
        let car2 = interaction.options.getString("car2");

        
        let userdata = await User.findOne({ id: user.id });
      let userdata2 = await User.findOne({ id: user2.id });

      let idtoselect = car;
      if (user2.id == interaction.user.id)
        return interaction.reply("You cant race yourself!");
      let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
      let selected = filteredcar[0] || "No ID";
      if (selected == "No ID") {
        let errembed = new discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red)
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return await interaction.reply({ embeds: [errembed] });
      }


      //  if(rrank !== rrank2 && user1num !== rrank2 && user2num !== rrank) return interaction.reply(`You need to be at least the same rank, or 1 rank above the other user to race them!`)

      let carindb1 = cars.Cars[selected.Name.toLowerCase()];

    

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let carimage1 =
        selected.Image || cars.Cars[selected.Name.toLowerCase()].Image;


      let embed = new EmbedBuilder()
        .setTitle(`${user2.username}, what would you like to race ${user.username} in?`)
        .setDescription(`**Type the Cars ID**`)
        .addFields([
          {
            name: `${user.username}'s ${carindb1.Emote} ${carindb1.Name}`,
            value: `${emotes.speed} Power: ${speed}\n\n${emotes.acceleration} 0-60: ${acceleration}s\n\n${emotes.handling} Handling: ${handling}\n\n${emotes.weight} Weight: ${weight}`,
          },
        ])
        .setImage(carimage1)
        .setColor(`#60b0f4`);



  


 await interaction.editReply({
        embeds: [embed],
        fetchReply: true,
      });



          console.log(car2)
          let filteredcar2 = userdata2.cars.filter((car) => car.ID == car2)
          let selected2 = filteredcar2[0] || "No ID";
  
          console.log(selected2)
          let carindb2 = cars.Cars[selected2.Name.toLowerCase()];
          let weight2 = selected2.WeightStat;
          let speed2 = selected2.Speed;
          let acceleration2 = selected2.Acceleration;
          let handling2 = selected2.Handling;

          let carimage2 = selected2.Image || selected2.Livery || carindb2.Image;

          let user1car = dorace(speed, acceleration, handling, weight);
          let user2car = dorace(speed2, acceleration2, handling2, weight2);


           embed = new discord.EmbedBuilder()
          .setTitle(`Racing`)
          .setThumbnail(`${carimage2}`)
          .setImage(`${carimage1}`)
          .addFields(
            {
              name: `${user.username}'s ${
                selected.Emote
              } ${selected.Name}`,
              value: `💪🏼 HP: ${selected.Speed}\n🐎 Acceleration: ${selected.Acceleration}s\n🛞 Handling: ${selected.Handling}\n🏋🏼 Weight: ${selected.WeightStat}`,
              inline: true,
            },
            {
              name:`${user2.username}'s ${selected2.Emote} ${selected2.Name}`,
              value: `💪🏼 HP: ${speed2}\n🐎 Acceleration: ${selected2.Acceleration}s\n🛞 Handling: ${handling2}\n🏋🏼Weight: ${selected2.WeightStat}`,
              inline: true,
            }
          )
          .setColor(`#60b0f4`);

          await interaction.editReply({embeds: [embed], components: [], fetchReply: true})

          setTimeout(async () => {

            if(user1car > user2car){

              embed.setTitle(`${user.username} Won!`)
         
            }
            else if(user2car > user1car) {
          
              embed.setTitle(`${user2.username} Won!`)

            }
            else if(user2car == user1car){
              embed.setTitle(`It was a tie!`)
            }

            await interaction.editReply({embeds: [embed]})
            
          }, 5000);


    } 
  },
};


