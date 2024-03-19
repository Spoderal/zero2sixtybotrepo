

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
} = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const emotes = require("../common/emotes").emotes;
const pvpranks = require("../data/ranks.json");
const outfits = require("../data/characters.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pvp")
    .setDescription("PVP race another user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("race")
        .setDescription("Race against other users")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user you want to race with")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car id you want to race with")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("rank").setDescription("View your PVP rank")
      .addUserOption((option) => option
      .setName("user")
      .setDescription("The user you want to view the rank of")
      .setRequired(false)
      )
    )
    .addSubcommand((subcommand) =>
    subcommand.setName("shop").setDescription("View the PVP shop")
  ),
  async execute(interaction) {
    const dorace = function(speed, acceleration, handling, weight) {
      // Define the importance of each factor
      var speedImportance = 0.30;
      var accelerationImportance = 0.25;
      var handlingImportance = 0.20;
      var weightImportance = 0.25;
  

  
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
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });

    if (subcommand == "race") {
      let user2 = interaction.options.getUser("target");
      let car = interaction.options.getString("car");
      if (!user2) return await interaction.reply("Specify a user to race!");

      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

      let userdata2 = await User.findOne({ id: user2.id });
      let cooldowndata =
        (await Cooldowns.findOne({ id: user.id })) ||
        new Cooldowns({ id: user.id });
      let timeout = 600000;
      if (
        cooldowndata.pvp !== null &&
        timeout - (Date.now() - cooldowndata.pvp) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata.pvp));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can pvp again in ${time}`);
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
      let cooldowndata2 =
        (await Cooldowns.findOne({ id: user2.id })) ||
        new Cooldowns({ id: user2.id });
      if (
        cooldowndata2.pvp !== null &&
        timeout - (Date.now() - cooldowndata2.pvp) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata2.pvp));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`${user2.username} can pvp again in ${time}`);
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
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
   
    

      let userpvprank = userdata.pvprank || {
        Rank: "Silver",
        Wins: 0,
        Losses: 0,
        Rewards: 0,
      };
      let userpvprank2 = userdata2.pvprank || {
        Rank: "Silver",
        Wins: 0,
        Losses: 0,
        Rewards: 0,
      };
      let urankslist = [];

      for (let r in pvpranks) {
        let rankin = pvpranks[r];

        urankslist.push(rankin);
      }

      let userrank = urankslist.filter((r) => r.name == userpvprank.Rank);
      let rrank = userrank[0].rank;

      let userrank2 = urankslist.filter((r) => r.name == userpvprank2.Rank);
      let rrank2 = userrank2[0].rank;
      let user1num = (rrank += 1);
      let user2num = (rrank2 += 1);
      let nextuser1rank = urankslist.filter((r) => r.rank == user1num);
      let nextuser2rank = urankslist.filter((r) => r.rank == user2num);

      //  if(rrank !== rrank2 && user1num !== rrank2 && user2num !== rrank) return interaction.reply(`You need to be at least the same rank, or 1 rank above the other user to race them!`)
      await interaction.reply(`${user2}, ${user} wants to PVP! Are you up for the challenge or are you chicken? Revving engines...`);

      let carindb1 = cars.Cars[selected.Name.toLowerCase()];

    

      let weight = selected.WeightStat;
      let speed = selected.Speed;
      let acceleration = selected.Acceleration;
      let handling = selected.Handling;

      let carimage1 =
        selected.Image || cars.Cars[selected.Name.toLowerCase()].Image;


      let embed = new discord.EmbedBuilder()
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

      let filter = (msg) => {
        return user2.id == msg.author.id;
      };

      const collector = interaction.channel.createMessageCollector({
        filter: filter,
        max: 1,
        time: 30000,
      });



      collector.on("collect", async (msg) => {

        if (msg.content) {
          collector.stop();
          let car2 = msg.content
          console.log(car2)
          let filteredcar2 = userdata2.cars.filter((car) => car.ID == car2)
          let selected2 = filteredcar2[0] || "No ID";
          if(selected2 == "No ID"){
            let errembed = new discord.EmbedBuilder()
            .setTitle("Error!")
            .setColor(colors.discordTheme.red)
            .setDescription(
              `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
            );

            return msg.reply({embeds: [errembed]})
          }
          console.log(selected2)
          let carindb2 = cars.Cars[selected2.Name.toLowerCase()];
          let weight2 = selected2.WeightStat;
          let speed2 = selected2.Speed;
          let acceleration2 = selected2.Acceleration;
          let handling2 = selected2.Handling;

          let carimage2 = selected2.Image || selected2.Livery || carindb2.Image;

          let user1car = dorace(speed, acceleration, handling, weight);
          let user2car = dorace(speed2, acceleration2, handling2, weight2);
          let userpfp = userdata.helmet;
          let userpfp2 = userdata2.helmet;

           embed = new discord.EmbedBuilder()
          .setTitle(`Racing`)
          .setThumbnail(`${carimage2}`)
          .setImage(`${carimage1}`)
          .addFields(
            {
              name: `${outfits.Helmets[userpfp.toLowerCase()].Emote} ${user.username}'s ${
                selected.Emote
              } ${selected.Name}`,
              value: `${emotes.speed} HP: ${selected.Speed}\n${emotes.acceleration} Acceleration: ${selected.Acceleration}s\n${emotes.handling} Handling: ${selected.Handling}\n${emotes.weight} Weight: ${selected.WeightStat}`,
              inline: true,
            },
            {
              name: `${outfits.Helmets[userpfp2.toLowerCase()].Emote} ${user2.username}'s ${selected2.Emote} ${selected2.Name}`,
              value: `${emotes.speed} HP: ${speed2}\n${emotes.acceleration} Acceleration: ${selected2.Acceleration}s\n${emotes.handling} Handling: ${handling2}\n${emotes.weight} Weight: ${selected2.WeightStat}`,
              inline: true,
            }
          )
          .setColor(`#60b0f4`);

          await interaction.editReply({embeds: [embed], components: [], fetchReply: true})

          setTimeout(async () => {

            if(user1car > user2car){
              userdata.pvprank.Wins = userdata.pvprank.Wins += 1;
              userdata2.pvprank.Losses = userdata2.pvprank.Losses += 1;
              let rpwon = 10
              let earnings = []
              earnings.push(`${emotes.pvptokens} 10 PVP Tokens`)
              earnings.push(`${emotes.rp} ${rpwon} RP`)
              earnings.push(`${emotes.cash} $2K Cash`)
              
              embed.setTitle(`${user.username} Won!`)
              .setDescription(`${earnings.join("\n")}`)
              userdata.pvptokens += 10
              userdata.rp += rpwon
              if (
                userdata.pvprank.Wins >= nextuser1rank[0].wins &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
                userdata.pvprank.Rank = `${nextuser1rank[0].name}`;
              }
              if (userdata.pvprank.Losses >= 20) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
              }

              if (
                userdata2.pvprank.Wins >= nextuser2rank[0].wins &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
                userdata2.pvprank.Rank = `${
                  nextuser2rank[0].name && userdata.pvprank.Name !== "Onyx"
                }`;
              }
              if (
                userdata2.pvprank.Losses >= 20 &&
                userdata.pvprank.Name !== "Onyx"
              ) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
              }

              userdata.markModified("pvprank");
              userdata2.markModified("pvprank");

              userdata.save()
              userdata2.save()
            }
            else if(user2car > user1car) {
              userdata2.pvprank.Wins = userdata2.pvprank.Wins += 1;
              userdata.pvprank.Losses = userdata.pvprank.Losses += 1;
              let rpwon = 10
              let earnings = []
              earnings.push(`${emotes.pvptokens} 10 PVP Tokens`)
              earnings.push(`${emotes.rp} ${rpwon} RP`)
              earnings.push(`${emotes.cash} $2K Cash`)
              
              embed.setTitle(`${user2.username} Won!`)
              .setDescription(`${earnings.join("\n")}`)
              userdata2.pvptokens += 10
              userdata2.rp += rpwon
              if (userdata.pvprank.Wins >= nextuser1rank.wins) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
                userdata.pvprank.Rank = `${nextuser1rank.name}`;
              }
              if (userdata.pvprank.Losses >= 20) {
                userdata.pvprank.Wins = 0;
                userdata.pvprank.Losses = 0;
              }

              if (userdata2.pvprank.Wins >= nextuser2rank.wins) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
                userdata2.pvprank.Rank = `${nextuser2rank.name}`;
              }
              if (userdata2.pvprank.Losses >= 20) {
                userdata2.pvprank.Wins = 0;
                userdata2.pvprank.Losses = 0;
              }

              userdata.markModified("pvprank");
              userdata2.markModified("pvprank");
              userdata.save();
              userdata2.save();
            }
            else if(user2car == user1car){
              embed.setTitle(`It was a tie!`)
            }

            await interaction.editReply({embeds: [embed]})
            
          }, 5000);

          
        }
        
       
      });

      collector.on('end', collected => {  
        
        
        if(collected.size == 0){
          interaction.editReply({content: "They didn't respond in time!"})
        }
      })
    } else if (subcommand == "rank") {
      let user = interaction.options.getUser("user") || interaction.user;
      userdata = await User.findOne({ id: user.id });
      let pvprank = userdata.pvprank || { Rank: "Silver", Wins: 0, Losses: 0 };
      let rankslist = [];

      for (let r in pvpranks) {
        let rankin = pvpranks[r];

        rankslist.push(rankin);
      }

      let userrank = rankslist.filter((r) => r.name == pvprank.Rank);
      let rrank = userrank[0].rank;
      let nextnum = (rrank += 1);
      let nextrank = rankslist.filter((r) => r.rank == nextnum);
      nextrank = nextrank[0] || { wins: 0, name: "Onyx" };
      let newwins = nextrank.wins || 0;

      if (userdata.pvprank.Name == "Onyx") {
        newwins = 0;
      }

      console.log(nextrank);

      let embed = new EmbedBuilder()
        .setAuthor({
          name: `${user.username} - PVP Rank`,
          iconURL: `${outfits.Helmets[userdata.helmet.toLowerCase()].Image}`,
        })
        .setDescription(
          `${pvpranks[pvprank.Rank.toLowerCase()].emote} ${
            pvprank.Rank
          }\n\nWins: ${pvprank.Wins}\n\nWins Needed: ${newwins}`
        )
        .setThumbnail(`${pvpranks[pvprank.Rank.toLowerCase()].icon}`)
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
    else if (subcommand == "shop") {
    
      let shop = []

      for(let car in cars.Cars){
        let carin = cars.Cars[car]
        if(carin.Tokens){
          shop.push(carin)

        }
      }
      shop.sort((a, b) => a.Tokens - b.Tokens)

      let dispshop = []

      for(let car of shop){
        dispshop.push(`${car.Emote} ${car.Name} - ${emotes.pvptokens} ${car.Tokens} PVP Tokens`)
      }


      let embed = new EmbedBuilder()
      .setTitle("PVP Shop")
        .setDescription(
          `PVP Crate - ${emotes.pvptokens} 100 PVP Tokens\n
          ${dispshop.join("\n")}
          
          `
        )
        .setThumbnail("https://i.ibb.co/f8C1Xts/pvptokens.png")
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};


