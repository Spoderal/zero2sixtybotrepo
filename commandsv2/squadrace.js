const ms = require("pretty-ms");
const discord = require("discord.js");
const squads = require("../squads.json");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("squadrace")
    .setDescription("Race a squad")
    .addStringOption((option) =>
      option
        .setName("squad")
        .setDescription("The squad to race")
        .setRequired(true)
        .addChoice("Flame House", "flamehouse")
        .addChoice("Skull Crunchers", "skullcrunchers")
        .addChoice("The Speed", "thespeed")
        .addChoice("Scrap Heads", "scrapheads")
        .addChoice("Snow Monsters", "snowmonsters")
        .addChoice("Tuner4Life", "tuner4life")
        .addChoice("BikerGang", "bikergang")
        .addChoice("ZeroRacers", "zeroracers")

    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The car id to use")
        .setRequired(true)
    ),
  async execute(interaction) {

      const db = require("quick.db");
      
      const cars = require("../cardb.json");
      let moneyearned = 600;
      let moneyearnedtxt = 600;
      
      let user = interaction.user;
      
      let squad = interaction.options.getString("squad");
      let botlist = [
        "flamehouse",
        "skullcrunchers",
        "thespeed",
        "scrapheads",
        "snowmonsters",
        "tuner4life",
        "bikergang",
        "zeroracers"
      ];
      let timeout = db.fetch(`timeout_${interaction.user.id}`) || 45000;
      
      let racing = db.fetch(`racing_${user.id}`);
      
      if (racing !== null && timeout - (Date.now() - racing) > 0) {
        let time = ms(timeout - (Date.now() - racing), { compact: true });
      
        return interaction.reply(`Please wait ${time} before racing again.`);
      }
      let user1cars = db.fetch(`cars_${user.id}`);
      let idtoselect = interaction.options.getString("id");
      if (!idtoselect)
        return interaction.reply(
          "Specify an id! Use /ids select [id] [car] to select a car!"
        );
      let selected = db.fetch(`selected_${idtoselect}_${user.id}`);
      if (!selected)
        return interaction.reply(
          "That id doesn't have a car! Use /ids select [id] [car] to select it!"
        );
      let errorembed = new discord.MessageEmbed()
        .setTitle("❌ Error!")
        .setColor("#60b0f4");
      if (!user1cars) {
        errorembed.setDescription("You dont have any cars!");
        return interaction.reply({ embeds: [errorembed] });
      }
      
      if (!squad) {
        errorembed.setDescription(
          "Thats not a squad! The available squads are: FlameHouse, SkullCrunchers, TheSpeed, Scrapheads, Tuner4Life, and BikerGang"
        );
        return interaction.reply({ embeds: [errorembed] });
      }
      if (!botlist.includes(squad.toLowerCase())) {
        errorembed.setDescription(
          "Thats not a squad! The available squads are: FlameHouse, SkullCrunchers, TheSpeed, Scrapheads, Tuner4Life, and BikerGang"
        );
        return interaction.reply({ embeds: [errorembed] });
      }
      
      let restoration = db.fetch(
        `${cars.Cars[selected.toLowerCase()].Name}restoration_${user.id}`
      );
      if (cars.Cars[selected.toLowerCase()].Junked && restoration < 100) {
        return interaction.reply("This car is too junked to race, sorry!");
      }
      let beatensquad =
        db.fetch(`${squad.toLowerCase()}_level_${user.id}`) || 1;
      if (!db.fetch(`${squad.toLowerCase()}_level_${user.id}`)) {
        db.set(`${squad.toLowerCase()}_level_${user.id}`, 1);
      }
      if (beatensquad > 5) return interaction.reply(`You've already beat this squad!`);
      let beatenfull = `${squad.toLowerCase()}${beatensquad}`;
      console.log(beatenfull)
      let nametorace = squads.Squads[beatenfull].Name;
      console.log(nametorace);
      
      let botcar = squads.Squads[beatenfull].Car;
      
      console.log(botcar);
      
      db.set(`racing_${user.id}`, Date.now());
      
      let user2carspeed = cars.Cars[botcar.toLowerCase()].Speed;
      
      let user1car = cars.Cars[selected.toLowerCase()].Name;
      let range = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`)
      if(cars.Cars[selected.toLowerCase()].Electric){
        if(range <= 0){
         return interaction.reply(`Your EV is out of range! Run /charge to charge it!`)
       }
      }

      if(range){
       db.subtract(`${cars.Cars[selected.toLowerCase()].Name}range_${interaction.user.id}`, 1)

   }
      let user1carspeed = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`);
      
      let user1carzerosixty =
        db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`) ||
        cars.Cars[selected.toLowerCase()]["0-60"];
      
        if(!db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`)) {
          db.set(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`, cars.Cars[selected.toLowerCase()].Handling)
        }
        let handling = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}handling_${user.id}`) || cars.Cars[selected.toLowerCase()].Handling

        let zero2sixtycar = db.fetch(`${cars.Cars[selected.toLowerCase()].Name}060_${user.id}`)
        let otherzero2sixty = cars.Cars[botcar.toLowerCase()]["0-60"]
        let newhandling = handling / 20
        let bothandling = cars.Cars[botcar.toLowerCase()].Handling
        let othernewhandling = bothandling / 20
        let new60 = user1carspeed / zero2sixtycar
        let new62 = cars.Cars[botcar.toLowerCase()].Speed / otherzero2sixty
        let botspeed = cars.Cars[botcar.toLowerCase()].Speed
        console.log(`Bot handling ${othernewhandling}`)
        let botnewspeed = parseInt(botspeed)
        Number(user1carspeed)
        Number(new60)
        Number(new62)
        Number(newhandling)
        Number(othernewhandling)
        let hp = user1carspeed += newhandling
        let hp2 = botnewspeed + othernewhandling

      let embed = new discord.MessageEmbed()
        .setTitle(`Squad ${squad} race in progress...`)
        .addField(
          `Your ${cars.Cars[selected.toLowerCase()].Emote} ${
            cars.Cars[selected.toLowerCase()].Name
          }`,
          `Speed: ${db.fetch(`${cars.Cars[selected.toLowerCase()].Name}speed_${user.id}`)}\n\n0-60: ${user1carzerosixty}\n\nHandling: ${handling}`
        )
        .addField(
          `${squads.Squads[beatenfull].Name}'s car: ${
            cars.Cars[botcar.toLowerCase()].Emote
          } ${cars.Cars[botcar.toLowerCase()].Name}`,
          `Speed: ${cars.Cars[botcar.toLowerCase()].Speed}\n\n0-60: ${
            cars.Cars[botcar.toLowerCase()]["0-60"]
          }\n\nHandling: ${cars.Cars[botcar.toLowerCase()].Handling}`
        )
        .setColor("#60b0f4")
        .setThumbnail(squads.Squads[squad.toLowerCase()].Icon);
      let msg = await interaction.reply({ embeds: [embed] });
      
      let randomnum = randomRange(2, 4);
      let launchperc = Math.round(hp / randomnum);
      if (randomnum == 2) {
        setTimeout(() => {
          embed.setDescription("Great launch!");
          embed.addField("Bonus", "$100");
          moneyearnedtxt += 100;
          db.add(`cash_${user.id}`, 100);
          interaction.editReply({ embeds: [embed] });
        }, 2000);
      }
      console.log(randomnum);
      
      let tracklength = 0;
      let tracklength2 = 0;
      tracklength += new62
      tracklength2 += new60
      console.log(`Bot hp ${hp2}`)
      let timer = 0;
      let x = setInterval(() => {
        tracklength += hp
          tracklength2 += Number(hp2)
          timer++
          console.log(tracklength)
          console.log(tracklength2)
        if(timer >= 10){
          
          if (tracklength > tracklength2) {
            console.log("End");
            clearInterval(x);
            embed.setTitle("Squad race won!");
            embed.addField("Earnings", `${moneyearnedtxt}`);
            interaction.editReply({ embeds: [embed] });
            if(range){
              db.add(`batteries_${user.id}`, 1)
  
            }
            db.add(`cash_${user.id}`, moneyearned);
            db.set(
              `${squad.toLowerCase()}_level_${user.id}`,
              db.fetch(`${squad.toLowerCase()}_level_${user.id}`) + 1
            );
            return;
          } else if (tracklength2 > tracklength) {
            console.log("End");
            embed.setTitle("Squad race lost!");
            interaction.editReply({embeds: [embed]})
            clearInterval(x);
        
            return;
          }
        }
      }, 1000);
      
      function randomRange(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
      }
  },
};

