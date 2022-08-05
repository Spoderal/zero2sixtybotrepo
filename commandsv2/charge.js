const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const cars = require("../cardb.json");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("charge")
    .setDescription("Charge up your EV")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car by id to charge")
        .setRequired(false)
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    let car = interaction.options.getString("car");
    let filteredcar = userdata.cars.filter((car) => car.ID == car);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }

    if (!cars.Cars[selected.Name.toLowerCase()].Electric)
      return interaction.reply("Thats not an EV!");
    let house = userdata.house;
    let userid = interaction.user.id;
    let cash = userdata.cash;
    let range = selected.Range;
    let maxrange = selected.MaxRange;

    if (range == maxrange)
      return interaction.reply("This EV doesn't need charged!");
    if (house && house.perks.includes("Free EV charging")) {
      let embed = new Discord.MessageEmbed()
        .setTitle(`⚡ Charging ${cars.Cars[selected.toLowerCase()].Name}... ⚡`)
        .setImage(`${cars.Cars[selected.toLowerCase()].Image}`)

        .setColor("#60b0f4");
      selected.Range = maxrange;
      userdata.save();

      interaction.reply({ embeds: [embed] });
      setTimeout(() => {
        embed.setTitle("🔋 Charged! 🔋");
        embed.setDescription(`Cost: $0`);
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    } else {
      if (cash < 500)
        return interaction.reply(
          "You don't have enough cash! You need $500 to charge your vehicle."
        );

      let embed = new Discord.MessageEmbed()
        .setTitle(`⚡ Charging ${cars.Cars[selected.toLowerCase()].Name}... ⚡`)
        .setImage(`${cars.Cars[selected.toLowerCase()].Image}`);
      embed.setColor("#60b0f4");
      selected.Range = maxrange;
      cash -= 500;
      userdata.save();

      interaction.reply({ embeds: [embed] });
      setTimeout(() => {
        embed.setTitle("🔋 Charged! 🔋");
        embed.setDescription(`Cost: $500`);
        interaction.editReply({ embeds: [embed] });
      }, 2000);
    }
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function convert(val) {
      // thousands, millions, billions etc..
      var s = ["", "k", "m", "b", "t"];

      // dividing the value by 3.
      var sNum = Math.floor(("" + val).length / 3);

      // calculating the precised value.
      var sVal = parseFloat(
        (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2)
      );

      if (sVal % 1 != 0) {
        sVal = sVal.toFixed(1);
      }

      // appending the letter to precised val.
      return sVal + s[sNum];
    }
  },
};
