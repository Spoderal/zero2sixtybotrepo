const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const cardb = require("../data/cardb.json");
const houses = require("../data/houses.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Begin your racing career"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    if (userdata) return await interaction.reply("You have an account!");

    let startersjp = [
      "1995 mazda miata",
      "2011 scion tc",
      "1997 acura integra",
    ];
    let startersam = [
      "2002 ford mustang",
      "1977 chevy camaro",
      "2002 pontiac firebird",
    ];
    let starterseu = [
      "1999 audi a4",
      "2000 bmw series 3",
      "2001 volkswagen golf",
    ];

    let globals = await Global.findOne({});

    let rowjp = new discord.ActionRowBuilder();
    let rowam = new discord.ActionRowBuilder();
    let roweu = new discord.ActionRowBuilder();

    for (let eu in starterseu) {
      let car = starterseu[eu];

      console.log(car);

      roweu.addComponents(
        new ButtonBuilder()
          .setCustomId(`${car}`)
          .setLabel(`${cardb.Cars[car].Name}`)
          .setEmoji(`${cardb.Cars[car].Emote}`)
          .setStyle(`Secondary`)
      );
    }

    for (let jp in startersjp) {
      let car = startersjp[jp];

      rowjp.addComponents(
        new ButtonBuilder()
          .setCustomId(`${car}`)
          .setLabel(`${cardb.Cars[car].Name}`)
          .setEmoji(`${cardb.Cars[car].Emote}`)
          .setStyle(`Secondary`)
      );
    }

    for (let am in startersam) {
      let car = startersam[am];

      rowam.addComponents(
        new ButtonBuilder()
          .setCustomId(`${car}`)
          .setLabel(`${cardb.Cars[car].Name}`)
          .setEmoji(`${cardb.Cars[car].Emote}`)
          .setStyle(`Secondary`)
      );
    }

    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      color: 3447003,
      thumbnail: { url: "https://i.ibb.co/5n1ts36/newlogoshadow.png" },
      description:
        "The police, or better known, the ZPD, has raided every racers garage in ZeroCity! You'll need to climb your way up to earn the reputation to take on the police captain, Devil. Choose a car below to start your racing journey!\n\nCheck out the [getting started tutorial](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty) on YouTube\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!",
    });
    let msg = await interaction.reply({
      content: `Starting the tutorial, pick a car from the buttons below to choose a car! Make sure you choose wisely`,
      embeds: [embed],
      components: [rowjp, rowam, roweu],
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
      finished: false,
      stage: 1,
    };
    newuser.cash += 500;

    collector.on("collect", async (i) => {
      let car = i.customId;
      let carindb = cardb.Cars[car];
      userdata = await User.findOne({ id: userid });
      if (userdata) return await i.update("You have an account!");
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
      };


      newuser.cars.push(carobj);
      newuser.save();
      await i.update(
        `Nice choice! Now that you've bought your first car, you can race with it! All cars have an ID, Thats what you're going to type in the box when it asks for the car, run /garage to see your cars ID, go ahead and try running \`/race car: ${carobj.ID}\`, and **select street race**, then **select Tier 1**`
      );
    });
  },
};
