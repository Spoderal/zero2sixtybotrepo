const Discord = require("discord.js");
const barns = require("../junkparts.json");
const lodash = require("lodash");
const partsdb = require("../partsdb.json");
const ms = require(`pretty-ms`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");

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
      let timeEmbed = new Discord.MessageEmbed()
        .setColor("#60b0f4")
        .setDescription(
          `Please wait ${time} before searching junkyards again.`
        );
      interaction.reply({ embeds: [timeEmbed] });
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
        console.log("chances sum is higher than 100!");
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
      console.log(barnfind);

      let part = partsdb.Parts[barnfind.toLowerCase()];

      cooldowndata.junk = Date.now();
      await cooldowndata.save();
      userdata.parts.push(part.Name.toLowerCase());
      await userdata.save();
      let embed = new Discord.MessageEmbed()
        .setTitle(`${rarity.type} Part Find`)
        .addField(`Part`, `${part.Name}`)
        .setColor("#60b0f4");
      interaction.reply({ embeds: [embed] });
    }

    pickRandom();
  },
};
