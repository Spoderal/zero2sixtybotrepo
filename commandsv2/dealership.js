const cars = require("../cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("The car dealership"),
  async execute(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select2")
        .setPlaceholder("Select a class")
        .addOptions([
          {
            label: "D Class",
            description: "Select this for the list of D class cars",
            value: "first_option",
            customId: "d_class",
            emoji: "<:Dclass:954635612986679317>",
          },
          {
            label: "D Class Page 2",
            description: "Select this for the 2nd page of D class cars",
            value: "first_option_2",
            customId: "d_class",
            emoji: "<:Dclass:954635612986679317>",
          },
          {
            label: "C Class",
            description: "Select this for the list of C class cars",
            value: "second_option",
            customId: "c_class",
            emoji: "<:cclass:954635613385162792>",
          },
          {
            label: "C Class Page 2",
            description: "Select this for the 2nd page of C class cars",
            value: "second_option_2",
            customId: "c_class",
            emoji: "<:cclass:954635613385162792>",
          },
          {
            label: "B Class",
            description: "Select this for the list of B class cars",
            value: "third_option",
            emoji: "<:Bclass:954635613339000862>",
          },
          {
            label: "B Class Page 2",
            description: "Select this for the 2nd page of B class cars",
            value: "third_option_2",
            emoji: "<:Bclass:954635613339000862>",
          },
          {
            label: "A Class",
            description: "Select this for the list of A class cars",
            value: "fourth_option",
            emoji: "<:aclass:954635613376770108>",
          },
          {
            label: "A Class Page 2",
            description: "Select this the 2nd page of A class cars",
            value: "fourth_option_2",
            emoji: "<:aclass:954635613376770108>",
          },
          {
            label: "S Class",
            description: "Select this for the list of S class cars",
            value: "fifth_option",
            emoji: "<:sclass:967698398314655754>",
          },
          {
            label: "U Class",
            description: "Select this for the list of U class cars",
            value: "special_option",
            emoji: "<:UCLASS:954635613074780180>",
          },
          {
            label: "EV Class",
            description: "Select this for the list of EV cars",
            value: "event_option",
            emoji: "<:EVCLASS:954635613179625522>",
          },
          {
            label: "Police Cars",
            description: "Select this for the list of police cars",
            value: "police_option",
            emoji: "<:policeclass:967699496563769357>",
          },
          {
            label: "Common Imports",
            description: "Select this for the list of common import cars",
            value: "common_import",
            emoji: "<:commonkey:938734258065932339>",
          },
          {
            label: "Rare Imports",
            description: "Select this for the list of rare import cars",
            value: "rare_import",
            emoji: "<:rarekey:938734258367918120>",
          },
          {
            label: "Exotic Imports",
            description: "Select this for the list of exotic import cars",
            value: "exotic_import",
            emoji: "<:exotickey:938734258275631164>",
          },
          {
            label: "New Cars",
            description: "Select this for the list of new cars",
            value: "new_option",
            emoji: "<:zero2sixty:966453514425495602>",
          },
        ])
    );

    let embed = new MessageEmbed()
      .setTitle("Dealership")
      .setThumbnail("https://i.ibb.co/844BRBp/Logo-Makr-3-V9-MQG-1.png")
      .addField(
        `Available Classes`,
        `*Choose a class from the drop down below*\n\n<:Dclass:954635612986679317> D Class (Entry) <:cclass:954635613385162792> C Class\n
        <:Bclass:954635613339000862> B Class <:aclass:954635613376770108> A Class\n
        <:sclass:967698398314655754> S Class <:UCLASS:954635613074780180> U Class (Best)\n
        <:EVCLASS:954635613179625522> EV Class <:policeclass:967699496563769357> Police Cars\n
        <:zero2sixty:966453514425495602> Recently released cars`,
        true
      )
      .setColor("#60b0f4")
      .setDescription(
        `\`/buy (full car name)\` to buy a car\n\n[Official Server](https://discord.gg/bHwqpxJnJk)\n[Buy me a coffee!](https://www.buymeacoffee.com/zero2sixty)`
      );
    interaction
      .reply({ embeds: [embed], components: [row], fetchReply: true })
      .then(async (msg) => {
        const filter = (interaction) =>
          interaction.isSelectMenu() &&
          interaction.user.id === interaction.user.id;

        const collector = msg.createMessageComponentCollector({
          filter,
        });

        collector.on("collect", async (collected) => {
          const value = collected.values[0];
          if (value === "first_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("D Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1
                ${cars.Cars["1995 mazda miata"].Emote} ${
                  cars.Cars["1995 mazda miata"].Name
                } :  $${numberWithCommas(cars.Cars["1995 mazda miata"].Price)}\n
                ${cars.Cars["1999 honda civic si"].Emote} ${
                  cars.Cars["1999 honda civic si"].Name
                } : $${numberWithCommas(
                  cars.Cars["1999 honda civic si"].Price
                )}\n
                ${cars.Cars["1997 acura integra"].Emote} ${
                  cars.Cars["1997 acura integra"].Name
                } : $${numberWithCommas(
                  cars.Cars["1997 acura integra"].Price
                )}\n
                ${cars.Cars["2005 hyundai tiburon"].Emote} ${
                  cars.Cars["2005 hyundai tiburon"].Name
                } :  $${numberWithCommas(
                  cars.Cars["2005 hyundai tiburon"].Price
                )}\n
                ${cars.Cars["1991 toyota mr2"].Emote} ${
                  cars.Cars["1991 toyota mr2"].Name
                } : $${numberWithCommas(cars.Cars["1991 toyota mr2"].Price)}\n 
                ${cars.Cars["2002 pontiac firebird"].Emote} ${
                  cars.Cars["2002 pontiac firebird"].Name
                } : $${numberWithCommas(
                  cars.Cars["2002 pontiac firebird"].Price
                )}\n
                ${cars.Cars["2011 scion tc"].Emote} ${
                  cars.Cars["2011 scion tc"].Name
                } : $${numberWithCommas(cars.Cars["2011 scion tc"].Price)}\n
                ${cars.Cars["2002 ford mustang"].Emote} ${
                  cars.Cars["2002 ford mustang"].Name
                } : $${numberWithCommas(cars.Cars["2002 ford mustang"].Price)}\n
                ${cars.Cars["2012 hyundai veloster"].Emote} ${
                  cars.Cars["2012 hyundai veloster"].Name
                } : $${numberWithCommas(
                  cars.Cars["2012 hyundai veloster"].Price
                )}\n
                ${cars.Cars["1986 toyota ae86"].Emote} ${
                  cars.Cars["1986 toyota ae86"].Name
                } : $${numberWithCommas(cars.Cars["1986 toyota ae86"].Price)}\n
                ${cars.Cars["2007 infiniti g35 coupe"].Emote} ${
                  cars.Cars["2007 infiniti g35 coupe"].Name
                } : $${numberWithCommas(
                  cars.Cars["2007 infiniti g35 coupe"].Price
                )}\n
                ${cars.Cars["1999 mitsubishi eclipse"].Emote} ${
                  cars.Cars["1999 mitsubishi eclipse"].Name
                } : $${numberWithCommas(
                  cars.Cars["1999 mitsubishi eclipse"].Price
                )}\n
                ${cars.Cars["2000 toyota corolla levin"].Emote} ${
                  cars.Cars["2000 toyota corolla levin"].Name
                } : $${numberWithCommas(
                  cars.Cars["2000 toyota corolla levin"].Price
                )}\n
                ${cars.Cars["2009 volkswagen golf gti"].Emote} ${
                  cars.Cars["2009 volkswagen golf gti"].Name
                } : $${numberWithCommas(
                  cars.Cars["2009 volkswagen golf gti"].Price
                )}\n
                ${cars.Cars["2005 dodge neon srt4"].Emote} ${
                  cars.Cars["2005 dodge neon srt4"].Name
                } : $${numberWithCommas(
                  cars.Cars["2005 dodge neon srt4"].Price
                )}\n
                **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/NZ8ySF8/Dclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "first_option_2") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("D Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 2
                ${cars.Cars["1998 bmw m3 e36"].Emote} ${
                  cars.Cars["1998 bmw m3 e36"].Name
                } : $${numberWithCommas(cars.Cars["1998 bmw m3 e36"].Price)}\n
                ${cars.Cars["1998 pontiac fiero"].Emote} ${
                  cars.Cars["1998 pontiac fiero"].Name
                } : $${numberWithCommas(
                  cars.Cars["1998 pontiac fiero"].Price
                )}\n
              ${cars.Cars["1989 chevy camaro"].Emote} ${
                  cars.Cars["1989 chevy camaro"].Name
                } : $${numberWithCommas(cars.Cars["1989 chevy camaro"].Price)}\n
              ${cars.Cars["2008 nissan 350z"].Emote} ${
                  cars.Cars["2008 nissan 350z"].Name
                } : $${numberWithCommas(cars.Cars["2008 nissan 350z"].Price)}\n
              ${cars.Cars["2014 hyundai genesis coupe"].Emote} ${
                  cars.Cars["2014 hyundai genesis coupe"].Name
                } : $${numberWithCommas(
                  cars.Cars["2014 hyundai genesis coupe"].Price
                )}\n
              ${cars.Cars["2019 subaru brz"].Emote} ${
                  cars.Cars["2019 subaru brz"].Name
                } : $${numberWithCommas(cars.Cars["2019 subaru brz"].Price)}\n
              ${cars.Cars["2022 toyota gr86"].Emote} ${
                  cars.Cars["2022 toyota gr86"].Name
                } : $${numberWithCommas(cars.Cars["2022 toyota gr86"].Price)}
              **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/NZ8ySF8/Dclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "second_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("C Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["1992 toyota supra mk3"].Emote} ${
                  cars.Cars["1992 toyota supra mk3"].Name
                } : $${numberWithCommas(
                  cars.Cars["1992 toyota supra mk3"].Price
                )}\n
                ${cars.Cars["2004 subaru wrx sti"].Emote} ${
                  cars.Cars["2004 subaru wrx sti"].Name
                } : $${numberWithCommas(
                  cars.Cars["2004 subaru wrx sti"].Price
                )}\n
                ${cars.Cars["2010 ford mustang"].Emote} ${
                  cars.Cars["2010 ford mustang"].Name
                } : $${numberWithCommas(cars.Cars["2010 ford mustang"].Price)}\n
                ${cars.Cars["2002 bmw m3 gtr"].Emote} ${
                  cars.Cars["2002 bmw m3 gtr"].Name
                } : $${numberWithCommas(cars.Cars["2002 bmw m3 gtr"].Price)}\n
                ${cars.Cars["1989 nissan skyline r32"].Emote} ${
                  cars.Cars["1989 nissan skyline r32"].Name
                } : $${numberWithCommas(
                  cars.Cars["1989 nissan skyline r32"].Price
                )}\n
                ${cars.Cars["1995 nissan skyline r33"].Emote} ${
                  cars.Cars["1995 nissan skyline r33"].Name
                } : $${numberWithCommas(
                  cars.Cars["1995 nissan skyline r33"].Price
                )}\n
                ${cars.Cars["2013 mazda speed3"].Emote} ${
                  cars.Cars["2013 mazda speed3"].Name
                } : $${numberWithCommas(cars.Cars["2013 mazda speed3"].Price)}\n
                ${cars.Cars["2010 chevy camaro v6"].Emote} ${
                  cars.Cars["2010 chevy camaro v6"].Name
                } : $${numberWithCommas(
                  cars.Cars["2010 chevy camaro v6"].Price
                )}\n
                ${cars.Cars["2001 toyota supra mk4"].Emote} ${
                  cars.Cars["2001 toyota supra mk4"].Name
                } : $${numberWithCommas(
                  cars.Cars["2001 toyota supra mk4"].Price
                )}\n
                ${cars.Cars["2007 mitsubishi evo ix"].Emote} ${
                  cars.Cars["2007 mitsubishi evo ix"].Name
                } : $${numberWithCommas(
                  cars.Cars["2007 mitsubishi evo ix"].Price
                )}\n
                ${cars.Cars["2002 mazda rx7 fd"].Emote} ${
                  cars.Cars["2002 mazda rx7 fd"].Name
                } : $${numberWithCommas(cars.Cars["2002 mazda rx7 fd"].Price)}\n
                ${cars.Cars["1994 mitsubishi 3000gt vr4"].Emote} ${
                  cars.Cars["1994 mitsubishi 3000gt vr4"].Name
                } : $${numberWithCommas(
                  cars.Cars["1994 mitsubishi 3000gt vr4"].Price
                )}\n
                ${cars.Cars["2009 honda s2000 cr"].Emote} ${
                  cars.Cars["2009 honda s2000 cr"].Name
                } : $${numberWithCommas(
                  cars.Cars["2009 honda s2000 cr"].Price
                )}\n
                ${cars.Cars["2018 honda civic type r"].Emote} ${
                  cars.Cars["2018 honda civic type r"].Name
                } : $${numberWithCommas(
                  cars.Cars["2018 honda civic type r"].Price
                )}\n
                ${cars.Cars["2002 nissan skyline r34"].Emote} ${
                  cars.Cars["2002 nissan skyline r34"].Name
                } : $${numberWithCommas(
                  cars.Cars["2002 nissan skyline r34"].Price
                )}\n
                **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/XxvHmCc/cclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "second_option_2") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("C Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 2\n
                ${cars.Cars["1994 porsche 911"].Emote} ${
                  cars.Cars["1994 porsche 911"].Name
                } : $${numberWithCommas(cars.Cars["1994 porsche 911"].Price)}\n
                ${cars.Cars["2004 corvette c5"].Emote} ${
                  cars.Cars["2004 corvette c5"].Name
                } : $${numberWithCommas(cars.Cars["2004 corvette c5"].Price)}\n
                ${cars.Cars["1990 bmw 850i"].Emote} ${
                  cars.Cars["1990 bmw 850i"].Name
                } : $${numberWithCommas(cars.Cars["1990 bmw 850i"].Price)}\n
                ${cars.Cars["2018 kia stinger"].Emote} ${
                  cars.Cars["2018 kia stinger"].Name
                } : $${numberWithCommas(cars.Cars["2018 kia stinger"].Price)}\n
                ${cars.Cars["2015 hsv gts maloo"].Emote} ${
                  cars.Cars["2015 hsv gts maloo"].Name
                } : $${numberWithCommas(cars.Cars["2015 hsv gts maloo"].Price)}
                **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/XxvHmCc/cclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "third_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("B Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1
                ${cars.Cars["2020 audi tt rs"].Emote} ${
                  cars.Cars["2020 audi tt rs"].Name
                } : $${numberWithCommas(cars.Cars["2020 audi tt rs"].Price)}\n
                ${cars.Cars["2021 lexus rc f"].Emote} ${
                  cars.Cars["2021 lexus rc f"].Name
                } : $${numberWithCommas(cars.Cars["2021 lexus rc f"].Price)}\n
                ${cars.Cars["2011 bmw m3"].Emote} ${
                  cars.Cars["2011 bmw m3"].Name
                } : $${numberWithCommas(cars.Cars["2011 bmw m3"].Price)}\n
                ${cars.Cars["1993 porsche 959"].Emote} ${
                  cars.Cars["1993 porsche 959"].Name
                } : $${numberWithCommas(cars.Cars["1993 porsche 959"].Price)}\n
                ${cars.Cars["2020 nissan 370z nismo"].Emote} ${
                  cars.Cars["2020 nissan 370z nismo"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 nissan 370z nismo"].Price
                )}\n
                ${cars.Cars["2021 toyota supra"].Emote} ${
                  cars.Cars["2021 toyota supra"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 toyota supra"].Price
                )}\n**
                **${cars.Cars["2020 porsche 718 cayman"].Emote} ${
                  cars.Cars["2020 porsche 718 cayman"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 porsche 718 cayman"].Price
                )}**\n *TRIMS AVAILABLE*
                **${cars.Cars["2023 nissan z"].Emote} ${
                  cars.Cars["2023 nissan z"].Name
                } : $${numberWithCommas(cars.Cars["2023 nissan z"].Price)}\n
                ${cars.Cars["2012 lotus evora s"].Emote} ${
                  cars.Cars["2012 lotus evora s"].Name
                } : $${numberWithCommas(
                  cars.Cars["2012 lotus evora s"].Price
                )}\n
                ${cars.Cars["2015 lotus exige sport"].Emote} ${
                  cars.Cars["2015 lotus exige sport"].Name
                } : $${numberWithCommas(
                  cars.Cars["2015 lotus exige sport"].Price
                )}\n
                ${cars.Cars["2011 audi rs5"].Emote} ${
                  cars.Cars["2011 audi rs5"].Name
                } : $${numberWithCommas(cars.Cars["2011 audi rs5"].Price)}\n
                ${cars.Cars["2019 chevy camaro zl1"].Emote} ${
                  cars.Cars["2019 chevy camaro zl1"].Name
                } : $${numberWithCommas(
                  cars.Cars["2019 chevy camaro zl1"].Price
                )}\n
                ${cars.Cars["2012 dodge charger srt8"].Emote} ${
                  cars.Cars["2012 dodge charger srt8"].Name
                } : $${numberWithCommas(
                  cars.Cars["2012 dodge charger srt8"].Price
                )}\n
                ${cars.Cars["2021 ford mustang mach 1"].Emote} ${
                  cars.Cars["2021 ford mustang mach 1"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 ford mustang mach 1"].Price
                )}\n
                ${cars.Cars["2012 dodge challenger srt8"].Emote} ${
                  cars.Cars["2012 dodge challenger srt8"].Name
                } : $${numberWithCommas(
                  cars.Cars["2012 dodge challenger srt8"].Price
                )}
                **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/5KHHqVW/Bclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "third_option_2") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("B Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 2
                ${cars.Cars["2017 dodge viper acr"].Emote} ${
                  cars.Cars["2017 dodge viper acr"].Name
                } : $${numberWithCommas(
                  cars.Cars["2017 dodge viper acr"].Price
                )}\n
                ${cars.Cars["2016 jaguar f type"].Emote} ${
                  cars.Cars["2016 jaguar f type"].Name
                } : $${numberWithCommas(
                  cars.Cars["2016 jaguar f type"].Price
                )}\n
                ${cars.Cars["2009 corvette c6"].Emote} ${
                  cars.Cars["2009 corvette c6"].Name
                } : $${numberWithCommas(
                  cars.Cars["2009 corvette c6"].Price
                )}\n**
                **${cars.Cars["2019 chevy corvette c7"].Emote} ${
                  cars.Cars["2019 chevy corvette c7"].Name
                } : $${numberWithCommas(
                  cars.Cars["2019 chevy corvette c7"].Price
                )}\n** *TRIMS AVAILABLE*
                **${cars.Cars["2020 chevy corvette c8"].Emote} ${
                  cars.Cars["2020 chevy corvette c8"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 chevy corvette c8"].Price
                )}\n
                ${cars.Cars["2015 mercedes amg gts"].Emote} ${
                  cars.Cars["2015 mercedes amg gts"].Name
                } : $${numberWithCommas(
                  cars.Cars["2015 mercedes amg gts"].Price
                )}\n
                ${cars.Cars["2016 alfa romeo giulia"].Emote} ${
                  cars.Cars["2016 alfa romeo giulia"].Name
                } : $${numberWithCommas(
                  cars.Cars["2016 alfa romeo giulia"].Price
                )}**
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/5KHHqVW/Bclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fourth_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("A Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1
                ${cars.Cars["2016 bmw i8"].Emote} ${
                  cars.Cars["2016 bmw i8"].Name
                } : $${numberWithCommas(cars.Cars["2016 bmw i8"].Price)}\n
                ${cars.Cars["1998 ferrari f355"].Emote} ${
                  cars.Cars["1998 ferrari f355"].Name
                } : $${numberWithCommas(cars.Cars["1998 ferrari f355"].Price)}\n
                ${cars.Cars["2022 maserati mc20"].Emote} ${
                  cars.Cars["2022 maserati mc20"].Name
                } : $${numberWithCommas(
                  cars.Cars["2022 maserati mc20"].Price
                )}\n
                ${cars.Cars["2021 nissan gtr"].Emote} ${
                  cars.Cars["2021 nissan gtr"].Name
                } : $${numberWithCommas(cars.Cars["2021 nissan gtr"].Price)}\n
                ${cars.Cars["1993 jaguar xj220"].Emote} ${
                  cars.Cars["1993 jaguar xj220"].Name
                } : $${numberWithCommas(cars.Cars["1993 jaguar xj220"].Price)}\n
                ${cars.Cars["2021 porsche 911 gt3"].Emote} ${
                  cars.Cars["2021 porsche 911 gt3"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 porsche 911 gt3"].Price
                )}\n
                ${cars.Cars["2013 lexus lfa"].Emote} ${
                  cars.Cars["2013 lexus lfa"].Name
                } : $${numberWithCommas(cars.Cars["2013 lexus lfa"].Price)}\n
                ${cars.Cars["2017 ford gt"].Emote} ${
                  cars.Cars["2017 ford gt"].Name
                } : $${numberWithCommas(cars.Cars["2017 ford gt"].Price)}\n
                ${cars.Cars["2014 lamborghini huracan"].Emote} ${
                  cars.Cars["2014 lamborghini huracan"].Name
                } : $${numberWithCommas(
                  cars.Cars["2014 lamborghini huracan"].Price
                )}\n
                ${cars.Cars["2018 audi r8"].Emote} ${
                  cars.Cars["2018 audi r8"].Name
                } : $${numberWithCommas(cars.Cars["2018 audi r8"].Price)}\n
                ${cars.Cars["2014 mclaren 12c"].Emote} ${
                  cars.Cars["2014 mclaren 12c"].Name
                } : $${numberWithCommas(cars.Cars["2014 mclaren 12c"].Price)}\n
                ${cars.Cars["2021 mclaren gt"].Emote} ${
                  cars.Cars["2021 mclaren gt"].Name
                } : $${numberWithCommas(cars.Cars["2021 mclaren gt"].Price)}\n
                ${cars.Cars["2020 mclaren 570s"].Emote} ${
                  cars.Cars["2020 mclaren 570s"].Name
                } : $${numberWithCommas(cars.Cars["2020 mclaren 570s"].Price)}\n
                ${cars.Cars["2016 bentley continental gt speed"].Emote} ${
                  cars.Cars["2016 bentley continental gt speed"].Name
                } : $${numberWithCommas(
                  cars.Cars["2016 bentley continental gt speed"].Price
                )}\n
                ${cars.Cars["2020 aston martin vantage"].Emote} ${
                  cars.Cars["2020 aston martin vantage"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 aston martin vantage"].Price
                )}\n
                **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/T0Cd62J/aclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fourth_option_2") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("A Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 2\n
                ${cars.Cars["2011 aston martin one-77"].Emote} ${
                  cars.Cars["2011 aston martin one-77"].Name
                } : $${numberWithCommas(
                  cars.Cars["2011 aston martin one-77"].Price
                )}\n
                ${cars.Cars["2018 ferrari california"].Emote} ${
                  cars.Cars["2018 ferrari california"].Name
                } : $${numberWithCommas(
                  cars.Cars["2018 ferrari california"].Price
                )}\n
                ${cars.Cars["2005 pagani zonda f"].Emote} ${
                  cars.Cars["2005 pagani zonda f"].Name
                } : $${numberWithCommas(
                  cars.Cars["2005 pagani zonda f"].Price
                )}\n
                ${cars.Cars["2010 ferrari 458 italia"].Emote} ${
                  cars.Cars["2010 ferrari 458 italia"].Name
                } : $${numberWithCommas(
                  cars.Cars["2010 ferrari 458 italia"].Price
                )}\n**
                **${cars.Cars["2006 lamborghini gallardo"].Emote} ${
                  cars.Cars["2006 lamborghini gallardo"].Name
                } : $${numberWithCommas(
                  cars.Cars["2006 lamborghini gallardo"].Price
                )}** *TRIMS AVAILABLE*\n
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/T0Cd62J/aclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fifth_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("S Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                  Page 1
                  ${cars.Cars["2018 lamborghini aventador s"].Emote} ${
                  cars.Cars["2018 lamborghini aventador s"].Name
                } : $${numberWithCommas(
                  cars.Cars["2018 lamborghini aventador s"].Price
                )}\n
                  ${cars.Cars["2014 porsche 918 spyder"].Emote} ${
                  cars.Cars["2014 porsche 918 spyder"].Name
                } : $${numberWithCommas(
                  cars.Cars["2014 porsche 918 spyder"].Price
                )}\n
                  ${cars.Cars["2012 pagani huayra"].Emote} ${
                  cars.Cars["2012 pagani huayra"].Name
                } : $${numberWithCommas(
                  cars.Cars["2012 pagani huayra"].Price
                )}\n
                  ${cars.Cars["2013 mclaren p1"].Emote} ${
                  cars.Cars["2013 mclaren p1"].Name
                } : $${numberWithCommas(cars.Cars["2013 mclaren p1"].Price)}\n
                  ${cars.Cars["2021 mclaren gt"].Emote} ${
                  cars.Cars["2021 mclaren gt"].Name
                } : $${numberWithCommas(cars.Cars["2021 mclaren gt"].Price)}\n
                  ${cars.Cars["2021 ferrari sf90 stradale"].Emote} ${
                  cars.Cars["2021 ferrari sf90 stradale"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 ferrari sf90 stradale"].Price
                )}\n
                  ${cars.Cars["2017 mercedes amg one"].Emote} ${
                  cars.Cars["2017 mercedes amg one"].Name
                } : $${numberWithCommas(
                  cars.Cars["2017 mercedes amg one"].Price
                )}\n
                  ${cars.Cars["2008 bugatti veyron"].Emote} ${
                  cars.Cars["2008 bugatti veyron"].Name
                } : $${numberWithCommas(
                  cars.Cars["2008 bugatti veyron"].Price
                )}\n
                  ${cars.Cars["2022 aston martin valkyrie"].Emote} ${
                  cars.Cars["2022 aston martin valkyrie"].Name
                } : $${numberWithCommas(
                  cars.Cars["2022 aston martin valkyrie"].Price
                )}\n
                  ${cars.Cars["2016 bugatti chiron"].Emote} ${
                  cars.Cars["2016 bugatti chiron"].Name
                } : $${numberWithCommas(
                  cars.Cars["2016 bugatti chiron"].Price
                )}\n
                  ${cars.Cars["2018 koenigsegg agera"].Emote} ${
                  cars.Cars["2018 koenigsegg agera"].Name
                } : $${numberWithCommas(
                  cars.Cars["2018 koenigsegg agera"].Price
                )}
                  **`
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/Z13KtH8/sclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "special_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("U Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2013 lamborghini veneno"].Emote} ${
                  cars.Cars["2013 lamborghini veneno"].Name
                } : $${numberWithCommas(
                  cars.Cars["2013 lamborghini veneno"].Price
                )}\n
                ${cars.Cars["2021 bugatti bolide"].Emote} ${
                  cars.Cars["2021 bugatti bolide"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 bugatti bolide"].Price
                )}\n
                ${cars.Cars["2020 koenigsegg regera"].Emote} ${
                  cars.Cars["2020 koenigsegg regera"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 koenigsegg regera"].Price
                )}\n
                ${cars.Cars["2021 koenigsegg gemera"].Emote} ${
                  cars.Cars["2021 koenigsegg gemera"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 koenigsegg gemera"].Price
                )}\n
                ${cars.Cars["2020 bugatti divo"].Emote} ${
                  cars.Cars["2020 bugatti divo"].Name
                } : $${numberWithCommas(cars.Cars["2020 bugatti divo"].Price)}\n
                ${cars.Cars["2020 koenigsegg jesko"].Emote} ${
                  cars.Cars["2020 koenigsegg jesko"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 koenigsegg jesko"].Price
                )}\n
                ${cars.Cars["2020 ssc tuatara"].Emote} ${
                  cars.Cars["2020 ssc tuatara"].Name
                } : $${numberWithCommas(cars.Cars["2020 ssc tuatara"].Price)}\n
                ${cars.Cars["thrust ssc"].Emote} ${
                  cars.Cars["thrust ssc"].Name
                } : $${numberWithCommas(cars.Cars["thrust ssc"].Price)}
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/9r2LJFT/UCLASS.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "event_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("EV Class")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2022 ford mustang mach e"].Emote} ${
                  cars.Cars["2022 ford mustang mach e"].Name
                } : $${numberWithCommas(
                  cars.Cars["2022 ford mustang mach e"].Price
                )}\n
                ${cars.Cars["2020 tesla model s"].Emote} ${
                  cars.Cars["2020 tesla model s"].Name
                } : $${numberWithCommas(
                  cars.Cars["2020 tesla model s"].Price
                )}\n
                ${cars.Cars["2022 audi e tron gt"].Emote} ${
                  cars.Cars["2022 audi e tron gt"].Name
                } : $${numberWithCommas(
                  cars.Cars["2022 audi e tron gt"].Price
                )}\n
                ${cars.Cars["2022 porsche taycan"].Emote} ${
                  cars.Cars["2022 porsche taycan"].Name
                } : $${numberWithCommas(
                  cars.Cars["2022 porsche taycan"].Price
                )}\n
                ${cars.Cars["2021 tesla model s plaid"].Emote} ${
                  cars.Cars["2021 tesla model s plaid"].Name
                } : $${numberWithCommas(
                  cars.Cars["2021 tesla model s plaid"].Price
                )}\n
                ${cars.Cars["2020 lotus evija"].Emote} ${
                  cars.Cars["2020 lotus evija"].Name
                } : $${numberWithCommas(cars.Cars["2020 lotus evija"].Price)}\n
                ${cars.Cars["2022 rimac nevera"].Emote} ${
                  cars.Cars["2022 rimac nevera"].Name
                } : $${numberWithCommas(cars.Cars["2022 rimac nevera"].Price)}
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/Qv4Grxk/EVCLASS.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "new_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("New Cars")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `
                Page 1\n
                **${cars.Cars["2021 lamborghini huracan sto"].Emote} ${cars.Cars["2021 lamborghini huracan sto"].Name} : ${cars.Cars["2021 lamborghini huracan sto"].Obtained}\n
                ${cars.Cars["2021 lamborghini urus"].Emote} ${cars.Cars["2021 lamborghini urus"].Name} : ${cars.Cars["2021 lamborghini urus"].Obtained}\n
                ${cars.Cars["2005 maserati mc12"].Emote} ${cars.Cars["2005 maserati mc12"].Name} : ${cars.Cars["2005 maserati mc12"].Obtained}\n**
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/BTj07zB/newlogo2.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "common_import") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("Common Import Cars")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2000 honda civic type r"].Emote} ${cars.Cars["2000 honda civic type r"].Name} : ${cars.Cars["2000 honda civic type r"].Obtained}\n
                ${cars.Cars["1984 porsche 944"].Emote} ${cars.Cars["1984 porsche 944"].Name} : ${cars.Cars["1984 porsche 944"].Obtained}\n
                ${cars.Cars["1994 honda prelude"].Emote} ${cars.Cars["1994 honda prelude"].Name} : ${cars.Cars["1994 honda prelude"].Obtained}\n
                ${cars.Cars["1994 toyota celica gt4"].Emote} ${cars.Cars["1994 toyota celica gt4"].Name} : ${cars.Cars["1994 toyota celica gt4"].Obtained}\n
                ${cars.Cars["2000 lexus sc400"].Emote} ${cars.Cars["2000 lexus sc400"].Name} : ${cars.Cars["2000 lexus sc400"].Obtained}\n
                ${cars.Cars["1989 toyota celica"].Emote} ${cars.Cars["1989 toyota celica"].Name} : ${cars.Cars["1989 toyota celica"].Obtained}\n
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/k674kNj/commonkey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "rare_import") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("Rare Import Cars")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2020 toyota gr yaris"].Emote} ${cars.Cars["2020 toyota gr yaris"].Name} : ${cars.Cars["2020 toyota gr yaris"].Obtained}\n
                ${cars.Cars["1993 nissan silvia s14"].Emote} ${cars.Cars["1993 nissan silvia s14"].Name} : ${cars.Cars["1993 nissan silvia s14"].Obtained}\n
                ${cars.Cars["2022 audi rs3 sportback"].Emote} ${cars.Cars["2022 audi rs3 sportback"].Name} : ${cars.Cars["2022 audi rs3 sportback"].Obtained}\n
                ${cars.Cars["2022 bmw m8"].Emote} ${cars.Cars["2022 bmw m8"].Name} : ${cars.Cars["2022 bmw m8"].Obtained}\n
                ${cars.Cars["1989 mazda rx7 fc"].Emote} ${cars.Cars["1989 mazda rx7 fc"].Name} : ${cars.Cars["1989 mazda rx7 fc"].Obtained}\n
                ${cars.Cars["2019 porsche 911 speedster"].Emote} ${cars.Cars["2019 porsche 911 speedster"].Name} : ${cars.Cars["2019 porsche 911 speedster"].Obtained}\n
                ${cars.Cars["2002 nissan silvia s15"].Emote} ${cars.Cars["2002 nissan silvia s15"].Name} : ${cars.Cars["2002 nissan silvia s15"].Obtained}\n
                ${cars.Cars["2020 polestar one"].Emote} ${cars.Cars["2020 polestar one"].Name} : ${cars.Cars["2020 polestar one"].Obtained}\n
                ${cars.Cars["2013 mitsubishi evo x"].Emote} ${cars.Cars["2013 mitsubishi evo x"].Name} : ${cars.Cars["2013 mitsubishi evo x"].Obtained}\n
                ${cars.Cars["2014 ford mustang gt500"].Emote} ${cars.Cars["2014 ford mustang gt500"].Name} : ${cars.Cars["2014 ford mustang gt500"].Obtained}\n
                ${cars.Cars["2012 mazda rx8"].Emote} ${cars.Cars["2012 mazda rx8"].Name} : ${cars.Cars["2012 mazda rx8"].Obtained}\n
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/jvswjhm/rarekey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "exotic_import") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("Exotic Import Cars")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2005 porsche carrera gt"].Emote} ${cars.Cars["2005 porsche carrera gt"].Name} : ${cars.Cars["2005 porsche carrera gt"].Obtained}\n
                ${cars.Cars["1995 ferrari f50"].Emote} ${cars.Cars["1995 ferrari f50"].Name} : ${cars.Cars["1995 ferrari f50"].Obtained}\n
                ${cars.Cars["1995 mclaren f1"].Emote} ${cars.Cars["1995 mclaren f1"].Name} : ${cars.Cars["1995 mclaren f1"].Obtained}\n
                ${cars.Cars["2001 lamborghini diablo"].Emote} ${cars.Cars["2001 lamborghini diablo"].Name} : ${cars.Cars["2001 lamborghini diablo"].Obtained}\n
                ${cars.Cars["2007 aston martin dbs"].Emote} ${cars.Cars["2007 aston martin dbs"].Name} : ${cars.Cars["2007 aston martin dbs"].Obtained}\n
                ${cars.Cars["2021 mercedes amg gt63"].Emote} ${cars.Cars["2021 mercedes amg gt63"].Name} : ${cars.Cars["2021 mercedes amg gt63"].Obtained}\n
                ${cars.Cars["2004 mercedes-mclaren slr"].Emote} ${cars.Cars["2004 mercedes-mclaren slr"].Name} : ${cars.Cars["2004 mercedes-mclaren slr"].Obtained}\n
                ${cars.Cars["1990 ferrari testarossa"].Emote} ${cars.Cars["1990 ferrari testarossa"].Name} : ${cars.Cars["1990 ferrari testarossa"].Obtained}\n
                ${cars.Cars["1965 shelby cobra 427"].Emote} ${cars.Cars["1965 shelby cobra 427"].Name} : ${cars.Cars["1965 shelby cobra 427"].Obtained}\n
                ${cars.Cars["2005 ford gt"].Emote} ${cars.Cars["2005 ford gt"].Name} : ${cars.Cars["2005 ford gt"].Obtained}\n
                ${cars.Cars["2021 porsche 911 targa"].Emote} ${cars.Cars["2021 porsche 911 targa"].Name} : ${cars.Cars["2021 porsche 911 targa"].Obtained}\n
                ${cars.Cars["2022 lamborghini countach"].Emote} ${cars.Cars["2022 lamborghini countach"].Name} : ${cars.Cars["2022 lamborghini countach"].Obtained}\n
                ${cars.Cars["2020 mclaren senna"].Emote} ${cars.Cars["2020 mclaren senna"].Name} : ${cars.Cars["2020 mclaren senna"].Obtained}\n
                ${cars.Cars["2021 lamborghini huracan sto"].Emote} ${cars.Cars["2021 lamborghini huracan sto"].Name} : ${cars.Cars["2021 lamborghini huracan sto"].Obtained}\n
                ${cars.Cars["2021 lamborghini urus"].Emote} ${cars.Cars["2021 lamborghini urus"].Name} : ${cars.Cars["2021 lamborghini urus"].Obtained}\n
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/jkR1Hp5/exotickey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "police_option") {
            let embed2;
            embed2 = new MessageEmbed()

              .setTitle("Police Cars")
              .setFooter('Tip: Purchase a car with "/buy (full car name)"')
              .setDescription(
                `**
                Cadet\n
                ${cars.Cars["police 1998 ford crown victoria"].Emote} ${cars.Cars["police 1998 ford crown victoria"].Name} : $${cars.Cars["police 1998 ford crown victoria"].Price}\n
                ${cars.Cars["police 2020 ford explorer"].Emote} ${cars.Cars["police 2020 ford explorer"].Name} : $${cars.Cars["police 2020 ford explorer"].Price}\n
                ${cars.Cars["police 2012 dodge charger srt8"].Emote} ${cars.Cars["police 2012 dodge charger srt8"].Name} : $${cars.Cars["police 2012 dodge charger srt8"].Price}\n
                Cadet 2\n
                ${cars.Cars["police 2011 bmw m3"].Emote} ${cars.Cars["police 2011 bmw m3"].Name} : $${cars.Cars["police 2011 bmw m3"].Price}\n
                ${cars.Cars["police 2020 porsche 718 cayman"].Emote} ${cars.Cars["police 2020 porsche 718 cayman"].Name} : $${cars.Cars["police 2020 porsche 718 cayman"].Price}\n
                Cadet 3\n
                ${cars.Cars["police 2020 ford mustang"].Emote} ${cars.Cars["police 2020 ford mustang"].Name} : $${cars.Cars["police 2020 ford mustang"].Price}\n
                ${cars.Cars["police 2009 corvette c6"].Emote} ${cars.Cars["police 2009 corvette c6"].Name} : $${cars.Cars["police 2009 corvette c6"].Price}\n
                Chief\n
                ${cars.Cars["police 2006 lamborghini gallardo"].Emote} ${cars.Cars["police 2006 lamborghini gallardo"].Name} : $${cars.Cars["police 2006 lamborghini gallardo"].Price}\n
                ${cars.Cars["police 2008 bugatti veyron"].Emote} ${cars.Cars["police 2008 bugatti veyron"].Name} : $${cars.Cars["police 2008 bugatti veyron"].Price}\n
                **
                `
              )
              .setColor("#60b0f4")
              .setThumbnail("https://i.ibb.co/zJ7wvjv/policeclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          }
        });
      });
  },
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
