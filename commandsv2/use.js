const Discord = require("discord.js");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const { toCurrency, randomRange } = require("../common/utils");
const lodash = require("lodash");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const petdb = require("../data/pets.json");
const cratedb = require("../data/cratedb.json");
const partdb = require("../data/partsdb.json");
const titledb = require("../data/titles.json");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const { createCanvas, loadImage } = require("canvas");

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
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setRequired(false)
        .setDescription("Use this if your item requires a user")
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
    let using = userdata.using;
    let emote;
    let name;
    if (
      itemtouse.toLowerCase() !== "gold" &&
      itemdb[itemtouse.toLowerCase()].Type == "Non-Usable"
    )
      return interaction.reply(`Thats not a usable item!`);
    if (
      !items.includes(itemtouse.toLowerCase()) &&
      itemtouse.toLowerCase() !== "gold"
    )
      return interaction.reply("You don't have this item!");
    let filtereduser = items.filter(function hasmany(part) {
      return part === itemtouse.toLowerCase();
    });
    if (amount2 > 50 && itemtouse.toLowerCase() !== "gold")
      return interaction.reply(
        `The max amount you can use in one command is 50!`
      );

    if (amount2 > filtereduser.length && itemtouse.toLowerCase() !== "gold")
      return interaction.reply("You don't have that many of that item!");
    let fullname;

    if (itemdb[itemtouse.toLowerCase()]) {
      fullname = `${itemdb[itemtouse.toLowerCase()].Emote} ${
        itemdb[itemtouse.toLowerCase()].Name
      }`;
    }
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
    } else if (itemtouse.toLowerCase() == "energy drink") {
      userdata.using.push(`energy drink`);
      cooldowndata.energydrink = Date.now();
    } else if (itemtouse.toLowerCase() == "ice cube") {
      console.log(using);
      if (using.includes("ice cube"))
        return interaction.reply("You're already using an ice cube!");
      let chance = randomRange(1, 100);
      if (chance <= 25) {
        interaction.channel.send(
          "You slipped on your ice cube! Your cooldown is now 2x the original cooldown"
        );
      }
      userdata.using.push("ice cube");
      let cooldowns = userdata.eventCooldown;
      userdata.eventCooldown = cooldowns / 2;
    } else if (itemtouse.toLowerCase() == "permission slip") {
      if (userdata.using.includes("permission slip"))
        return interaction.reply("You're already using a permission slip!");
      userdata.using.push(`permission slip`);
      cooldowndata.permissionslip = Date.now();
    } else if (itemtouse.toLowerCase() == "radar") {
      userdata.chased = Date.now();
    } else if (itemtouse.toLowerCase() == "blueberry") {
      userdata.racerank += 1;
    } else if (itemtouse.toLowerCase() == "grape juice") {
      userdata.using.push(`grape juice`);
      cooldowndata.grapejuice = Date.now();
    } else if (itemtouse.toLowerCase() == "apple juice") {
      userdata.using.push(`apple juice`);
      cooldowndata.applejuice = Date.now();
    } else if (itemtouse.toLowerCase() == "orange juice") {
      userdata.using.push(`orange juice`);
      cooldowndata.orangejuice = Date.now();
    } else if (itemtouse.toLowerCase() == "radio") {
      userdata.using.push(`radio`);
      cooldowndata.radio = Date.now();
    } else if (itemtouse.toLowerCase() == "pet collar") {
      cooldowndata.petcollar = Date.now();
    } else if (itemtouse.toLowerCase() == "oil") {
      let oilchance = randomRange(1, 100);

      if (oilchance <= 5) {
        let usercash2 = userdata.cash;

        if ((usercash2 -= 100000) < 0) {
          userdata.cash = 0;
        } else {
          userdata.cash -= 100000;
        }
        setTimeout(async () => {
          await interaction.channel.send(
            "Because you drank the oil you lost $100k to medical bills, dummy!"
          );
        }, 2000);
      }

      userdata.using.push(`oil`);
      cooldowndata.oil = Date.now();
    } else if (itemtouse.toLowerCase() == "flat tire") {
      userdata.using.push(`flat tire`);
      cooldowndata.flattire = Date.now();
    } else if (itemtouse.toLowerCase() == "epic lockpick") {
      userdata.using.push(`epic lockpick`);
      cooldowndata.epiclockpick = Date.now();
    } else if (itemtouse.toLowerCase() == "pet treats") {
      if (!userdata.newpet.name)
        return interaction.reply("You don't have a pet!");
      if (userdata.newpet.xessence >= 20)
        return interaction.reply(
          "Your xessence cap is at 20, you cant give your pet any more treats!"
        );
      userdata.using.push(`pet treats`);
      userdata.newpet.xessence = userdata.newpet.xessence += 1;
      userdata.markModified("newpet");
      cooldowndata.pettreats = Date.now();
    } else if (itemtouse.toLowerCase() == "chips") {
      if (userdata.chips >= 50)
        return interaction.reply("You can only stack up to 50%!");
      userdata.using.push(`chips`);
      userdata.chips += 5;
      cooldowndata.chips = Date.now();
    } else if (itemtouse.toLowerCase() == "fireplace") {
      if (userdata.keepdrift == true)
        return interaction.reply("You already used a fireplace!");
      userdata.keepdrift = true;
    } else if (itemtouse.toLowerCase() == "gas") {
      if (userdata.keeprace == true)
        return interaction.reply("You already used gas!");
      userdata.keeprace = true;
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
    } else if (itemtouse.toLowerCase() == "huge vault") {
      let vault = userdata.vault;
      if (vault)
        return interaction.reply(
          `You already have a vault activated, prestige to deactivate it!`
        );
      userdata.vault = itemtouse.toLowerCase();
    } else if (itemtouse.toLowerCase() == "disguise") {
      userdata.using.push("disguise");
    } else if (itemtouse.toLowerCase() == "pizza") {
      let job = userdata.work;

      if (job == null || !job || job == {})
        return interaction.reply("You don't have a job! Use /job");
      let xpmult = job.xpmult || 0;

      userdata.work.xpmult = xpmult += 0.5;

      userdata.markModified("work");
    } else if (itemtouse.toLowerCase() == "veggie pizza") {
      let job = userdata.work;

      if (job == null || !job || job == {})
        return interaction.reply("You don't have a job! Use /job");

      userdata.work.salary += 500;

      userdata.markModified("work");
    } else if (itemtouse.toLowerCase() == "milk") {
      userdata.using.push("milk");
      cooldowndata.milk = Date.now();
    } else if (itemtouse.toLowerCase() == "chocolate milk") {
      userdata.using.push("chocolate milk");
      cooldowndata.cmilk = Date.now();
    } else if (itemtouse.toLowerCase() == "strawberry milk") {
      userdata.using.push("strawberry milk");
      cooldowndata.smilk = Date.now();
    } else if (itemtouse.toLowerCase() == "taser") {
      userdata.canrob = false;
      cooldowndata.canrob = Date.now();

      userdata.markModified("work");
    } else if (itemtouse.toLowerCase() == "secret brief case") {
      if (userdata.work.name !== "Police")
        return interaction.reply(
          "You need to be a police officer to use this item!"
        );
      userdata.bounty += 1000;
    } else if (itemtouse.toLowerCase() == "tequila shot") {
      let chance = randomRange(1, 100);

      if (chance <= 10) {
        userdata.itemeffects.push({ item: "tequila shot", earning: "bad" });
      } else {
        userdata.itemeffects.push({ item: "tequila shot", earning: "good" });
      }
      cooldowndata.tequila = Date.now();

      userdata.markModified("itemeffects");
    } else if (itemtouse.toLowerCase() == "dirt") {
      let timeout = 3600000;
      if (
        cooldowndata.dirt !== null &&
        timeout - (Date.now() - cooldowndata.dirt) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata.dirt));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can use dirt again in ${time}`);
        return await interaction.reply({
          embeds: [timeEmbed],
          fetchReply: true,
        });
      }
      let chance = randomRange(1, 100);

      if (chance <= 25) {
        userdata.canrace = Date.now();
        interaction.reply(
          "Your dirt flew back in your face and now you can't race for 10 minutes!"
        );

        cooldowndata.dirt = Date.now();
        cooldowndata.save();
        for (var i = 0; i < amount2; i++)
          items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
        userdata.items = items;

        userdata.save();
        return;
      } else {
        let usertothrow = interaction.options.getUser("user");

        if (!usertothrow)
          return interaction.reply("You need to specify a user!");

        let userdatathrow = await User.findOne({ id: usertothrow.id });

        userdatathrow.canrace = Date.now();

        userdatathrow.save();
        cooldowndata.dirt = Date.now();
        cooldowndata.save();
        for (var i2 = 0; i2 < amount2; i2++)
          items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
        userdata.items = items;
        userdata.save();
        interaction.reply(
          `${usertothrow}, ${interaction.user} threw dirt at you and now you cant race for 10 minutes!`
        );
        return;
      }
    } else if (itemtouse.toLowerCase() == "pet egg") {
      let petsarr = [];
      for (let pet in petdb) {
        petsarr.push(petdb[pet]);
      }
      let randcat = lodash.sample(petsarr);
      console.log(randcat);
      let pet = userdata.newpet;
      if (pet.name) return interaction.reply(`You already have a pet!`);
      let petindb = petdb[randcat.Breed.toLowerCase()];
      let randname = lodash.sample(petindb.Names);

      let petobj = {
        name: randname,
        hunger: 100,
        thirst: 100,
        love: 100,
        pet: petdb[randcat.Breed.toLowerCase()].Breed.toLowerCase(),
        xessence: 5,
      };
      for (var p = 0; p < amount2; p++)
        items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = items;
      userdata.newpet = petobj;
      userdata.save();

      return await interaction.reply(
        `You found a ${petindb.Breed} named ${randname}!`
      );
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
      await Cooldowns.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            canrace: 0,
            racing: 0,
            drifting: 0,
            waterbottle: Date.now(),
          },
        }
      );
      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            canrace: 0,
          },
        }
      );

      cooldowndata.markModified();
    } else if (itemtouse.toLowerCase() == "zero bar") {
      let effects = itemdb["zero bar"].Effects;

      let randomeffect = lodash.sample(effects);

      if (randomeffect == "One of your cars just got +1 speed") {
        let randomcar = lodash.sample(userdata.cars);
        randomcar.Speed += 1;
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
      } else if (randomeffect == "One of your cars just got +1 acceleration") {
        let randomcar = lodash.sample(userdata.cars);
        randomcar.Acceleration += 1;
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
        randomcar.Handling -= 20;
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
        randomcar.Speed += 5;
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
          let mult = prestige * 0.05;

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
    } else if (cratedb.Crates[itemtouse.toLowerCase()]) {
      let pfps = require("../data/pfpsdb.json");
      let crates = require("../data/cratedb.json");

      let inv = userdata.items;
      let cooldown = 10000;
      let cratecool = cooldowndata.crate;
      if (cratecool !== null && cooldown - (Date.now() - cratecool) > 0) {
        let time = ms(cooldown - (Date.now() - cratecool));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`Please wait ${time} before opening another crate.`);
        await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
        return;
      }
      let boughtindb = crates.Crates[itemtouse.toLowerCase()];
      console.log(boughtindb);

      let embed = new EmbedBuilder()
        .setTitle(`Unboxing ${boughtindb.Emote} ${boughtindb.Name}...`)
        .setColor(`#60b0f4`);

      interaction.reply({ embeds: [embed] });
      for (var s = 0; s < 1; s++)
        inv.splice(inv.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = inv;
      userdata.update();
      cooldowndata.crate = Date.now();
      cooldowndata.save();
      const canvas = createCanvas(1280, 720);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage("https://i.ibb.co/6WwF0gJ/crateunbox.png");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      let x = 0;
      let rewards = [];
      let i = setInterval(() => {
        x++;
        let reward = lodash.sample(boughtindb.Contents);
        rewards.push(reward);

        if (x == 3) {
          clearInterval(i);
        }
      }, 1000);

      setTimeout(async () => {
        let reward1 = rewards[0];
        let reward2 = rewards[1];
        let reward3 = rewards[2];

        let name1;
        let name2;
        let name3;
        if (pfps.Pfps[reward1]) {
          let helmetimg = pfps.Pfps[reward1].Image;
          name1 = pfps.Pfps[reward1].Name;
          let loadedhelm = await loadImage(helmetimg);

          ctx.drawImage(loadedhelm, 150, 200, 150, 150);
          ctx.save();
          userdata.pfps.push(name1.toLowerCase());
        }
        if (pfps.Pfps[reward2]) {
          let helmetimg = pfps.Pfps[reward2].Image;
          name2 = pfps.Pfps[reward2].Name;
          let loadedhelm = await loadImage(helmetimg);

          ctx.drawImage(loadedhelm, 570, 200, 150, 150);
          ctx.save();
          userdata.pfps.push(name2.toLowerCase());
        }
        if (pfps.Pfps[reward3]) {
          let helmetimg = pfps.Pfps[reward3].Image;
          name3 = pfps.Pfps[reward3].Name;
          let loadedhelm = await loadImage(helmetimg);

          ctx.drawImage(loadedhelm, 970, 200, 150, 150);
          ctx.save();
          userdata.pfps.push(name3.toLowerCase());
        }

        ctx.restore();
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "#00000";
        let imageload = await loadImage("https://i.ibb.co/y8RDM5v/cash.png");

        if (reward1.endsWith(`Cash`)) {
          let amount = Number(reward1.split(" ")[0]);
          name1 = `${amount} Cash`;
          ctx.drawImage(imageload, 150, 200, 150, 150);
          userdata.cash += amount;
        }

        if (reward2.endsWith(`Cash`)) {
          let amount2 = Number(reward2.split(" ")[0]);
          name2 = `${amount2} Cash`;
          ctx.drawImage(imageload, 570, 200, 150, 150);
          userdata.cash += amount2;
        }

        if (reward3.endsWith(`Cash`)) {
          let amount3 = Number(reward3.split(" ")[0]);
          name3 = `${amount3} Cash`;
          ctx.drawImage(imageload, 970, 200, 150, 150);
          userdata.cash += amount3;
        }

        if (titledb[reward1]) {
          name1 = titledb[reward1].Title;
          userdata.titles.push(name1.toLowerCase());
        }
        if (titledb[reward2]) {
          name2 = titledb[reward2].Title;
          userdata.titles.push(name2.toLowerCase());
        }
        if (titledb[reward3]) {
          name3 = titledb[reward3].Title;
          userdata.titles.push(name3.toLowerCase());
        }

        if (partdb.Parts[reward1]) {
          let partimg = partdb.Parts[reward1].Image;
          name1 = partdb.Parts[reward1].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 150, 200, 150, 150);
          ctx.save();
          userdata.parts.push(name1.toLowerCase());
        }
        if (partdb.Parts[reward2]) {
          let partimg = partdb.Parts[reward2].Image;
          name2 = partdb.Parts[reward2].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 570, 200, 150, 150);
          ctx.save();
          userdata.parts.push(name2.toLowerCase());
        }
        if (partdb.Parts[reward3]) {
          let partimg = partdb.Parts[reward3].Image;
          name3 = partdb.Parts[reward3].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 970, 200, 150, 150);
          ctx.save();
          userdata.parts.push(name3.toLowerCase());
        }

        userdata.save();
        ctx.fillText(name1, 100, 565);
        ctx.fillText(name2, 520, 565);
        ctx.fillText(name3, 920, 565);

        let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        embed.setImage(`attachment://profile-image.png`);
        console.log(rewards);
        await interaction.editReply({ embeds: [embed], files: [attachment] });
      }, 5000);
    }
    if (!cratedb.Crates[itemtouse.toLowerCase()]) {
      if (itemdb[itemtouse.toLowerCase()]) {
        emote = itemdb[itemtouse.toLowerCase()].Emote;
        name = itemdb[itemtouse.toLowerCase()].Name;
      }

      fullname = `${emote} ${name}`;

      for (var i5 = 0; i5 < amount2; i5++)
        items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = items;
      cooldowndata.save();
      userdata.save();
      if (itemdb[itemtouse.toLowerCase()].Used) {
        let randommessage = lodash.sample(itemdb[itemtouse.toLowerCase()].Used);

        await interaction.reply(
          `${randommessage}\n\nUsed x${amount2} ${fullname}!`
        );
      } else {
        await interaction.reply(`Used x${amount2} ${fullname}!`);
      }
    }
  },
};
