const Discord = require("discord.js");
const barns = require("../data/junkparts.json");
const lodash = require("lodash");
const partsdb = require("../data/partsdb.json");
const ms = require(`pretty-ms`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("junkyard")
    .setDescription("Search the junkyard for parts"),
  async execute(interaction) {
    let uid = interaction.user.id;
    let cooldowndata =
      (await Cooldowns.findOne({ id: uid })) || new Cooldowns({ id: uid });
    let userdata = (await User.findOne({ id: uid })) || new User();

    let barntimer = cooldowndata.junk;

    let timeout = 60000;

    if (barntimer !== null && timeout - (Date.now() - barntimer) > 0) {
      let time = ms(timeout - (Date.now() - barntimer));
      let timeEmbed = new Discord.EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `Please wait ${time} before searching junkyards again.`
        );
      await interaction.reply({ embeds: [timeEmbed] });
      return;
    }
    var rarities = [
      {
        type: "Common",
        chance: 0,
      },
      {
        type: "Rare",
        chance: 15,
      },
      {
        type: "Uncommon",
        chance: 50,
      },
    ];

    async function pickRandom() {
      // Calculate chances for common
      var filler =
        100 -
        rarities.map((r) => r.chance).reduce((sum, current) => sum + current);

      if (filler <= 0) {
        return;
      }

      // Create an array of 100 elements, based on the chances field
      var probability = rarities
        .map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i))
        .reduce((c, v) => c.concat(v), []);

      // Pick one
      var pIndex = Math.floor(Math.random() * 100);
      var rarity = rarities[probability[pIndex]];
      let barnfind = lodash.sample(barns.Parts[rarity.type.toLowerCase()]);

      let part = partsdb.Parts[barnfind.toLowerCase()];

      cooldowndata.junk = Date.now();
      await cooldowndata.save();
      userdata.parts.push(part.Name.toLowerCase());
      let filteredegg = userdata.cars.filter((car) => car.Name == "2023 Steam Egg Mobile")

      if(!filteredegg[0]){
        let carindb = cardb.Cars["2023 steam egg mobile"]
        let eggobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
          Resale: 0,
          Weight: carindb.Weight,
        }
        userdata.cars.push(eggobj)
      }

      await userdata.save();
      let embed = new Discord.EmbedBuilder()
        .setTitle(`${rarity.type} Part Find`)
        .addFields([{ name: `Part`, value: `${part.Name}` }])
        .setDescription("Found 🥚 2023 Steam Egg Mobile")
        .setColor(colors.blue);
      await interaction.reply({ embeds: [embed] });

      
    }

    pickRandom();
  },
};
