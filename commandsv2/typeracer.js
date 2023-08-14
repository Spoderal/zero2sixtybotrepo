const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");

const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("typerace")
    .setDescription("Race your fingers in the type takeover event")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car to race with")
        .setRequired(true)
    ),

  async execute(interaction) {
    let userdata =
      (await User.findOne({ id: interaction.user.id })) ||
      new User({ id: interaction.user.id });
    let cooldowns =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });
    let caroption = interaction.options.getString("car");
    let usercars = userdata.cars;

    let selected = usercars.filter(
      (car) =>
        car.ID.toLowerCase() == caroption.toLowerCase() ||
        car.Name.toLowerCase() == caroption.toLowerCase()
    );

    let timeout = 300000;

    let gas = selected[0].Gas;

    if (gas <= 0)
      return interaction.reply("Your car is out of gas! Refill it with /gas");
    let racing = cooldowns.eventCooldown;

    if (racing !== null && timeout - (Date.now() - racing) > 0) {
      let time = ms(timeout - (Date.now() - racing));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Wait ${time} before type racing again.`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      return;
    }

    const collectorFilter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter: collectorFilter,
      time: 30000,
    });

    if (!selected[0]) return interaction.reply("You don't have this car!");

    let timer = 0;

    let time = setInterval(() => {
      timer++;
    }, 1000);
    let words = [
      "race",
      "type",
      "fingers",
      "walter",
      "flame house",
      "win",
      "lost",
      "ferrari",
      "porsche",
      "zero2sixty",
    ];
    let wordcount = randomRange(2, 5);
    let wordarr = [];
    let actualword = [];
    for (let i = 0; i < wordcount; i++) {
      let randomword = lodash.sample(words);

      let splitted = randomword.split("").join(" ");

      wordarr.push(`${splitted} / `);
      actualword.push(randomword);
    }
    let handling = selected[0].Handling;

    cooldowns.eventCooldown = Date.now();
    cooldowns.save();

    interaction.reply(`Type the following:\n\n${wordarr.join(" ")}`);

    collector.on("collect", async (msg) => {
      let content = msg.content.toLowerCase();

      let finalword = actualword.join(" ");
      console.log(finalword);
      console.log(content);
      if (content !== finalword) {
        collector.stop();
        msg.channel.send(`You mistyped the words, so you lost!`);
        return;
      } else if (content.toLowerCase() == finalword) {
        let score = Math.round(handling / 10 / timer);
        msg.channel.send(
          `You won, your typing speed was ${timer.toLocaleString()}s! You also earned <:key_z:1140029565360668783> ${score} keys`
        );

        userdata.typekeys += score;

        let typespeed = userdata.typespeed || 0;

        if (typespeed !== 0 && timer < typespeed) {
          userdata.typespeed = timer;
        }
        collector.stop();
        userdata.save();
      }

      clearInterval(time);
      collector.stop();
      return;
    });
  },
};
