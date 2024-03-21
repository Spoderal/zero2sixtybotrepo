

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
const { emotes } = require("../common/emotes");

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
            label: "Track Legends",
            description: "Information for the Track Legends event",
            value: "event_2",
            customId: "event_2",
            emoji: "<:tracklegends:1072357967652995174>",
          },
          {
            label: "McLaren Event",
            description: "Information for the McLaren event",
            value: "event_4",
            customId: "event_4",
            emoji: `${emotes.mclaren}`,
          },
          {
            label: "Type Takeover",
            description: "Information for the Type Takeover event",
            value: "event_5",
            customId: "event_5",
            emoji: `<:key_z:1140029565360668783>`,
          },
          {
            label: "Easter Event",
            description: "Information for the Easter event",
            value: "easter",
            customId: "easter",
            emoji: "🐣",
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
          Track Legends <:tracklegends:1072357967652995174>
          McLaren Event ${emotes.mclaren}
          Type Takeover <:key_z:1140029565360668783>
          Easter Event 🐣
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
      else  if (value === "event_2") {
        embed.setTitle("Track Legends");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome back to Track Legends!

        Welcome to the track! There's tons of track toys to choose from, and win!

        Handling and weight are the MOST important thing, without that, you stand no chance, you can have all the speed in the world, but you need to be able to handle the speed!
        
        Win against opponents in /race track, and if you win, you get 1 track key per opponent raced!

        Use /unbox track to obtain the cars for 50 track keys, can you earn all of the cars before the event ends?


        **Ends April 20th 2024**
                  `)
                  .addFields({name: `Cars`, value: 
                  `
                  <:peel:941833943278297108> 1964 Peel P50 TE
        <:tvr:1143411888399589457> 1997 TVR Cerbera Speed 12
        <:chevy:931012624039182406> 2014 Chevy Camaro Z28
        <:marussia:1208711421232418836> 2014 Marussia B2
        <:bugatti:931012624110460979> 2016 Bugatti Chiron Pur Sport
        <:apollo:1066081882896351332> 2016 Apollo Arrow
        <:nio:1208706113722253332> 2016 Nio EP9
        <:ferrari:931011838374727730> 2017 Ferrari 488 GTE
        <:acura:931012624164978728> 2017 Acura NSX
        <:porsche:931011550880338011> 2019 Porsche 911 GT3 RS Weissach
        <:porsche:931011550880338011> 2019 Porsche 935
        <:zenvo:1208708450444644392> 2019 Zenvo TSR S
                  `, inline: true}, 
                  {name: `More Cars`, value: 
                  `
        <:jaguar:931011547826913330> 2019 Jaguar XE SV
        <:mclaren:931011546354692137> 2019 McLaren Senna GTR
        <:mini:931011548447657984> 2020 MINI
        <:hyundai:931015215447941200> 2020 Hyundai i30 N
        <:ferrari:931011838374727730> 2020 Ferrari F8 Tributo
        <:bmw:931011550054056007> 2021 BMW M2
        <:bac:1072343963303940157> 2021 BAC MONO
        <:mercedes_z:973000364410404924> 2021 Mercedes AMG GT Black Series
        <:alpine:1115857956601348096> 2021 Alpine A110 R
        <:mclaren:931011546354692137> 2023 McLaren Solus GT
        <:porsche:931011550880338011> 2023 Porsche 911 GT3 RS
        <:ruf:1077395490380992603> 2023 RUF CTR3 Evo
        <:hyundai:931015215447941200> 2026 Hyundai N Vision 74
                  `, inline: true})
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/9GM6r67/event-tracklegends2.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "easter") {
        embed.data.fields = [];
        embed.setTitle("Easter Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`The Easter Car has come and taken all the eggs

        You MUST stop him, collect all the eggs save easter to get a hefty reward, THE GOLDEN EGG MOBILE

        Collect eggs to collect cars associated with them, oh yeah and they're all eggs...

        Eggs can be found in the community server, and commands!

        When you find an egg, it'll have a code. Run /code with the code you found to obtain the eggs and their egg mobiles!

        Eggs to collect:
        <:egg_red:964250156981698651> <:egg_lego:1219112533122748548> <:egg_porsche:1219112541347905607> <:egg_zero2sixty:1219112551045140570> <:egg_green:1219112556426428547> <:egg_flame:964250157229170708>
        <:egg_plastic:1219112539296632954> <:egg_striped:1219112547916185660> <:egg_turbo:1219112549187059804> <:egg_smiley:1219112544325861517> <:egg_number2:1219756040942391326> <:egg_egg:1219112552282456096>


        **Ends March 31st 2024**
                  `)
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/23J25Fv/SPOILER-New-Project-24.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_4") {
        embed.setTitle("McLaren Event");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to the McLaren Event!
        
        Welcome to the McLaren Event! There's tons of track toys to choose from, and win!

        Race in street race to have a 20% chance to obtain 5 McLaren keys, and use /unbox mclaren to obtain the cars for 35 McLaren keys, can you earn all of the cars before the event ends?
        
        __List of event cars__
        <:mclaren:931011546354692137> 2020 McLaren Speedtail
        <:mclaren:931011546354692137> 2021 McLaren 765LT
        <:mclaren:931011546354692137> 2017 McLaren 650S
        <:mclaren:931011546354692137> 2018 McLaren P1 GT
        <:mclaren:931011546354692137> 2021 McLaren Elva
        
        
        **Ends April 1st 2024**
                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/9rHL9nH/event-mclaren.png");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
      else  if (value === "event_5") {
        embed.setTitle("Type Takeover Part 2");
        embed.setFooter({ text: 'Prefix is "/"' });
        embed.setDescription(`Welcome to Type Takeover Part 2!

        Walter has come to his senses, but the ZPD aren't happy...
        
        His west side territory is gone, he's angry, and he's taking it out on his old squad.
        
        He's taking over the streets with his new squad, the demonz, and they're taking over the streets with their new cars, help out the old W squad and stop the Demonz!
                
        Type the fastest you can in /typerace and earn z keys, and buy exclusive cars in the dealership event section!
        
        Check how you score up vs the other racers with /leaderboard type takeover

        __List of event cars__
        <:jaguar:931011547826913330> 2016 Jaguar F Type Project 7
        <:vw:931011548372168714> 2022 Volkswagen Golf R
        <:acura:931012624164978728> 2023 Acura Integra Type S
        <:lamborghini:931011549655617566> 2010 Lamborghini Murcielago SV
        <:mercedes_z:973000364410404924> 2016 Mercedes A45
        <:subaru:931011550418976808> 2010 Subaru WRX STI
        <:audi:931011548758048828> 2016 Audi S8 Plus
        <:acura:931012624164978728> 2023 Acura MDX Type S

        **Ends April 5th 2024**
                  `);
        embed.setThumbnail();
        embed
          .setColor(colors.blue)
          .setImage("https://i.ibb.co/FhNnKQn/typetakeoverevent.webp");

        await interaction.editReply({
          embeds: [embed],
          components: [row2],
        });
      } 
   
    });
  },
};
