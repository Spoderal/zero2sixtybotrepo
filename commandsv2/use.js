const Discord = require("discord.js");
const cars = require("../cardb.json");
const db = require("quick.db");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const itemdb = require("../items.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const Global = require("../schema/global-schema");
const Car = require("../schema/car");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("use")
    .setDescription("Use an item")
    .addStringOption((option) =>
      option.setName("item").setRequired(true).setDescription("The item to use")
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setRequired(false)
        .setDescription("Amount to use")
    ),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

    let itemtouse = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount");
    let amount2 = amount || 1;
    let user = interaction.user;

    let items = userdata.items;
    let emote;
    let name;
    if (!items.includes(itemtouse.toLowerCase()))
      return interaction.reply("You don't have this item!");
    let filtereduser = items.filter(function hasmany(part) {
      return part === itemtouse.toLowerCase();
    });
    console.log(filtereduser);
    if (amount2 > 50)
      return interaction.reply(
        `The max amount you can use in one command is 50!`
      );

    if (amount2 > filtereduser.length)
      return interaction.reply("You don't have that many of that item!");
    let fullname;
    console.log(itemtouse);

    if (itemdb.Police[itemtouse.toLowerCase()]) {
      userdata.using.push(itemtouse.toLowerCase());
      fullname = `${itemdb.Police[itemtouse.toLowerCase()].Emote} ${
        itemdb.Police[itemtouse.toLowerCase()].Name
      }`;
    } else if (
      itemdb.Other[itemtouse.toLowerCase()] ||
      itemdb.Collectable[0][itemtouse.toLowerCase()]
    ) {
      if (itemtouse.toLowerCase() == "pink slip") {
        userdata.pinkslips += 1;
      } else if (itemtouse.toLowerCase() == "bank increase") {
        let banklimit = userdata.banklimit;

        if (banklimit >= 250000000)
          return interaction.reply(
            `The bank limit cap is currently $${numberWithCommas(250000000)}!`
          );

        let finalbanklimit = 5000 * amount2;
        userdata.banklimit += finalbanklimit;
        userdata.update();

        if (userdata.banklimit >= 250000000) {
          userdata.banklimit = 250000000;
        }
      } else if (itemtouse.toLowerCase() == "super wheelspin") {
        let final = 1 * amount2;

        userdata.swheelspins += final;
      } else if (itemtouse.toLowerCase() == "energy drink") {
        userdata.using.push(`energy drink`);
        cooldowndata.energydrink = Date.now();
      } else if (itemtouse.toLowerCase() == "sponsor") {
        userdata.using.push(`sponsor`);
        cooldowndata.sponsor = Date.now();
      } else if (itemtouse.toLowerCase() == "small vault") {
        let vault = userdata.vault;
        if (vault)
          return interaction.reply(
            `You already have a vault activated, prestige to deactivate it!`
          );
        userdata.vault = itemtouse.toLowerCase();
      } else if (itemtouse.toLowerCase() == "medium vault") {
        let vault = userdata.vault;
        if (vault)
          return interaction.reply(
            `You already have a vault activated, prestige to deactivate it!`
          );
        userdata.vault = itemtouse.toLowerCase();
      } else if (itemtouse.toLowerCase() == "large vault") {
        let vault = userdata.vault;
        if (vault)
          return interaction.reply(
            `You already have a vault activated, prestige to deactivate it!`
          );
        userdata.vault = itemtouse.toLowerCase();
      } else if (itemtouse.toLowerCase() == "pet egg") {
        let pet = userdata.pet;
        let petobj = {
          condition: 100,
          oil: 100,
          gas: 100,
          love: 100,
          car: "mini miata",
          tier: 1,
          color: "Red",
        };

        if (pet) return interaction.reply(`You already have a pet!`);
        userdata.pet = petobj;
      } else if (itemtouse.toLowerCase() == "water bottle") {
        let watercooldown = cooldowndata.waterbottle;
        let timeout = 18000000;
        if (
          watercooldown !== null &&
          timeout - (Date.now() - watercooldown) > 0
        ) {
          let time = ms(timeout - (Date.now() - watercooldown));
          let timeEmbed = new Discord.MessageEmbed()
            .setColor("#60b0f4")
            .setDescription(`You can use a water bottle again in ${time}.`);
          return await interaction.reply({ embeds: [timeEmbed] });
        }
        cooldowndata.racing = 0;
        cooldowndata.betracing = 0;

        cooldowndata.cashcup = 0;
        cooldowndata.hm = 0;

        cooldowndata.waterbottle = Date.now();
      }
    }
    if (itemdb.Police[itemtouse.toLowerCase()]) {
      emote = itemdb.Police[itemtouse.toLowerCase()].Emote;
      name = itemdb.Police[itemtouse.toLowerCase()].Name;
      type = itemdb.Police[itemtouse.toLowerCase()].Type;
    } else if (itemdb.Multiplier[itemtouse.toLowerCase()]) {
      emote = itemdb.Multiplier[itemtouse.toLowerCase()].Emote;
      name = itemdb.Multiplier[itemtouse.toLowerCase()].Name;
      type = itemdb.Multiplier[itemtouse.toLowerCase()].Type;
    } else if (itemdb.Other[itemtouse.toLowerCase()]) {
      emote = itemdb.Other[itemtouse.toLowerCase()].Emote;
      name = itemdb.Other[itemtouse.toLowerCase()].Name;
      type = itemdb.Other[itemtouse.toLowerCase()].Type;
    } else if (itemdb.Collectable[0][itemtouse.toLowerCase()]) {
      emote = itemdb.Collectable[0][itemtouse.toLowerCase()].Emote;
      name = itemdb.Collectable[0][itemtouse.toLowerCase()].Name;
      type = itemdb.Collectable[0][itemtouse.toLowerCase()].Type;
    }

    fullname = `${emote} ${name}`;

    for (var i = 0; i < amount2; i++)
      items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
    userdata.items = items;

    console.log(fullname);
    userdata.save();
    await interaction.reply(`Used x${amount2} ${fullname}!`);

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};
