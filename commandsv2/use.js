const Discord = require("discord.js");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const lodash = require("lodash");
const { GET_STARTED_MESSAGE } = require("../common/constants");

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
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

    let itemtouse = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount");
    let amount2 = amount || 1;
    let items = userdata.items;
    let emote;
    let name;
    if (itemdb.Other[itemtouse.toLowerCase()].Type == "Non-Usable")
      return interaction.reply(`Thats not a usable item!`);
    if (!items.includes(itemtouse.toLowerCase()))
      return interaction.reply("You don't have this item!");
    let filtereduser = items.filter(function hasmany(part) {
      return part === itemtouse.toLowerCase();
    });
    if (amount2 > 50)
      return interaction.reply(
        `The max amount you can use in one command is 50!`
      );

    if (amount2 > filtereduser.length)
      return interaction.reply("You don't have that many of that item!");
    let fullname;

    if (itemdb.Police[itemtouse.toLowerCase()]) {
      userdata.using.push(itemtouse.toLowerCase());
      fullname = `${itemdb.Police[itemtouse.toLowerCase()].Emote} ${
        itemdb.Police[itemtouse.toLowerCase()].Name
      }`;
    } else if (
      itemdb.Other[itemtouse.toLowerCase()] ||
      itemdb.Collectable[itemtouse.toLowerCase()]
    ) {
      if (itemtouse.toLowerCase() == "pink slip") {
        userdata.pinkslips += 1;
      } else if (itemtouse.toLowerCase() == "bank increase") {
        let banklimit = userdata.banklimit || 0;

        if (banklimit >= 2500000)
          return interaction.reply(
            `The bank limit cap is currently ${toCurrency(
              2500000
            )} for regular bank increases! Try using a big bank increase`
          );

        let finalbanklimit = 5000 * amount2;
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              banklimit: (banklimit += finalbanklimit),
            },
          }
        );
        userdata.update();

        if (userdata.banklimit >= 2500000) {
          userdata.banklimit = 2500000;
        }
      } else if (itemtouse.toLowerCase() == "big bank increase") {
        let banklimit = userdata.banklimit;

        if (banklimit >= 10000000)
          return interaction.reply(
            `The bank limit cap is currently ${toCurrency(
              10000000
            )} for big bank increases!`
          );

        let finalbanklimit = 25000 * amount2;
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              banklimit: (banklimit += finalbanklimit),
            },
          }
        );
        userdata.update();

        if (userdata.banklimit >= 10000000) {
          userdata.banklimit = 10000000;
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
      } else if (itemtouse.toLowerCase() == "disguise") {
        userdata.using.push("disguise");
      } else if (itemtouse.toLowerCase() == "pet egg") {
        let randcar = lodash.sample(["pretty porsche", "mini miata"]);
        let pet = userdata.pet;
        let petobj;
        if (randcar == "pretty porsche") {
          petobj = {
            condition: 100,
            oil: 100,
            gas: 100,
            love: 100,
            car: "pretty porsche",
            tier: 2,
            color: "White",
          };
        } else {
          petobj = {
            condition: 100,
            oil: 100,
            gas: 100,
            love: 100,
            car: "mini miata",
            tier: 1,
            color: "Red",
          };
        }

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
          let timeEmbed = new Discord.EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(`You can use a water bottle again in ${time}.`);
          return await interaction.reply({ embeds: [timeEmbed] });
        }
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              racing: 0,
              hm: 0,
              qm: 0,
              drifting: 0,
              waterbottle: Date.now(),
            },
          }
        );

        cooldowndata.save();
      } else if (itemtouse.toLowerCase() == "zero bar") {
        let effects = itemdb.Other["zero bar"].Effects;

        let randomeffect = lodash.sample(effects);

        if (randomeffect == "One of your cars just got +1 speed") {
          let randomcar = lodash.sample(userdata.cars);
          console.log(randomcar);
          randomcar.Speed += 1;
          console.log(randomcar);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": randomcar,
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": randomcar.Name,
                },
              ],
            }
          );

          userdata.update();
        } else if (
          randomeffect == "One of your cars just got +1 acceleration"
        ) {
          let randomcar = lodash.sample(userdata.cars);
          console.log(randomcar);
          randomcar.Acceleration += 1;
          console.log(randomcar);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": randomcar,
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": randomcar.Name,
                },
              ],
            }
          );

          userdata.update();
        } else if (randomeffect == "One of your cars just got -20 handling") {
          let randomcar = lodash.sample(userdata.cars);
          console.log(randomcar);
          randomcar.Handling -= 20;
          console.log(randomcar);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": randomcar,
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": randomcar.Name,
                },
              ],
            }
          );

          userdata.update();
        } else if (randomeffect == "One of your cars just got +5 speed") {
          let randomcar = lodash.sample(userdata.cars);
          console.log(randomcar);
          randomcar.Speed += 5;
          console.log(randomcar);
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": randomcar,
              },
            },

            {
              arrayFilters: [
                {
                  "car.Name": randomcar.Name,
                },
              ],
            }
          );

          userdata.update();
        } else if (randomeffect == "You stink, no effect for you") {
          return interaction.reply(`${randomeffect}`);
        } else if (randomeffect == "You just got your weekly reward now!") {
          let cash = 750;
          let patron = userdata.patron;
          let prestige = userdata.prestige;
          if (patron && patron.tier == "1") {
            cash *= 2;
          }
          if (patron && patron.tier == "2") {
            cash *= 3;
          }
          if (patron && patron.tier == "3") {
            cash *= 5;
          }
          if (patron && patron.tier == "4") {
            cash *= 6;
          }
          if (prestige > 0) {
            let mult = require("../data/prestige.json")[prestige].Mult;

            let multy = mult * cash;

            cash = cash += multy;
          }
          userdata.cash += cash;
          userdata.update();
        }
        for (var b = 0; i < amount2; b++)
          items.splice(items.indexOf("zero bar"), 1);
        userdata.items = items;
        userdata.save();
        interaction.reply(`${randomeffect}`);

        return;
      }
    }
    if (itemdb.Police[itemtouse.toLowerCase()]) {
      emote = itemdb.Police[itemtouse.toLowerCase()].Emote;
      name = itemdb.Police[itemtouse.toLowerCase()].Name;
    } else if (itemdb.Multiplier[itemtouse.toLowerCase()]) {
      emote = itemdb.Multiplier[itemtouse.toLowerCase()].Emote;
      name = itemdb.Multiplier[itemtouse.toLowerCase()].Name;
    } else if (itemdb.Other[itemtouse.toLowerCase()]) {
      emote = itemdb.Other[itemtouse.toLowerCase()].Emote;
      name = itemdb.Other[itemtouse.toLowerCase()].Name;
    } else if (itemdb.Collectable[itemtouse.toLowerCase()]) {
      emote = itemdb.Collectable[itemtouse.toLowerCase()].Emote;
      name = itemdb.Collectable[itemtouse.toLowerCase()].Name;
    }

    fullname = `${emote} ${name}`;

    for (var i = 0; i < amount2; i++)
      items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
    userdata.items = items;

    userdata.save();
    await interaction.reply(`Used x${amount2} ${fullname}!`);
  },
};
