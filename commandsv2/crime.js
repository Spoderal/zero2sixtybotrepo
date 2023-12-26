

const {EmbedBuilder} = require("discord.js");
const ms = require("ms");

const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");
const crimedb = require("../data/crimes.json")
const lodash = require("lodash")
const cardb = require("../data/cardb.json")
const itemdb = require("../data/items.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Commit crimes, but be careful!")
    .addStringOption((option) => option
    .setName("crime")
    .setDescription("The crime to commit")
    .setRequired(true)
    .setChoices(
        {name: "List", value: "list"},
        {name: "Pick Pocket", value: "pickpocket"},
        {name: "Grand Theft Auto", value: "gta"},
        {name: "Robbery", value: "robbery"}
    )
    ),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });
    let job = userdata.work || {name : "N/A"}
   
    if(job.name.toLowerCase() !== "criminal" ) return interaction.reply("You need to have the **criminal** job to commit crimes!")
    let cooldowns = await Cooldowns.findOne({id :uid}) || new Cooldowns({ id: uid });
    let crimecool = cooldowns.crime
    let timeout = 14400000

    if (crimecool !== null && timeout - (Date.now() - crimecool) > 0) {

      let time = ms(timeout - (Date.now() - crimecool));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `You've already comitted a crime\n\nCommit crimes again in ${time}.`
        );
     return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    } 

  let crime = interaction.options.getString("crime")


  cooldowns.crime = Date.now()

  cooldowns.save()

  if(crime == "list"){

    let embed = new EmbedBuilder()
    .setTitle("Crimes")
    .addFields(
      {
        name: `Pick Pocket`,
        value: `${crimedb.pickpocket.Description}\nMax Reward: ${toCurrency(crimedb.pickpocket.RewardMax)}`,
        inline: true
      },
      {
        name: `Grand Theft Auto`,
        value: `${crimedb.gta.Description}`,
        inline: true
      },
      {
        name: `Robbery`,
        value: `${crimedb.robbery.Description}` ,
        inline: true
      }
    )
    .setColor(colors.blue)

    await interaction.reply({embeds: [embed]})
  }

  else if(crime == "pickpocket") {
    let chance = randomRange(1, 100)

    console.log(`chance ${chance}`)
    if(chance <= crimedb.pickpocket.Chance){
      let success = lodash.sample(crimedb.pickpocket.Success)
      let reward = randomRange(crimedb.pickpocket.RewardMin, crimedb.pickpocket.RewardMax)

      userdata.cash += reward

      userdata.save()
      await interaction.reply(`${success} ${toCurrency(reward)}`)
    }
    else {
      let fail = lodash.sample(crimedb.pickpocket.Fail)
      let reward = randomRange(crimedb.pickpocket.RewardMin, crimedb.pickpocket.RewardMax)

      let newcash = userdata.cash - reward
      
      if(newcash < 0){
        userdata.cash = 0
      }
      else {
        userdata.cash -= reward
      }

      userdata.save()
      await interaction.reply(`${fail} ${toCurrency(reward)}`)

    }
  }
  else if(crime == "gta") {
    let chance = randomRange(1, 100)

    console.log(`chance ${chance}`)
    if(chance <= crimedb.gta.Chance){
      let success = "You successfully stole a "
      let reward = lodash.sample(crimedb.gta.Cars)
      let carindb = cardb.Cars[reward.toLowerCase()]
       let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Image: carindb.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: carindb.Weight,
          Gas: 10,
          MaxGas: 10,
        };
      userdata.cars.push(carobj)

      userdata.save()

      await interaction.reply(`${success} ${carindb.Emote} ${carindb.Name}`)
    }
    else {
      let reward = randomRange(1000, 10000)
      let fail = `You failed to steal a car, the police found out and you got fined ${toCurrency(reward)}`

      let newcash = userdata.cash - reward
      
      if(newcash < 0){
        userdata.cash = 0
      }
      else {
        userdata.cash -= reward
      }

      userdata.save()
      await interaction.reply(`${fail}`)

    }
  }
  else if(crime == "robbery") {
    let chance = randomRange(1, 100)

    console.log(`chance ${chance}`)
    if(chance <= crimedb.robbery.Chance){
      let success = "You successfully stole a "
      let reward = lodash.sample(crimedb.robbery.Items)
      let itemindb = itemdb[reward.toLowerCase()]
       
      userdata.items.push(reward.toLowerCase())

      userdata.save()
      cooldowns.crime = Date.now()

      cooldowns.save()
      await interaction.reply(`${success} ${itemindb.Emote} ${itemindb.Name}`)
    }
    else {
      let reward = randomRange(1000, 5000)
      let fail = `You failed to rob, the police found out and you got fined ${toCurrency(reward)}`

      let newcash = userdata.cash - reward
      
      if(newcash < 0){
        userdata.cash = 0
      }
      else {
        userdata.cash -= reward
      }
      cooldowns.crime = Date.now()

      cooldowns.save()
      userdata.save()
      await interaction.reply(`${fail}`)

    }
  }

  
},
};
