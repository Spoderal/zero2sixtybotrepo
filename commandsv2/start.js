const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");
const colors = require("../common/colors");
const lodash = require("lodash");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Begin your racing career"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    if (userdata) return await interaction.reply("You have an account!");
    interaction.reply({content: "Please wait...", fetchReply: true})
    let starters = [
      "1995 mazda miata",
      "2002 ford mustang",
      "2000 bmw series 3",
    ];

    let rowjp = new discord.ActionRowBuilder();


   

    for (let jp in starters) {
      let car = starters[jp];

      rowjp.addComponents(
        new ButtonBuilder()
          .setCustomId(`${car}`)
          .setLabel(`${cardb.Cars[car].Name}`)
          .setEmoji(`${cardb.Cars[car].Emote}`)
          .setStyle(`Secondary`)
      );
    }


    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      thumbnail: { url: "https://i.ibb.co/BqfBbWB/boticon.png" },
      description:
        `**Welcome to Zero2Sixty!**\nAllow me to start your interactive tutorial, you'll be the best racer in no time!\nChoose a car below to get started and let the tutorial guide you through the vast world of Zero2Sixty, each car has its benefits, and downsides, all depending on how you'd like to play!\n\nCheck out the [getting started tutorial](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty) on YouTube\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!\n\nYou have 30 seconds to choose a car or the bot will choose for you!\n\nAfter you've chosen your car, run \`/garage\``,
    })
    .addFields({name: `${cardb.Cars[starters[0]].Name}`, value: `${emotes.speed} Speed: ${cardb.Cars[starters[0]].Speed}\n${emotes.acceleration} Acceleration: ${cardb.Cars[starters[0]]["0-60"]}\n${emotes.handling} Handling: ${cardb.Cars[starters[0]].Handling}\n${emotes.weight} Weight: ${cardb.Cars[starters[1]].Weight}`, inline: true},
    {name: `${cardb.Cars[starters[1]].Name}`, value: `${emotes.speed} Speed: ${cardb.Cars[starters[1]].Speed}\n${emotes.acceleration} Acceleration: ${cardb.Cars[starters[1]]["0-60"]}\n${emotes.handling} Handling: ${cardb.Cars[starters[1]].Handling}\n${emotes.weight} Weight: ${cardb.Cars[starters[1]].Weight}`, inline: true},
    {name: `${cardb.Cars[starters[2]].Name}`, value: `${emotes.speed} Speed: ${cardb.Cars[starters[2]].Speed}\n${emotes.acceleration} Acceleration: ${cardb.Cars[starters[2]]["0-60"]}\n${emotes.handling} Handling: ${cardb.Cars[starters[2]].Handling}\n${emotes.weight} Weight: ${cardb.Cars[starters[2]].Weight}`, inline: true},
    )
    embed.setColor(`${colors.blue}`)
    .setImage("https://i.ibb.co/8PDwfTd/starterchoose.png")
    let msg
    setTimeout(async () => {
      
    msg = await interaction.editReply({
        content: `Starting the tutorial, pick a car from the buttons below to choose a car! Make sure you choose wisely`,
        embeds: [embed],
        components: [rowjp],
        fetchReply: true,
      });

        

      
      let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 60000,
    });
    let newuser = await new User({ id: interaction.user.id });
    newuser.tutorial = {
      started: true,
      startfinished: false,
      type: "starter",
      stage: 1,
    };
    newuser.cash += 500;
    

    collector.on("collect", async (i) => {
      let car = i.customId;
      let carindb = cardb.Cars[car];
      userdata = await User.findOne({ id: userid });
      if (userdata) return await interaction.editReply("You have an account!");
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
        Resale: 375,
        WeightStat: carindb.Weight,
        Gas: 10,
        MaxGas: 10,
      };
      
      newuser.cars.push(carobj);
      newuser.save();
      await interaction.editReply(
        `Nice choice! Now that you've bought your first car, you can race with it! All cars have an ID, Thats what you're going to type in the box when it asks for the car, **run /garage** to see your cars ID.`
        );
        await interaction.channel.send(`**TUTORIAL:** Now that you've chosen your car, run \`garage\` to see your car!`)
      });

      collector.on('end', async () => {
        let car = lodash.sample(starters)
        let carindb = cardb.Cars[car];
        userdata = await User.findOne({ id: userid });
        if (userdata) return await interaction.editReply("You have an account!");
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
          Resale: 375,
          WeightStat: carindb.Weight,
          Gas: 10,
          MaxGas: 10,
        };
        
        newuser.cars.push(carobj);
        newuser.save();
        await interaction.editReply(
          `Well, either you forgot about this message or you're doing a challenge, here's a random car! All cars have an ID, Thats what you're going to type in the box when it asks for the car, **run /garage** to see your cars ID, go ahead and try running \`/race race: street race car: ${carobj.ID} tier: tier 1\``
          );
        });
    }, 3000);
    },
  };
