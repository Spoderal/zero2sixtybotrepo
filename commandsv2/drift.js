

const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const cars = require("../data/cardb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementdb = require("../data/achievements.json")
const { createCanvas, loadImage } = require("canvas");
const { toCurrency, isWeekend } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("drift")
    .setDescription("Drift your car")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The track difficulty")
        .setRequired(true)
        .addChoices(
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" },
          { name: "Master", value: "master" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track you want to drift on")
        .setRequired(true)
        .addChoices(
          { name: "Regular", value: "regular" },
          { name: "Mountain", value: "mountain" },
          { name: "Parking Garage", value: "parking garage" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: user.id });
    let driftcooldown = cooldowndata.drift;
    let track = interaction.options.getString("track");
    let difficulty = interaction.options.getString("difficulty");
    let timeout = 45000;
    let idtoselect = interaction.options.getString("car");

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";

    if (selected == "No ID") {
      let errembed = new EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    if (selected.Gas <= 0)
    return interaction.reply(
      `You're out of gas! Use \`/gas\` to fill up for the price of gas today! Check the daily price of gas with \`/bot\``
    );
    if (driftcooldown !== null && timeout - (Date.now() - driftcooldown) > 0) {
      let timel = ms(timeout - (Date.now() - driftcooldown));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`You can drift again in ${timel}`);
      return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
    }



  

    function calculateDriftScore(currentSpeed, maxSpeed, currentAngle, maxAngle, currentControl, maxControl, weightSpeed, weightAngle, weightControl, trackDifficulty, trackType) {
      // Normalize values
      const normalizedSpeed = currentSpeed / maxSpeed;
      const normalizedAngle = currentAngle / maxAngle;
      const normalizedControl = currentControl / maxControl;
  
      // Invert weights by subtracting from 1
      const invertedWeightSpeed = 1 - weightSpeed;
      const invertedWeightAngle = 1 - weightAngle;
      const invertedWeightControl = 1 - weightControl;
  
      // Adjust weights based on track difficulty
      const weightedSpeed = invertedWeightSpeed * (1 - trackDifficulty);
      const weightedAngle = invertedWeightAngle * (1 - trackDifficulty);
      const weightedControl = invertedWeightControl * (1 - trackDifficulty);
  
      // Calculate Drift Score
      const driftScore = (weightedSpeed * normalizedSpeed) + (weightedAngle * normalizedAngle) + (weightedControl * normalizedControl);
  
      // Define completion thresholds for different track types
      const completionThresholds = {
        "regular":0.5,
          "parking garage": 0.7, 
          "mountain": 0.8,
      };
  
      // Determine the completion threshold for the current track type
      const threshold = completionThresholds[trackType] || 0.5;  // Default threshold if track type is not defined
  
      // Check if the drift score meets the completion threshold for the current track type
      const isTrackComplete = driftScore >= threshold;
  
      return { driftScore, isTrackComplete };
  }
  
  
  // Example usage with track difficulty
  const currentSpeed = selected.Speed / selected.Acceleration; // Example current speed
  const maxSpeed = selected.Speed; // Example maximum speed
  const currentAngle = 45; // Example current angle
  const maxAngle = 90; // Example maximum angle
  const currentControl = (selected.Handling) / selected.Acceleration; // Example current control
  const maxControl = (selected.Handling); // Example maximum control
  
  const weightSpeed = (selected.WeightStat / 100) / selected.Speed; // Base weight for speed
  const weightAngle = (selected.WeightStat / 100) / selected.Speed; // Base weight for angle
  const weightControl = (selected.WeightStat / 100) / selected.Handling; // Base weight for control

  let tracks = {
    easy: 0.2,
    medium: 0.3,
    hard: 0.4,
    master: 0.5
  }


  
  let trackDifficulty = tracks[difficulty];


  
  const driftScore = calculateDriftScore(currentSpeed, maxSpeed, currentAngle, maxAngle, currentControl, maxControl, weightSpeed, weightAngle, weightControl, trackDifficulty, track);

  let didfail = "Failed"
  if (driftScore.isTrackComplete) {
    didfail = "Completed"
  }

  let rewards = []

  let tracktypes = [
    {
      type: "regular",
      name:"Regular",
      image:"https://i.ibb.co/g3fLQ2T/drift-regular.png",
      cash: 1000,
      threshold: 0.5,
      miles:1,
      xp:10
    },
    {
      type: "parking garage",
      name: "Parking Garage",
      image:"https://i.ibb.co/L9BM58b/drift-garage.png",
      cash: 2000,
      threshold: 0.7,
      miles:3,
      xp:25
    },
    {
      type: "mountain",
      name: "Mountain",
      image:"https://i.ibb.co/CmYrVpy/drift-mountains.png",
      cash: 3000,
      threshold: 0.8,
      miles:5,
      xp:50
    }
  ]

  let trackdifficulties = [
    {
      type: "easy",
      name: "Easy",
      cashbonus: 0,
      keys:1,
      xp:1
    },
    {
      type: "medium",
      name: "Medium",
      cashbonus: 500,
      xp:2,
      keys:2,
    },
    {
      type: "hard",
      name: "Hard",
      cashbonus: 1000,
      xp:3,
      keys:3,
    },
    {
      type: "master",
      name: "Master",
      cashbonus: 2000,
      xp:5,
      keys:5,
    }
  ]

  let tracktype = tracktypes.find(t => t.type == track);

  let trackdif = trackdifficulties.find(t => t.type == difficulty);

  let livery = selected.Livery || selected.Image || cars.Cars[selected.Name.toLowerCase()].Image;

  cooldowndata.drift = Date.now();
  await cooldowndata.save();

  let embed = new EmbedBuilder()
  .setTitle(`Drifting`)
  .setColor(colors.blue)
  .addFields({name: "Track", value: `${trackdif.name} ${tracktype.name}`, inline: true})
  .addFields({name: "Car", value: `${selected.Emote} ${selected.Name}`, inline: true})
  .addFields({name: "Stats", value: `${emotes.speed} ${selected.Speed}\n${emotes.acceleration} ${selected.Acceleration}\n${emotes.handling} ${selected.Handling}\n${emotes.weight} ${selected.WeightStat}`, inline: true})
  .addFields({name: "Drift Score Needed", value: `${tracktype.threshold}`, inline: true})
  .setThumbnail(tracktype.image)
  .setImage(livery)

  
  await interaction.reply({ embeds: [embed], fetchReply: true});

  setTimeout(async () => {
    
    driftScore.driftScore = Math.round(driftScore.driftScore * 100) / 100;
    
    let embed = new EmbedBuilder()
  .setTitle(`Drift ${didfail}`)
  .setColor(colors.blue)
  .addFields({name: "Track", value: `${trackdif.name} ${tracktype.name}`, inline: true})
  .addFields({name: "Car", value: `${selected.Emote} ${selected.Name}`, inline: true})
  .addFields({name: "Stats", value: `${emotes.speed} ${selected.Speed}\n${emotes.acceleration} ${selected.Acceleration}\n${emotes.handling} ${selected.Handling}\n${emotes.weight} ${selected.WeightStat}`, inline: true})
  .addFields({name: "Drift Score", value: `${driftScore.driftScore}`, inline: true})
  .addFields({name: "Drift Score Needed", value: `${tracktype.threshold}`, inline: true})
  .setThumbnail(tracktype.image)
  .setImage(livery)

  if (driftScore.isTrackComplete) {
    let xp = tracktype.xp * trackdif.xp
    let cash = tracktype.cash + trackdif.cashbonus

    //item bonuses

    let using = userdata.using;
    if (using.includes("fruit punch")) {
      xp = xp * 2;
    }

    if (userdata.items.includes("match")) {
      xp = xp * 2;
    }
    if (userdata.items.includes("parking brake")) {
      xp = xp * 4;
    }
    if(userdata.location == "japan" ){
      cash = cash * 2
    }

    if(isWeekend()){
      xp = xp * 2
      cash = cash * 2
      rewards.push("Double Cash & XP Weekend")

    }

    let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["drift king"].Name)
    if (difficulty == "master" && track == "parking garage" && ach2.length <= 0) {
      rewards.push(`Drift King Achievement`)
      userdata.achievements.push({
        name: achievementdb.Achievements["drift king"].Name,
        id: achievementdb.Achievements["drift king"].Name.toLowerCase(),
        completed: true,
      });
    }
    selected.Gas -= 1;
    if (selected.Gas <= 0) {
      selected.Gas = 0;
    }
    selected.Miles += tracktype.miles;
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
    userdata.cash += cash

    userdata.xp += xp
    let keys = trackdif.keys
    userdata.driftKeys += keys
    let skill = userdata.skill

    let requiredxp  = skill * 100

    if(userdata.xp >= requiredxp){
      userdata.skill += 1
      userdata.xp = 0
      rewards.push(`${emotes.rank} Skill Level Up!`)
    }
    rewards.push(`${emotes.cash} ${toCurrency(cash)}`)
    rewards.push(`${emotes.xp} ${xp}`)
    rewards.push(`${emotes.dirftKey} ${keys} Drift Keys`)
    embed.addFields({name: "Rewards", value: rewards.join("\n"), inline: true})

    userdata.save()
  }
  
  
  await interaction.editReply({ embeds: [embed] });
}, 3000);
  
  },
};

