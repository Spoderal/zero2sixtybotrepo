

const {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
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
            label: "Season 3",
            description: "Information for the Season 3 Z Pass",
            value: "spring_event",
            customId: "spring",
            emoji: "<:season2_ico:1146637806354047007>",
          },
          {
            label: "Space Race",
            description: "Information for the Space Race",
            value: "event_3",
            customId: "event_3",
            emoji: "🚀",
          },
          {
            label: "Fictional Powerhouse",
            description: "Information for the Fictional Powerhouse event",
            value: "event_1",
            customId: "event_1",
            emoji: "🧩",
          },
          {
            label: "Swan Song",
            description: "Information for the Swan Song event",
            value: "event_2",
            customId: "event_2",
            emoji: "🦢",
          },
          {
            label: "City Carvers",
            description: "Information for the City Carvers event",
            value: "event_4",
            customId: "event_4",
            emoji: "🌆",
          },
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
          Season 3 <:season3:1183248587774238741>
          Swan Song 🦢
          Space Race 🚀
          Fictional Powerhouse 🧩
          City Carvers 🌆
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
        embed.setTitle("Season 3");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the third season on Zero2Sixty!

            Welcome to winter! With new winter items, brand new designed helmets, and a whole new Z Pass there's so many things to do!

            Try out the new limited time race, Snow Race, where you will need AWD, and lots of handling to get even more notoriety!

            Earn notoriety from snow race, and use that towards the Z Pass in /season!

            **Ends March 1st 2024**

                  `);
        embed.setThumbnail(seasondb.Seasons.Winter.Image);
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/dMnN6LL/season3image.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_1") {
        embed.setTitle("Fictional Powerhouse");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Fictional Powerhouse is here!

        The universes are colliding with one another and the only way for them to get back is to beat someone in a race!

        Get <:key_limited:1103923572063354880> Fictional Keys from racing in street races, and obtain fictional cars from your favorite universes!

        View the list of event cars with \`/unbox crate: Fictional list: true\`

        **Ends January 31st 2023**

                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/bsxTKFG/event-fiction.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_3") {
        embed.setTitle("Space Race");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Space Race is back!

        Race in the space themed race with space tires and earn moon tokens!

        Use moon tokens to buy parts from the limited event parts store in \`/parts\`

        Use those parts you find to fuse an **epic rocket engine**! :)

        Ends January 30th 2024

                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/0D2CR9X/Msk-UHw-UJ2z.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_2") {
        embed.setTitle("Swan Song");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to Swan Song!
        
        As the age of electric cars draws nearer, the petrol-powered cars we know and love are being phased out one by one.\n
        Participate in what may well be the last hurrah of the internal combustion engine, driving various cars that are getting or have gotten axed over the previous years.\n\n
        Because, after all, nothing can replace good old rumbles and horsepower.

        Obtain <:item_swannote:1196272038327881768> Swan Notes from street racing with an EV and run /use for a chance at a swan song vehicle

        If you don't own an EV, may I suggest the 2011 Tesla Roadster?
        __List of event cars__

        <:mistu:931012414479147038> 2015 Mitsubishi Lancer Evo X
        <:audi:931011548758048828> 2023 Audi TT Roadster
        <:audi:931011548758048828> 2023 Audi R8 GT
        <:chevy:931012624039182406> 2024 Chevrolet Camaro ZL1
        <:dodge:931011880040951828> 2023 Dodge Challenger SRT Demon 170
        <:maserati:961332832767184987> 2023 Maserati Granturismo Folgore

        **Ends Febuary 14th 2024**

                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/QMtjMVz/EVENT-SWANSONG.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_4") {
        embed.setTitle("City Carvers");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to City Carvers!
        
        You don't need a lot of horsepower for this event, in fact, its recommended that you use the lowest HP possible!

        Race in the city carvers race from /race and dodge oncoming traffic, obstacles, and cops to get cool rewards that anyone can earn!

        Gain city cash by dodging the obstacles, the more you dodge the more you earn, and you can use that cash to buy the event cars!
        
        __List of event cars__

        <:renault:1083645583782330388> 2016 Renault Clio RS - 500 Carver Cash
        <:honda:931011549705957397> 2018 Honda Fit Sport - 500 Carver Cash
        <:kia:937123149596745780> 2014 Kia Proceed GT - 500 Carver Cash
        <:vauxh:1200662071084322846> 2015 Vauxhall Corsa VXR - 500 Carver Cash
        <:hyundai:931015215447941200> 2022 Hyundai i20N - 500 Carver Cash
        <:mercedes_z:973000364410404924> 2021 Mercedes AMG GLA - 500 Carver Cash

        **Ends Febuary 20th 2024**

                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/sygffHP/EVENT-CITYCARVERS.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
   
    });
  },
};
