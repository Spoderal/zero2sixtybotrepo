const Discord = require("discord.js");
const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const colors = require("../common/colors");
const {  randomRange, numberWithCommas } = require("../common/utils");
const lodash = require("lodash");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cratedb = require("../data/cratedb.json");
const { EmbedBuilder } = require("discord.js");
const cardb = require("../data/cardb.json")

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
      return await interaction.reply(`Thats not a usable item!`);
    if (
      !items.includes(itemtouse.toLowerCase()) &&
      itemtouse.toLowerCase() !== "gold"
    )
      return await interaction.reply("You don't have this item!");
    let filtereduser = items.filter(function hasmany(part) {
      return part === itemtouse.toLowerCase();
    });
    if (amount2 > 50 && itemtouse.toLowerCase() !== "gold")
      return await interaction.reply(
        `The max amount you can use in one command is 50!`
      );

    if (amount2 > filtereduser.length && itemtouse.toLowerCase() !== "gold")
      return await interaction.reply("You don't have that many of that item!");
    let fullname;

    if (itemdb[itemtouse.toLowerCase()]) {
      fullname = `${itemdb[itemtouse.toLowerCase()].Emote} ${
        itemdb[itemtouse.toLowerCase()].Name
      }`;
    }
    if (itemtouse.toLowerCase() == "pink slip") {
      userdata.pinkslips += 1;
    } 
    else if (itemtouse.toLowerCase() == "comet") {
      userdata.seriestickets += 1;
    }
    
else if (itemtouse.toLowerCase() == "energy drink") {
      userdata.using.push(`energy drink`);
      cooldowndata.energydrink = Date.now();
    } else if (itemtouse.toLowerCase() == "ice cube") {

      if (using.includes("ice cube"))
        return await interaction.reply("You're already using an ice cube!");
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
        return await interaction.reply("You're already using a permission slip!");
      userdata.using.push(`permission slip`);
      cooldowndata.permissionslip = Date.now();
    } else if (itemtouse.toLowerCase() == "radar") {
      userdata.chased = Date.now();
    } else if (itemtouse.toLowerCase() == "blueberry") {
      userdata.xp += 100;
      let skill = userdata.skill
      let requiredxp  =skill * 100
      if(userdata.xp >= requiredxp){
        userdata.skill += 1
        userdata.xp = 0
      }
    } 
    else if (itemtouse.toLowerCase() == "cash bomb") {
      giveRandomCash(interaction, interaction.channel.members);
      
    } 
    else if (itemtouse.toLowerCase() == "grape juice") {
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
    } 
    else if (itemtouse.toLowerCase() == "reverse card") {
      userdata.using.push(`reverse card`);
      cooldowndata.reverse = Date.now();
    } 
    else if (itemtouse.toLowerCase() == "epic lockpick") {
      userdata.using.push(`epic lockpick`);
      cooldowndata.epiclockpick = Date.now();
    }  else if (itemtouse.toLowerCase() == "chips") {
      if (userdata.chips >= 50)
        return await interaction.reply("You can only stack up to 50%!");
      userdata.using.push(`chips`);
      userdata.chips += 5;
      cooldowndata.chips = Date.now();
    } else if (itemtouse.toLowerCase() == "fireplace") {
      if (userdata.keepdrift == true)
        return await interaction.reply("You already used a fireplace!");
      userdata.keepdrift = true;
    } else if (itemtouse.toLowerCase() == "gas") {
      if (userdata.keeprace == true)
        return await interaction.reply("You already used gas!");
      userdata.keeprace = true;
    } else if (itemtouse.toLowerCase() == "sponsor") {
      userdata.using.push(`sponsor`);
      cooldowndata.sponsor = Date.now();
    } else if (itemtouse.toLowerCase() == "small vault") {
      let vault = userdata.vaultuse;
      if (vault)
        return await interaction.reply(
          `You already have a vault activated, prestige to deactivate it!`
        );
      userdata.vaultuse = itemtouse.toLowerCase();
    } else if (itemtouse.toLowerCase() == "medium vault") {
      let vault = userdata.vaultuse;
      if (vault)
        return await interaction.reply(
          `You already have a vault activated, prestige to deactivate it!`
        );
      userdata.vaultuse = itemtouse.toLowerCase();
    } else if (itemtouse.toLowerCase() == "large vault") {
      let vault = userdata.vaultuse;
      if (vault)
        return await interaction.reply(
          `You already have a vault activated, prestige to deactivate it!`
        );
      userdata.vaultuse = itemtouse.toLowerCase();
    } else if (itemtouse.toLowerCase() == "huge vault") {
      let vault = userdata.vaultuse;
      if (vault)
        return await interaction.reply(
          `You already have a vault activated, prestige to deactivate it!`
        );
      userdata.vaultuse = itemtouse.toLowerCase();
    } else if (itemtouse.toLowerCase() == "disguise") {
      userdata.using.push("disguise");
    } else if (itemtouse.toLowerCase() == "pizza") {
      let job = userdata.work;

      if (job == null || !job || job == {})
        return await interaction.reply("You don't have a job! Use /job");
      let xpmult = job.xpmult || 0;

      userdata.work.xpmult = xpmult += 0.5;

      userdata.markModified("work");
    } else if (itemtouse.toLowerCase() == "veggie pizza") {
      let job = userdata.work;

      if (job == null || !job || job == {})
        return await interaction.reply("You don't have a job! Use /job");

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
        return await interaction.reply(
          "You need to be a police officer to use this item!"
        );
      userdata.bounty += 1000;
    } else if (itemtouse.toLowerCase() == "tequila shot") {
      let chance = randomRange(1, 100);
      console.log(chance)
      if (chance <= 10) {
        let cash = userdata.cash

        if(cash - 50000 < 0){
          userdata.cash = 0
        }
        else {
          userdata.cash -= 50000
          
          
        }
        interaction.channel.send("You lost $50K!")

      } else {
        console.log("done")
        userdata.using.push("tequila shot")
        cooldowndata.tequilla = Date.now();
      }
      for (var i5 = 0; i5 < amount2; i5++) items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = items;
      userdata.save()
      cooldowndata.save()
      let randommessage = lodash.sample(itemdb[itemtouse.toLowerCase()].Used);

      return await interaction.reply(
        `${randommessage}\n\nUsed x${amount2} ${fullname}!`
      );
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
          return await interaction.reply("You need to specify a user!");

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
    } 
    else if (itemtouse.toLowerCase() == "snowball") {
  
       
        let usertothrow = interaction.options.getUser("user");

        if (!usertothrow)  return await interaction.reply("You need to specify a user!");

        let userdatathrow = await User.findOne({ id: usertothrow.id });


      let prompts = ["now you gained $1K, woohoo!", "now you lost $1K, womp womp.", "brrrr cold", "throw it back or you're a chicken!"]

      let promp = lodash.sample(prompts)

      if(promp == "now you gained $1K, woohoo!"){
        userdatathrow.cash += 1000
      }
      if(promp == "now you lost $1K, womp womp."){
        let u2cash = userdatathrow.cash
        if((u2cash -= 1000) < 0){
          userdatathrow.cash = 0
        }
        else {
          userdatathrow.cash -= 1000

        }
      }
        for (var i3 = 0; i3 < amount2; i3++) items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
        userdata.items = items;
        userdata.save();
        userdatathrow.save()
        interaction.reply(
          `${usertothrow}, ${interaction.user} threw a ${itemdb.snowball.Emote} snowball at you, ${promp}`
        );
        return;
      
    }
    
  else if (itemtouse.toLowerCase() == "water bottle") {
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
    } 
    else if (itemtouse.toLowerCase() == "deodorant") {
      let watercooldown = cooldowndata.deodorant;
      let timeout = 60000;
      if (
        watercooldown !== null &&
        timeout - (Date.now() - watercooldown) > 0
      ) {
        let time = ms(timeout - (Date.now() - watercooldown));
        let timeEmbed = new Discord.EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can use deodorant again in ${time}.`);
        return await interaction.reply({ embeds: [timeEmbed] });
      }
      await Cooldowns.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            waterbottle: 0,
            deodorant: Date.now(),
          },
        }
      );

      cooldowndata.markModified();
    } 
    else if (itemtouse.toLowerCase() == "swan note") {
      let randomcar = ["Nothing", "2023 dodge challenger srt demon 170", "Nothing", "Nothing", "Nothing", "2023 maserati granturismo folgore", "Nothing", "Nothing", "Nothing", "2015 mitsubishi lancer evo x", "Nothing", "Nothing", "2023 audi tt roadster", "Nothing", "2023 audi r8 gt", "Nothing", "Nothing", "Nothing", "2024 chevrolet camaro zl1"]
      for (var i8 = 0; i8 < amount2; i8++) items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = items;
      let rand= lodash.sample(randomcar)

      if(rand == "Nothing"){
        userdata.save()
        return await interaction.reply(`You used a swan note and found nothing`)

      }
      else {
        let carindb = cardb.Cars[rand.toLowerCase()]
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
          Gas: 10,
          MaxGas: 10,
          WeightStat: carindb.Weight,
        };

        if (userdata.cars.length >= userdata.garageLimit) {
          let vault = userdata.vault || []

          interaction.channel.send("You garage is full so this car has been sent to your vault!");
     
            console.log("pushed")
            vault.push(carobj);
            userdata.vault = vault
            userdata.save();
          
            
          }
          else {
            userdata.cars.push(carobj);
            userdata.save();
          }
         return await interaction.reply(`You used a swan note and found the ${cardb.Cars[rand.toLowerCase()].Emote} ${cardb.Cars[rand.toLowerCase()].Name}`)
    }
    }
    else if (itemtouse.toLowerCase() == "zero bar") {
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

        interaction.channel.send(`${randomcar.Name} was effected!`)

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
        interaction.channel.send(`${randomcar.Name} was effected!`)
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
        interaction.channel.send(`${randomcar.Name} was effected!`)
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
        interaction.channel.send(`${randomcar.Name} was effected!`)
        userdata.update();
      } else if (randomeffect == "You stink, no effect for you") {
        return await interaction.reply(`${randomeffect}`);
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
      else if (randomeffect == "You just earned $500!") {
        let cash = 500;
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
      else if (randomeffect == "You cant race for 10 minutes, HAH!") {
        
        userdata.racedisabled = true
        cooldowndata.racedisabled = Date.now()
        userdata.update();
        cooldowndata.update()
        cooldowndata.save()
      }
      else if (randomeffect == "All of your cooldowns have been cleared") {
        
  
        cooldowndata.racedisabled = 0
        cooldowndata.racing = 0
        cooldowndata.dragracing = 0
        cooldowndata.trackracing = 0
        cooldowndata.daily = 0
        cooldowndata.weekly = 0
        cooldowndata.drift = 0
        cooldowndata.pvp = 0
        cooldowndata.save()
        userdata.update();
      }
      else if (randomeffect == "I'm picking a number between 1 and 10000, you're being sued for this amount") {
        
        let randomnum = randomRange(1, 10000)
        let oldcash = userdata.cash
        if(oldcash < 0){
          userdata.cash = 0
        }
        else {

          userdata.cash -= randomnum
        }


        userdata.update()
  
        await interaction.channel.send(`You just lost $${numberWithCommas(randomnum)}`)
      }

      else if (randomeffect == "I'm picking a number between 1 and 10000, you won this amount!") {
        
        let randomnum = randomRange(1, 10000)

        userdata.cash += randomnum

        userdata.update()
  
        await interaction.channel.send(`You just won $${numberWithCommas(randomnum)}`)
      }
      else if (randomeffect == "You won the Dead Car") {
        
        let car = cardb.Cars["dead car"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
      else if (randomeffect == "You won the Patty Wagon") {
        
        let car = cardb.Cars["patty wagon"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
      else if (randomeffect == "You won the Scary Mclarey") {
        
        let car = cardb.Cars["scary mclarey"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
      else if (randomeffect == "You won the Zombie Crusher") {
        
        let car = cardb.Cars["zombie crusher"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
      else if (randomeffect == "You won the Batmobile") {
        
        let car = cardb.Cars["batmobile"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
      else if (randomeffect == "You won the Ectomobile") {
        
        let car = cardb.Cars["the ectomobile"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.cars.update()
      }
      else if (randomeffect == "You won Christine") {
        
        let car = cardb.Cars["christine"]
        let obj = {
          ID: car.alias,
          Name: car.Name,
          Speed: car.Speed,
          Acceleration: car["0-60"],
          Handling: car.Handling,
          Parts: [],
          Emote: car.Emote,
          Image: car.Image,
          Miles: 0,
          Drift: 0,
          WeightStat: car.Weight,
          Gas: 10,
          MaxGas: 10,
        };

        let cars = userdata.cars
        let filteredobj = cars.filter((car)=> car.Name == obj.Name)
        if(!filteredobj[0]){
          userdata.cars.push(obj)
        }
        userdata.update()
      }
       items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
      userdata.items = items;
      userdata.save();
      interaction.reply(`${randomeffect}`);

      return;
    }
    if (!cratedb.Crates[itemtouse.toLowerCase()]) {
      if (itemdb[itemtouse.toLowerCase()]) {
        emote = itemdb[itemtouse.toLowerCase()].Emote;
        name = itemdb[itemtouse.toLowerCase()].Name;
      }

      fullname = `${emote} ${name}`;

      for (var i7 = 0; i7 < amount2; i7++) items.splice(items.indexOf(itemtouse.toLowerCase()), 1);
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

async function giveRandomCash(interaction, users) {
  console.log(users)
  let userarr = users.map((user) => user.user)
  console.log(userarr)
  const randomUser = lodash.sample(userarr);
  const randomAmount = Math.floor(Math.random() * 100000) + 1; // Random amount between 1 and 1000
  console.log(randomUser)
  let userdata = await User.findOne({ id: randomUser.id });

  if(userdata){
    userdata.cash += randomAmount;
    userdata.save()

  }


  return await interaction.channel.send(
    `You gave ${randomUser} $${randomAmount}!`
  );
}