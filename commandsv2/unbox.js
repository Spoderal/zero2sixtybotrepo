const lodash = require("lodash");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { toCurrency, randomRange } = require("../common/utils");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("unbox")
    .setDescription("Unbox an import crate")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to unbox")
        .addChoices(
          { name: "Common", value: "common" },
          { name: "Rare", value: "rare" },
          { name: "Exotic", value: "exotic" },
          { name: "Track legends", value: "track" },
          {name: "McLaren", value: "mclaren"},
          {name: "Drift", value: "drift"},
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("list")
        .setDescription(
          "If you want to see the cars you can obtain from the crate"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    let crates = require("../data/imports.json");
    let cars = require("../data/cardb.json");
    let list = [
      "common",
      "rare",
      "exotic",
      "mclaren",
      "track",
      "drift"
    ];

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    if (userdata.tier < 1) {
      return interaction.reply(
        "You need to beat the first squad to use import crates!"
      );
    }

    let bought = interaction.options.getString("crate");
    let listed = interaction.options.getBoolean("list");
    if (listed == true) {
      let cratecontents = crates[bought.toLowerCase()].Contents;
      if(bought == "drift"){
        let filteredcontents = cratecontents.filter(
          (c) => cars.Cars[c.name.toLowerCase()]
        );
        let filt = filteredcontents;
        let carslist = [];
        for (let carin in filt) {
          let car = filt[carin];
  
          let carinside = cars.Cars[car.name.toLowerCase()];
  
  
          carslist.push(`${carinside.Emote} ${carinside.Name}`);
        }
  
        let embed = new EmbedBuilder()
          .setTitle(`Cars inside the ${bought} crate`)
          .setDescription(`${carslist.join("\n")}`)
          .setColor(colors.blue);
        interaction.reply({ embeds: [embed] });
      }
      else {

 

      let filteredcontents = cratecontents.filter(
        (c) => cars.Cars[c.toLowerCase()]
      );
      let filt = filteredcontents;
      let carslist = [];
      for (let carin in filt) {
        let car = filt[carin];

        let carinside = cars.Cars[car.toLowerCase()];


        carslist.push(`${carinside.Emote} ${carinside.Name}`);
      }

      let embed = new EmbedBuilder()
        .setTitle(`Cars inside the ${bought} crate`)
        .setDescription(`${carslist.join("\n")}`)
        .setColor(colors.blue);
      interaction.reply({ embeds: [embed] });

    }
    } else {
      let carsu = userdata.cars;
      if (!bought)
        return await interaction.reply(
          "**To use this command, specify the crate you want to buy. To check what crates are available check the imports shop by sending /imports.**"
        );
      if (!list.includes(bought))
        return await interaction.reply("**That crate isn't available!**");
      let garagelimit = userdata.garagelimit;

      if (carsu.length >= garagelimit)
        return await interaction.reply(
          `Your garage is full! Sell a car or get more garage space.`
        );

        let rarekeys = userdata.rkeys;
        let exotickeys = userdata.ekeys;
        let lekeys = userdata.lekeys;
        let trophy = userdata.raintrophy;
        let driftkeys = userdata.driftKeys || 0;
        let eventkeys = userdata.mKeys;
        let trackkeys = userdata.trackkeys;
        let commonkeys = userdata.ckeys;
  
        if (bought == "common" && commonkeys < 50)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 50 common keys`
          );
        if (bought == "rare" && rarekeys < 30)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 30 rare keys`
          );
        if (bought == "exotic" && exotickeys < 25)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 25 exotic keys`
          );
        if (bought == "drift" && driftkeys < 50)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 50 drift keys`
          );
        if (bought == "mclaren" && eventkeys < 35)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 35 McLaren keys`
          );
          if (bought == "track" && trackkeys < 50)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 50 track keys`
          );
  
  
        if (bought == "le mans" && lekeys < 10)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 10 Le Keys`
          );
        if (bought == "rain" && trophy < 25)
          return await interaction.reply(
            `You dont have enough keys! This crate costs 25 Rain Trophies`
          );
        if (bought == "common") {
          userdata.ckeys -= 50;
        } else if (bought == "rare") {
          userdata.rkeys -= 30;
        } else if (bought == "exotic") {
          userdata.ekeys -= 25;
        } else if (bought == "drift") {
          userdata.driftKeys -= 50;
        } 
        else if (bought == "fools") {
          userdata.foolskeys -= 25;
        } else if (bought == "le mans") {
          userdata.lekeys -= 10;
        } else if (bought == "mclaren") {
          userdata.mKeys -= 35;
        }else if (bought == "track") {
          userdata.trackkeys -= 50;
        }
   
        let cratecontents = crates[bought].Contents;
        if(bought == "drift"){
          let randomchance = randomRange(1, 100)
          let randomitem = cratecontents.filter((c) => c.rarity <= randomchance)
          console.log(randomitem)
          console.log(randomchance)
         let randomitem2 = lodash.sample(randomitem)
          console.log(randomitem2)
          let usercars = userdata.cars;
          let carindb = cars.Cars[randomitem2.name.toLowerCase()];
          let sellprice = carindb.sellprice * 0.35
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
            Resale: sellprice,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };
          if (carindb.Obtained == "Blueprints") {
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
              Blueprints: 0,
              Resale: sellprice,
    
              Gas: 10,
               MaxGas: 10,
            };
          }
          let filtered = usercars.filter((car) => car.Name == carobj.Name);
    
          if (filtered[0]) {
            let price = carindb.sellprice * 0.35;
            userdata.cash += price;
            await interaction.reply(
              `You already own this car, so you got ${toCurrency(price)} instead.`
            );
    
            userdata.save();
            return;
          }
    
          let embedfinal = new EmbedBuilder()
            .setTitle(`Unboxing ${bought} crate...`)
            .setColor(colors.blue);
    
          await interaction.reply({ embeds: [embedfinal] });
          setTimeout(() => {
            if (userdata.cars.length >= userdata.garageLimit) {
              let vault = userdata.vault || []
    
              interaction.channel.send("You garage is full so this car has been sent to your vault!");
         
         
                vault.push(carobj);
                userdata.vault = vault
              
                
              }
              else {
                userdata.cars.push(carobj);
              }
            embedfinal.setTitle(`Unboxed ${bought} crate!`);
            embedfinal.addFields([
              {
                name: `Car`,
                value: `${cars.Cars[randomitem2.name].Emote} ${cars.Cars[randomitem2.name].Name}`,
              },
              {
                name: `ID`,
                value: `${cars.Cars[randomitem2.name].Emote} ${cars.Cars[randomitem2.name].alias}`,
              },
            ]);
            embedfinal.setImage(cars.Cars[randomitem2.name].Image);
            interaction.editReply({ embeds: [embedfinal] });
            userdata.save();
          }, 1000);
        }
        else {

          let randomitem = lodash.sample(cratecontents);
          let usercars = userdata.cars;
          let carindb = cars.Cars[randomitem.toLowerCase()];
          let sellprice = carindb.sellprice * 0.35
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
            Resale: sellprice,
            WeightStat: carindb.Weight,
            Gas: 10,
            MaxGas: 10,
          };
          if (carindb.Obtained == "Blueprints") {
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
              Blueprints: 0,
              Resale: sellprice,
    
              Gas: 10,
               MaxGas: 10,
            };
          }
          let filtered = usercars.filter((car) => car.Name == carobj.Name);
    
          if (filtered[0]) {
            let price = carindb.sellprice * 0.35;
            userdata.cash += price;
            await interaction.reply(
              `You already own this car, so you got ${toCurrency(price)} instead.`
            );
    
            userdata.save();
            return;
          }
    
          let embedfinal = new EmbedBuilder()
            .setTitle(`Unboxing ${bought} crate...`)
            .setColor(colors.blue);
    
          await interaction.reply({ embeds: [embedfinal] });
          setTimeout(() => {
            if (userdata.cars.length >= userdata.garageLimit) {
              let vault = userdata.vault || []
    
              interaction.channel.send("You garage is full so this car has been sent to your vault!");
         
         
                vault.push(carobj);
                userdata.vault = vault
              
                
              }
              else {
                userdata.cars.push(carobj);
              }
            embedfinal.setTitle(`Unboxed ${bought} crate!`);
            embedfinal.addFields([
              {
                name: `Car`,
                value: `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].Name}`,
              },
              {
                name: `ID`,
                value: `${cars.Cars[randomitem].Emote} ${cars.Cars[randomitem].alias}`,
              },
            ]);
            embedfinal.setImage(cars.Cars[randomitem].Image);
            interaction.editReply({ embeds: [embedfinal] });
            userdata.save();
          }, 1000);
        }


    }
  },
};
