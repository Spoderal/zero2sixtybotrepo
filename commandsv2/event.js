

const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  StringSelectMenuBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
let seasondb = require("../data/seasons.json");
const { emotes } = require("../common/emotes");
const Global = require("../schema/global-schema");
const cardb = require("../data/cardb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Check the current events"),
  async execute(interaction) {
    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("No event selected")
        .addOptions([
          {
            label: "Season 4",
            description: "Information for the Season 4 Z Pass",
            value: "spring_event",
            customId: "spring",
            emoji: "<:season4_icon:1211169992213794827>",
          },
          {
            label: "Le Mans",
            description: "Information for the Le Mans event",
            value: "event_3",
            customId: "event_3",
            emoji: "🏆"
          },
          {
            label: "Space Race",
            description: "Information for the Le Mans event",
            value: "event_4",
            customId: "event_4",
            emoji: "🚀"
          }
        ])
    );

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Season 4 <:season4_icon:1211169992213794827>
          Le Mans 🏆
          Space Race 🚀
      `);

    embed.setColor(colors.blue);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2],
      fetchReply: true,
    });

    if(userdata.tutorial && userdata.tutorial.type == "season" && userdata.tutorial.stage == 1){
      let tut = userdata.tutorial
      tut.stage += 1
      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "tutorial": tut,
          },
        },

      );
      userdata.save()
      interaction.channel.send(`**TUTORIAL**: There's many events here, but we're just going to focus on seasons for now. Click on season 4 on the drop down menu to get started.`)
    }

    const filter = (interaction2) =>
      interaction2.isSelectMenu() &&
      interaction2.user.id === interaction.user.id;

    const collector = msg.createMessageComponentCollector({
      filter,
      time: 1000 * 15,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];
      if (value === "spring_event") {
        embed.setTitle("Season 4");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the fourth season on Zero2Sixty!

            Welcome to spring! The snow is melting and the flowers are blooming. With a whole new Z Pass, and new cars, you can't miss out on this season!

            Try out the new PERMANENT race, Offroad, where you will need AWD, and lots of weight to get notoriety!

            Earn notoriety from offroad, and use that towards the Z Pass in /season!

            **Ends May 31st 2024**

                  `);
        embed.setThumbnail(seasondb.Seasons.Spring.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/dr0Q9Hq/season4-image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
        if(userdata.tutorial && userdata.tutorial.type == "season" && userdata.tutorial.stage == 2){
          let tut = userdata.tutorial
          tut.stage += 1
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "tutorial": tut,
              },
            },
    
          );
          userdata.save()
          interaction.channel.send(`**TUTORIAL**: Every time the season in real life changes, for example spring, the season in the game changes too. You can earn notoriety from the race specified above to get cool prizes! Lets see what prizes we can get with \`/season\``)
        }
      } 
     else if (value === "event_4") {
        embed.setTitle("Space Race");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome back to space!

            You'll need some space tires to race in space, so check out the parts shop to find them in /dealer parts

            Earn parts to make an EPIC ROCKET ENGINE! This is the last time this engine will be obtainable. Super and regular rocket engines are back in rotation in super wheelspins

            There's also a chance you'll meet the 2019 Apollo IE in /race spacerace so be prepared! If you beat it, you keep it!

            **You only get 1 epic rocket engine, so use it wisely!**

            Requirements to fuse a rocket engine into an epic rocket engine:
            * 1 Rocket Engine\n
            * 1 Nuclear Core\n
            * 1 Metal Frame\n
            * 1 Zionite Pistons\n
            * 1 Alien Oil\n
            * 1 Car Hook\n
            * 1 Heat Panels\n

            **Ends June 3rd 2024**

                  `);
        embed.setThumbnail()
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/r41k5nv/event-spacerace.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
        if(userdata.tutorial && userdata.tutorial.type == "season" && userdata.tutorial.stage == 2){
          let tut = userdata.tutorial
          tut.stage += 1
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "tutorial": tut,
              },
            },
    
          );
          userdata.save()
          interaction.channel.send(`**TUTORIAL**: Every time the season in real life changes, for example spring, the season in the game changes too. You can earn notoriety from the race specified above to get cool prizes! Lets see what prizes we can get with \`/season\``)
        }
      } 
  
  
      else if (value === "event_3") {
        let globals = await Global.findOne({});
        let teams = globals.leteams
        let porscheteam = teams.find(t => t.name == "Porsche")
        let auditeam = teams.find(t => t.name == "Audi")
        let toyotateam = teams.find(t => t.name == "Toyota")
        let ferrariteam = teams.find(t => t.name == "Ferrari")
        let row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("team")
            .setPlaceholder("Select a team")
            .addOptions([
              {
                label: "Porsche",
                description: "Select the Porsche team",
                value: "porsche",
                customId: "porsche",
                emoji: "<:porsche:931011550880338011>",
              },
              {
                label: "Audi",
                description: "Select the Audi team",
                value: "audi",
                customId: "audi",
                emoji: "<:audi:931011548758048828>",
              },
              {
                label: "Toyota",
                description: "Select the Toyota team",
                value: "toyota",
                customId: "toyota",
                emoji: "<:toyota:931012829283233883>",
              },
              {
                label: "Ferrari",
                description: "Select the Ferrari team",
                value: "ferrari",
                customId: "ferrari",
                emoji: "<:ferrari:931011838374727730>",
              },
            ])
        );

        embed.setTitle("Track Legends");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome back to the Le Mans event!

        Welcome to the Le Mans event! This event is all about speed and handling

        Select a team to race for below and earn their car to start racing!

        Use Le Mans cars when track racing to earn points for your selected team, if your team has the most points at the end of the event it'll get its own special brand event, and everyone in the team gets their skill rank * 10,000 in cash!

        You can also earn Le Mans keys by racing with Le Mans cars to unlock more Le Mans cars

        **Ends June 1st 2024**

        **Teams**
        __Porsche__
        Wins: ${porscheteam.wins}
        Members: ${porscheteam.members.length}
        +$5K Per Track race win with a Porsche
        __Audi__
        Wins: ${auditeam.wins}
        Members: ${auditeam.members.length}
        +$5K Per Drag race win with a Audi
        __Toyota__
        Wins: ${toyotateam.wins}
        Members: ${toyotateam.members.length}
        +$5K Per Drift win with a Toyota
        __Ferrari__
        Wins: ${ferrariteam.wins}
        Members: ${ferrariteam.members.length}
        +$5K Per Street race win with a Ferrari

        `)
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/XXD1Xxm/lemans.png")

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row],
        });
      } 
      else if(value == "porsche"){
        let globals = await Global.findOne({});
        let team1 = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]

        if(team1) return await interaction.editReply({content: "You are already in a team!"})
        let teams = globals.leteams
        embed.setTitle(`<:porsche:931011550880338011> Team Porsche`)
        embed.setDescription(`Welcome to Team Porsche! We strive for perfect engineering with a balance between handling, and power. You can earn points for the Porsche team by racing with a 2023 Porsche 963 in track races\n\n__Perks__\n- +$5K per track race win, regardless of difficulty with any Porsche\nYou earned a new car!\n<:porsche:931011550880338011> 2023 Porsche 963`)
        embed.setImage("https://i.ibb.co/6DV7jzB/pickporsche.png")
        teams.find(t => t.name == "Porsche").members.push(interaction.user.id)

        globals.leteams = teams
        let carobj = {
          ID: cardb.Cars["2023 porsche 963"].alias,
          Name: cardb.Cars["2023 porsche 963"].Name,
          Speed: cardb.Cars["2023 porsche 963"].Speed,
          Acceleration: cardb.Cars["2023 porsche 963"]["0-60"],
          Handling: cardb.Cars["2023 porsche 963"].Handling,
          WeightStat: cardb.Cars["2023 porsche 963"].Weight,
          Emote: cardb.Cars["2023 porsche 963"].Emote,
          Livery: cardb.Cars["2023 porsche 963"].Image,
          Resale: cardb.Cars["2023 porsche 963"].sellprice,
          Miles: 0,
          Gas: 10,
          MaxGas: 10,
        }

        userdata.cars.push(carobj)
        userdata.save()
        globals.markModified("leteams")

        await globals.save()
        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });

      }
      else if(value == "toyota"){
        let globals = await Global.findOne({});
        let team1 = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]

        if(team1) return await interaction.editReply({content: "You are already in a team!"})
        let teams = globals.leteams
        embed.setTitle(`<:toyota:931012829283233883> Team Toyota`)
        embed.setDescription(`Welcome to Team Toyota! We strive for the best balance. You can earn points for the Toyota team by racing with a 2023 Toyota GR010 Hybrid in track races\n\n__Perks__\n- +$5K per drift race win, regardless of difficulty with any Toyota\n\nYou earned a new car!\n<:toyota:931012829283233883> 2012 Toyota TS030 Hybrid`)
        embed.setImage("https://i.ibb.co/HKnhKCc/picktoyota.png")
        teams.find(t => t.name == "Toyota").members.push(interaction.user.id)

        globals.leteams = teams
        let carobj = {
          ID: cardb.Cars["2023 toyota gr010 hybrid"].alias,
          Name: cardb.Cars["2023 toyota gr010 hybrid"].Name,
          Speed: cardb.Cars["2023 toyota gr010 hybrid"].Speed,
          Acceleration: cardb.Cars["2023 toyota gr010 hybrid"]["0-60"],
          Handling: cardb.Cars["2023 toyota gr010 hybrid"].Handling,
          WeightStat: cardb.Cars["2023 toyota gr010 hybrid"].Weight,
          Emote: cardb.Cars["2023 toyota gr010 hybrid"].Emote,
          Livery: cardb.Cars["2023 toyota gr010 hybrid"].Image,
          Resale: cardb.Cars["2023 toyota gr010 hybrid"].sellprice,
          Miles: 0,
          Gas: 10,
          MaxGas: 10,
        }

        userdata.cars.push(carobj)
        userdata.save()
        globals.markModified("leteams")

        await globals.save()
        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });

      }
      else if(value == "audi"){
        let globals = await Global.findOne({});
        let team1 = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]

        if(team1) return await interaction.editReply({content: "You are already in a team!"})
        let teams = globals.leteams
        embed.setTitle(`<:audi:931011548758048828> Team Audi`)
        embed.setDescription(`Welcome to Team Audi! We strive for the absolute best handling. You can earn points for the Audi team by racing with a 2014 Audi R18 E Tron in track races\n\n__Perks__\n- +$5K per drag race win, regardless of difficulty with any Aud\n\nYou earned a new car!\n<:audi:931011548758048828> 2014 Audi R18 E Tron`)
        embed.setImage("https://i.ibb.co/kMQZS0n/pickaudi.png")
        teams.find(t => t.name == "Audi").members.push(interaction.user.id)

        globals.leteams = teams

        let carobj = {
          ID: cardb.Cars["2014 audi r18 e tron"].alias,
          Name: cardb.Cars["2014 audi r18 e tron"].Name,
          Speed: cardb.Cars["2014 audi r18 e tron"].Speed,
          Acceleration: cardb.Cars["2014 audi r18 e tron"]["0-60"],
          Handling: cardb.Cars["2014 audi r18 e tron"].Handling,
          WeightStat: cardb.Cars["2014 audi r18 e tron"].Weight,
          Emote: cardb.Cars["2014 audi r18 e tron"].Emote,
          Livery: cardb.Cars["2014 audi r18 e tron"].Image,
          Resale: cardb.Cars["2014 audi r18 e tron"].sellprice,
          Miles: 0,
          Gas: 10,
          MaxGas: 10,
        }

        userdata.cars.push(carobj)
        userdata.save()
        globals.markModified("leteams")

        await globals.save()
        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });

      }
      else if(value == "ferrari"){
        let globals = await Global.findOne({});
        let team1 = globals.leteams.filter((team) => team.members.includes(interaction.user.id))[0]

        if(team1) return await interaction.editReply({content: "You are already in a team!"})
        let teams = globals.leteams
        embed.setTitle(`<:ferrari:931011838374727730> Team Ferrari`)
        embed.setDescription(`Welcome to Team Ferrari! We strive for the most power, and also the best acceleration. You can earn points for the Ferrari team by racing with a 2023 Ferrari 499P in track races\n\n__Perks__\n- +$5K per street race win, regardless of difficulty with any Ferrari`)
        embed.setImage("https://i.ibb.co/2Fmbnsx/pickferrari.png")
        teams.find(t => t.name == "Ferrari").members.push(interaction.user.id)

        globals.leteams = teams

        let carobj = {
          ID: cardb.Cars["2023 ferrari 499p"].alias,
          Name: cardb.Cars["2023 ferrari 499p"].Name,
          Speed: cardb.Cars["2023 ferrari 499p"].Speed,
          Acceleration: cardb.Cars["2023 ferrari 499p"]["0-60"],
          Handling: cardb.Cars["2023 ferrari 499p"].Handling,
          WeightStat: cardb.Cars["2023 ferrari 499p"].Weight,
          Emote: cardb.Cars["2023 ferrari 499p"].Emote, 
          Resale: cardb.Cars["2023 ferrari 499p"].sellprice,
          Livery: cardb.Cars["2023 ferrari 499p"].Image,
          Miles: 0,
          Gas: 10,
          MaxGas: 10,
        }

        userdata.cars.push(carobj)
        userdata.save()

        globals.markModified("leteams")

        await globals.save()
        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });

      }
    });
  },
};
