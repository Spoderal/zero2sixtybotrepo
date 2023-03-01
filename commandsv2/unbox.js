const lodash = require("lodash");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { invisibleSpace } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");

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
          { name: "McLaren", value: "mclaren" },
          {name: "Drift", value: "drift"}
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
    option
      .setName("list")
      .setDescription("If you want to see the cars you can obtain from the crate")
      .setRequired(false)
  ),
  async execute(interaction) {
    let crates = require("../data/imports.json");
    let cars = require("../data/cardb.json");
    let list = ["common", "rare", "exotic", "drift", "mclaren"];

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let bought = interaction.options.getString("crate");
    let listed = interaction.options.getBoolean("list");
    if(listed == true){
      let cratecontents = crates[bought.toLowerCase()].Contents

      let filteredcontents = cratecontents.filter((c) => cars.Cars[c.toLowerCase()])
      let filt = filteredcontents
      let carslist = []
      for(let carin in filt){
        let car = filt[carin]

        let carinside = cars.Cars[car.toLowerCase()]
        console.log(car)

        carslist.push(`${carinside.Emote} ${carinside.Name}`)
      }

      let embed = new EmbedBuilder()
      .setTitle(`Cars inside the ${bought} crate`)
      .setDescription(`${carslist.join('\n')}`)
      .setColor(colors.blue)
      interaction.reply({embeds: [embed]})
    }
    else {

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
  
      let commonkeys = userdata.ckeys;
      let rarekeys = userdata.rkeys;
      let exotickeys = userdata.ekeys;
  
      let driftkeys = userdata.dkeys2 || 0;
      let ferrarikeys = userdata.fkeys;
  
      if (bought == "common" && commonkeys < 50)
        return await interaction.reply(
          `You dont have enough keys! This crate costs 50 common keys`
        );
      if (bought == "rare" && rarekeys < 25)
        return await interaction.reply(
          `You dont have enough keys! This crate costs 25 rare keys`
        );
      if (bought == "exotic" && exotickeys < 20)
        return await interaction.reply(
          `You dont have enough keys! This crate costs 20 exotic keys`
        );
      if (bought == "drift" && driftkeys < 50)
        return await interaction.reply(
          `You dont have enough keys! This crate costs 50 drift keys`
        );
  
      if (bought == "mclaren" && ferrarikeys < 100)
        return await interaction.reply(
          `You dont have enough keys! This crate costs 100 McLaren keys`
        );
  
      if (bought == "common") {
        userdata.ckeys -= 50;
      } else if (bought == "rare") {
        userdata.rkeys -= 25;
      } else if (bought == "exotic") {
        userdata.ekeys -= 20;
      } else if (bought == "drift") {
        userdata.dkeys2 -= 50;
      } else if (bought == "mclaren") {
        userdata.fkeys -= 100;
      }
  
     
  
  
  
        let cratecontents = crates[bought].Contents;
        let randomitem = lodash.sample(cratecontents);
        let usercars = userdata.cars;
        let carindb = cars.Cars[randomitem.toLowerCase()];
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
          };
        }
        let filtered = usercars.filter((car) => car.Name == carobj.Name);
  
        if (filtered[0]) {
          userdata.cash += 3000;
          await interaction.reply(
            "You already own this car, so you got $3k instead."
          );
  
          userdata.save();
          return;
        }
  
        let embedfinal = new EmbedBuilder()
          .setTitle(`Unboxing ${bought} crate...`)
          .setColor(colors.blue);
  
        await interaction.reply({ embeds: [embedfinal] });
        setTimeout(() => {
          userdata.cars.push(carobj);
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
  },
};
