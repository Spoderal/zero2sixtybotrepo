const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Begin your racing career"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    if (userdata) return await interaction.reply("You have an account!");

    let miata = cardb.Cars["1995 mazda miata"];
    let veloster = cardb.Cars["2012 hyundai veloster"];
    let integra = cardb.Cars["1997 acura integra"];
    let honda = cardb.Cars["1999 honda civic si"];

    let row = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId("miata")
        .setLabel("1995 Mazda Miata")
        .setEmoji(`${miata.Emote}`)
        .setStyle("Secondary"),
      new discord.ButtonBuilder()
        .setCustomId("veloster")
        .setLabel("2012 Hyundai Veloster")
        .setEmoji(`${veloster.Emote}`)
        .setStyle("Secondary"),
      new discord.ButtonBuilder()
        .setCustomId("integra")
        .setLabel("1997 Acura Integra")
        .setEmoji(`${integra.Emote}`)
        .setStyle("Secondary"),
      new discord.ButtonBuilder()
        .setCustomId("honda")
        .setLabel("1999 Honda Civic SI")
        .setEmoji(`${honda.Emote}`)
        .setStyle("Secondary")
    );

    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      color: 3447003,
      thumbnail: { url: "https://i.ibb.co/5n1ts36/newlogoshadow.png" },
      description:
        "Check out the getting started tutorial on YouTube, Run `/dealer` to buy your first car, and go race with it!\n\nAny Questions? Join our [community server](https://discord.gg/bHwqpxJnJk)!\n\nHave fun!\n[YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)",
    });
    let msg = await interaction.reply({
      content: `Starting the tutorial, pick a car from the buttons below to choose a car!`,
      embeds: [embed],
      components: [row],
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
      let carobj;
      if (i.customId.includes("miata")) {
        let carindb = cardb.Cars["1995 mazda miata"];
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          Weight: carindb.Weight,
        };

        newuser.cars.push(carobj);
        newuser.save();
      } else if (i.customId.includes("integra")) {
        let carindb = cardb.Cars["1997 acura integra"];
        carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          Weight: carindb.Weight,
        };

        newuser.cars.push(carobj);
        newuser.save();
      } else if (i.customId.includes("honda")) {
        let carindb = cardb.Cars["1999 honda civic si"];
        carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          Weight: carindb.Weight,
        };

        newuser.cars.push(carobj);
        newuser.save();
      } else if (i.customId.includes("veloster")) {
        let carindb = cardb.Cars["2012 hyundai veloster"];
        carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          Weight: carindb.Weight,
        };

        newuser.cars.push(carobj);
        newuser.save();
      }

      await i.update(
        `Nice choice! Now that you've bought your first car, you can race with it! All cars have an ID, Thats what you're going to type in the box when it asks for the car, run /garage to see your cars ID, go ahead and try running \`/race car: ${carobj.ID}\`, and **select street race**, then **select Tier 1*`
      );
    });
  },
};
