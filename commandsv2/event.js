const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  ButtonBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");
let seasondb = require("../data/seasons.json");

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
            label: "Season 1",
            description: "Information for the Season 1 Z Pass",
            value: "spring_event",
            customId: "spring",
            emoji: "<a:season_1:1111097329836113920>",
          },
          {
            label: "Snow Vs Sun",
            description: "Information for the Snow Vs Sun Event",
            value: "event_1",
            customId: "event_1",
            emoji: "❄️",
          },
          {
          label: "Track Legends",
          description: "Information for the Track Legends Event",
          value: "event_2",
          customId: "event_2",
          emoji: "<:tracklegends:1072357967652995174>",
        },
        ])
    );

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);


    let eventcars = ["2023 porsche 911 gt3 rs", "2019 jaguar xe sv", "2021 bmw m2", "2021 bac mono", "2021 mercedes amg gt black series", "2020 hyundai i30 n", "2021 alpine a110 r", "2014 chevy camaro z28", "2016 bugatti chiron pur sport", "2020 ferrari f8 tributo", "2020 mini", "2017 ferrari 488 gte", "2019 mclaren senna gtr", "1997 tvr cerbera speed 12", "2016 apollo arrow", "2023 mclaren solus gt"]
    let eventcararr = []

    for(let car in eventcars){
      let car2 = cardb.Cars[eventcars[car]]

      console.log(eventcars[car])
      eventcararr.push(`${car2.Emote} ${car2.Name}`)
    }

    let embed = new EmbedBuilder();
    embed.setTitle("Events Menu");
    embed.setFooter({ text: 'Prefix is "/"' });
    embed.setThumbnail("https://i.ibb.co/488Qf9M/Logo-Makr-24.png");
    embed.setDescription(`Here you can check out the current events going on!\n\n
          **__Events__**
          Season 1 <a:season_1:1111097329836113920>\n
          Snow vs Sun ☀️❄️\n
          Track Legends <:tracklegends:1072357967652995174>
      `);

    embed.setColor(colors.blue);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row2],
      fetchReply: true,
    });
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
        embed.setTitle("Season 1");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the first season on Zero2Sixty!

            Welcome to summer! With new summer themed items, summer helmets, a whole new Z Pass, and muscle cars, there's so many things to do!

            Try out the new limited time race, Muscle Drag Race, where you can only use muscle cars and get even more notoriety!

            Earn notoriety from street race, and use that towards the Z Pass in /season!

            **Ends August 31st 2023**

                  `);
        embed.setThumbnail(seasondb.Seasons.Summer.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/85G4t6R/season1-image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } else if (value === "event_1") {
        embed.setTitle("Snow Vs Sun");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Snowy has been missing, but why? Find out below!

        It was a cold Friday night, snowy was finishing his last race in his white Agera cheerfully when someone pulls up. 

        Its the police captain, Devil, and he wants to take snowy down, he's been chasing snowy for years for a reason, and now its his chance to get him back.

        They race around the city, dodging civilians, sharp turns, tires screaming as their engines roar.
        In the end, snowys car starts to sputter, the coolant level is low... He panicks, and turns a corner out of the city, Devil has ran him out.
        Devil looks past the city, with a smug expression that quickly turns to anger. "YOU NEVER SHOULD HAVE STEPPED DOWN SNOWY!" he yells into the cold wind

        Find out other parts to the story in the new limited edition race, cross country! Pick up the pieces as you pick up keys to unbox the snow vs sun crate to earn exclusive cars!

            **Ends August 12th 2023**

                  `);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/0M4qTB6/snowvssun.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
      else if (value === "event_2") {
        embed.setTitle("Track Legends");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the track! There's tons of track toys to choose from, and win!

        Handling and weight are the MOST important thing, without that, you stand no chance, you can have all the speed in the world, but you need to be able to handle the speed!

        Win against the opponent in the event track race in /race and have a chance to obtain the car!

        Can you earn all of the cars before the event ends?

        Cars to obtain:

        ${eventcararr.join('\n')}

            **Ends August 31st 2023**

                  `);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/MfWrndh/tracklegends2.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      }
    });
  },
};
