const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency } = require("../common/utils");
const { tipFooterPurchaseCar } = require("../common/tips");
const User = require("../schema/profile-schema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dealer")
    .setDescription("The car dealership"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select2")
        .setPlaceholder("Select a class")
        .addOptions([
          {
            label: "D Class",
            description: "Select this for the list of D class cars",
            value: "first_option",
            customId: "d_class",
            emoji: emotes.classD,
          },
          {
            label: "D Class Page 2",
            description: "Select this for the 2nd page of D class cars",
            value: "first_option_2",
            customId: "d_class",
            emoji: emotes.classD,
          },
          {
            label: "C Class",
            description: "Select this for the list of C class cars",
            value: "second_option",
            customId: "c_class",
            emoji: emotes.classC,
          },
          {
            label: "C Class Page 2",
            description: "Select this for the 2nd page of C class cars",
            value: "second_option_2",
            customId: "c_class",
            emoji: emotes.classC,
          },
          {
            label: "B Class",
            description: "Select this for the list of B class cars",
            value: "third_option",
            emoji: emotes.classB,
          },
          {
            label: "B Class Page 2",
            description: "Select this for the 2nd page of B class cars",
            value: "third_option_2",
            emoji: emotes.classB,
          },
          {
            label: "A Class",
            description: "Select this for the list of A class cars",
            value: "fourth_option",
            emoji: emotes.classA,
          },
          {
            label: "A Class Page 2",
            description: "Select this the 2nd page of A class cars",
            value: "fourth_option_2",
            emoji: emotes.classA,
          },
          {
            label: "S Class",
            description: "Select this for the list of S class cars",
            value: "fifth_option",
            emoji: emotes.classS,
          },
          {
            label: "U Class",
            description: "Select this for the list of U class cars",
            value: "special_option",
            emoji: emotes.classU,
          },
          {
            label: "EV Class",
            description: "Select this for the list of EV cars",
            value: "event_option",
            emoji: emotes.classEV,
          },
          {
            label: "Police Cars",
            description: "Select this for the list of police cars",
            value: "police_option",
            emoji: emotes.classPolice,
          },
          {
            label: "Common Imports",
            description: "Select this for the list of common import cars",
            value: "common_import",
            emoji: emotes.commonKey,
          },
          {
            label: "Rare Imports",
            description: "Select this for the list of rare import cars",
            value: "rare_import",
            emoji: emotes.rareKey,
          },
          {
            label: "Exotic Imports",
            description: "Select this for the list of exotic import cars",
            value: "exotic_import",
            emoji: emotes.exoticKey,
          },
          {
            label: "New Cars",
            description: "Select this for the list of new cars",
            value: "new_option",
            emoji: emotes.classRecentlyReleased,
          },
        ])
    );
    let userdata = await User.findOne({ id: interaction.user.id });
    let embed = new EmbedBuilder()
      .setTitle("Dealership")
      .setThumbnail("https://i.ibb.co/844BRBp/Logo-Makr-3-V9-MQG-1.png")
      .addFields([
        {
          name: "Available Classes",
          value: `
            *Choose a class from the drop down below*\n
            ${emotes.classD} D Class (Entry) ${emotes.classC} C Class\n
            ${emotes.classB} B Class ${emotes.classA} A Class\n
            ${emotes.classS} S Class ${emotes.classU} U Class (Best)\n
            ${emotes.classEV} EV Class ${emotes.classPolice} Police Cars\n
            ${emotes.classRecentlyReleased} Recently released cars
          `,
          inline: true,
        },
      ])
      .setColor(colors.blue).setDescription(`
        \`/buy (car id or car name)\` to buy a car\n
        \`CAR ID\`
        [Zero2Sixty Offical Discord Server](https://discord.gg/bHwqpxJnJk)
        [Buy me coffee!](https://www.buymeacoffee.com/zero2sixty)\n
      `);
    interaction
      .reply({ embeds: [embed], components: [row], fetchReply: true })
      .then(async (msg) => {
        const filter = (interaction) =>
          interaction.isSelectMenu() &&
          interaction.user.id === interaction.user.id;

        const collector = msg.createMessageComponentCollector({
          filter,
        });
        if (userdata.tutorial && userdata.tutorial.stage == 1) {
          console.log("tutorial");
          interaction.channel.send({
            content: `Use the \`/buy [car id]\` command to buy your first car! **Example: /buy 2002 mustang**`,
          });
        }

        collector.on("collect", async (collected) => {
          const value = collected.values[0];
          if (value === "first_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("D Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1
                ${cars.Cars["1995 mazda miata"].Emote} ${
                  cars.Cars["1995 mazda miata"].Name
                } :  ${toCurrency(cars.Cars["1995 mazda miata"].Price)}
                \`${cars.Cars["1995 mazda miata"].alias}\`\n
                ${cars.Cars["1999 honda civic si"].Emote} ${
                  cars.Cars["1999 honda civic si"].Name
                } : ${toCurrency(cars.Cars["1999 honda civic si"].Price)}
                \`${cars.Cars["1999 honda civic si"].alias}\`\n
                ${cars.Cars["1997 acura integra"].Emote} ${
                  cars.Cars["1997 acura integra"].Name
                } : ${toCurrency(cars.Cars["1997 acura integra"].Price)}
                \`${cars.Cars["1997 acura integra"].alias}\`\n
                ${cars.Cars["2005 hyundai tiburon"].Emote} ${
                  cars.Cars["2005 hyundai tiburon"].Name
                } :  ${toCurrency(cars.Cars["2005 hyundai tiburon"].Price)}
                \`${cars.Cars["2005 hyundai tiburon"].alias}\`\n
                ${cars.Cars["1991 toyota mr2"].Emote} ${
                  cars.Cars["1991 toyota mr2"].Name
                } : ${toCurrency(cars.Cars["1991 toyota mr2"].Price)}
                \`${cars.Cars["1991 toyota mr2"].alias}\`\n 
                ${cars.Cars["2002 pontiac firebird"].Emote} ${
                  cars.Cars["2002 pontiac firebird"].Name
                } : ${toCurrency(cars.Cars["2002 pontiac firebird"].Price)}
                \`${cars.Cars["2002 pontiac firebird"].alias}\`\n
                ${cars.Cars["2011 scion tc"].Emote} ${
                  cars.Cars["2011 scion tc"].Name
                } : ${toCurrency(cars.Cars["2011 scion tc"].Price)}
                \`${cars.Cars["2011 scion tc"].alias}\`\n
                ${cars.Cars["2002 ford mustang"].Emote} ${
                  cars.Cars["2002 ford mustang"].Name
                } : ${toCurrency(cars.Cars["2002 ford mustang"].Price)}
                \`${cars.Cars["2002 ford mustang"].alias}\`\n
                ${cars.Cars["2012 hyundai veloster"].Emote} ${
                  cars.Cars["2012 hyundai veloster"].Name
                } : ${toCurrency(cars.Cars["2012 hyundai veloster"].Price)}
                \`${cars.Cars["2012 hyundai veloster"].alias}\`\n
                ${cars.Cars["1986 toyota ae86"].Emote} ${
                  cars.Cars["1986 toyota ae86"].Name
                } : ${toCurrency(cars.Cars["1986 toyota ae86"].Price)}
                \`${cars.Cars["1986 toyota ae86"].alias}\`\n
                ${cars.Cars["2007 infiniti g35 coupe"].Emote} ${
                  cars.Cars["2007 infiniti g35 coupe"].Name
                } : ${toCurrency(cars.Cars["2007 infiniti g35 coupe"].Price)}
                \`${cars.Cars["2007 infiniti g35 coupe"].alias}\`\n
                ${cars.Cars["1999 mitsubishi eclipse"].Emote} ${
                  cars.Cars["1999 mitsubishi eclipse"].Name
                } : ${toCurrency(cars.Cars["1999 mitsubishi eclipse"].Price)}
                \`${cars.Cars["1999 mitsubishi eclipse"].alias}\`\n
                ${cars.Cars["2000 toyota corolla levin"].Emote} ${
                  cars.Cars["2000 toyota corolla levin"].Name
                } : ${toCurrency(cars.Cars["2000 toyota corolla levin"].Price)}
                \`${cars.Cars["2000 toyota corolla levin"].alias}\`\n
                ${cars.Cars["2009 volkswagen golf gti"].Emote} ${
                  cars.Cars["2009 volkswagen golf gti"].Name
                } : ${toCurrency(cars.Cars["2009 volkswagen golf gti"].Price)}
                \`${cars.Cars["2009 volkswagen golf gti"].alias}\`\n
                ${cars.Cars["2005 dodge neon srt4"].Emote} ${
                  cars.Cars["2005 dodge neon srt4"].Name
                } : ${toCurrency(cars.Cars["2005 dodge neon srt4"].Price)}
                \`${cars.Cars["2005 dodge neon srt4"].alias}\`\n
                **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/NZ8ySF8/Dclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "first_option_2") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("D Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 2
                ${cars.Cars["1998 bmw m3 e36"].Emote} ${
                  cars.Cars["1998 bmw m3 e36"].Name
                } : ${toCurrency(cars.Cars["1998 bmw m3 e36"].Price)}
                \`${cars.Cars["1998 bmw m3 e36"].alias}\`\n
                ${cars.Cars["1998 pontiac fiero"].Emote} ${
                  cars.Cars["1998 pontiac fiero"].Name
                } : ${toCurrency(cars.Cars["1998 pontiac fiero"].Price)}
                \`${cars.Cars["1998 pontiac fiero"].alias}\`\n
              ${cars.Cars["1989 chevy camaro"].Emote} ${
                  cars.Cars["1989 chevy camaro"].Name
                } : ${toCurrency(cars.Cars["1989 chevy camaro"].Price)}
                \`${cars.Cars["1989 chevy camaro"].alias}\`\n
              ${cars.Cars["2008 nissan 350z"].Emote} ${
                  cars.Cars["2008 nissan 350z"].Name
                } : ${toCurrency(cars.Cars["2008 nissan 350z"].Price)}
                \`${cars.Cars["2008 nissan 350z"].alias}\`\n
              ${cars.Cars["2014 hyundai genesis coupe"].Emote} ${
                  cars.Cars["2014 hyundai genesis coupe"].Name
                } : ${toCurrency(cars.Cars["2014 hyundai genesis coupe"].Price)}
                \`${cars.Cars["2014 hyundai genesis coupe"].alias}\`\n
              ${cars.Cars["2019 subaru brz"].Emote} ${
                  cars.Cars["2019 subaru brz"].Name
                } : ${toCurrency(cars.Cars["2019 subaru brz"].Price)}
                \`${cars.Cars["2019 subaru brz"].alias}\`\n
              ${cars.Cars["2022 toyota gr86"].Emote} ${
                  cars.Cars["2022 toyota gr86"].Name
                } : ${toCurrency(cars.Cars["2022 toyota gr86"].Price)}
                \`${cars.Cars["2022 toyota gr86"].alias}\`
              **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/NZ8ySF8/Dclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "second_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("C Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["1992 toyota supra mk3"].Emote} ${
                  cars.Cars["1992 toyota supra mk3"].Name
                } : ${toCurrency(cars.Cars["1992 toyota supra mk3"].Price)}
                \`${cars.Cars["1992 toyota supra mk3"].alias}\`\n
                ${cars.Cars["2004 subaru wrx sti"].Emote} ${
                  cars.Cars["2004 subaru wrx sti"].Name
                } : ${toCurrency(cars.Cars["2004 subaru wrx sti"].Price)}
                \`${cars.Cars["2004 subaru wrx sti"].alias}\`\n
                ${cars.Cars["2010 ford mustang"].Emote} ${
                  cars.Cars["2010 ford mustang"].Name
                } : ${toCurrency(cars.Cars["2010 ford mustang"].Price)}
                \`${cars.Cars["2010 ford mustang"].alias}\`\n
                ${cars.Cars["2002 bmw m3 gtr"].Emote} ${
                  cars.Cars["2002 bmw m3 gtr"].Name
                } : ${toCurrency(cars.Cars["2002 bmw m3 gtr"].Price)}
                \`${cars.Cars["2002 bmw m3 gtr"].alias}\`\n
                ${cars.Cars["1989 nissan skyline r32"].Emote} ${
                  cars.Cars["1989 nissan skyline r32"].Name
                } : ${toCurrency(cars.Cars["1989 nissan skyline r32"].Price)}
                \`${cars.Cars["1989 nissan skyline r32"].alias}\`\n
                ${cars.Cars["1995 nissan skyline r33"].Emote} ${
                  cars.Cars["1995 nissan skyline r33"].Name
                } : ${toCurrency(cars.Cars["1995 nissan skyline r33"].Price)}
                \`${cars.Cars["1995 nissan skyline r33"].alias}\`\n
                ${cars.Cars["2013 mazda speed3"].Emote} ${
                  cars.Cars["2013 mazda speed3"].Name
                } : ${toCurrency(cars.Cars["2013 mazda speed3"].Price)}
                \`${cars.Cars["2013 mazda speed3"].alias}\`\n
                ${cars.Cars["2010 chevy camaro v6"].Emote} ${
                  cars.Cars["2010 chevy camaro v6"].Name
                } : ${toCurrency(cars.Cars["2010 chevy camaro v6"].Price)}
                \`${cars.Cars["2010 chevy camaro v6"].alias}\`\n
                ${cars.Cars["2001 toyota supra mk4"].Emote} ${
                  cars.Cars["2001 toyota supra mk4"].Name
                } : ${toCurrency(cars.Cars["2001 toyota supra mk4"].Price)}
                \`${cars.Cars["2001 toyota supra mk4"].alias}\`\n
                ${cars.Cars["2007 mitsubishi evo ix"].Emote} ${
                  cars.Cars["2007 mitsubishi evo ix"].Name
                } : ${toCurrency(cars.Cars["2007 mitsubishi evo ix"].Price)}
                \`${cars.Cars["2007 mitsubishi evo ix"].alias}\`\n
                ${cars.Cars["2002 mazda rx7 fd"].Emote} ${
                  cars.Cars["2002 mazda rx7 fd"].Name
                } : ${toCurrency(cars.Cars["2002 mazda rx7 fd"].Price)}
                \`${cars.Cars["2002 mazda rx7 fd"].alias}\`\n
                ${cars.Cars["1994 mitsubishi 3000gt vr4"].Emote} ${
                  cars.Cars["1994 mitsubishi 3000gt vr4"].Name
                } : ${toCurrency(cars.Cars["1994 mitsubishi 3000gt vr4"].Price)}
                \`${cars.Cars["1994 mitsubishi 3000gt vr4"].alias}\`\n
                ${cars.Cars["2009 honda s2000 cr"].Emote} ${
                  cars.Cars["2009 honda s2000 cr"].Name
                } : ${toCurrency(cars.Cars["2009 honda s2000 cr"].Price)}
                \`${cars.Cars["2009 honda s2000 cr"].alias}\`\n
                ${cars.Cars["2018 honda civic type r"].Emote} ${
                  cars.Cars["2018 honda civic type r"].Name
                } : ${toCurrency(cars.Cars["2018 honda civic type r"].Price)}
                \`${cars.Cars["2018 honda civic type r"].alias}\`\n
                ${cars.Cars["2002 nissan skyline r34"].Emote} ${
                  cars.Cars["2002 nissan skyline r34"].Name
                } : ${toCurrency(cars.Cars["2002 nissan skyline r34"].Price)}
                \`${cars.Cars["2002 nissan skyline r34"].alias}\`\n
                **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/XxvHmCc/cclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "second_option_2") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("C Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 2\n
                ${cars.Cars["1994 porsche 911"].Emote} ${
                  cars.Cars["1994 porsche 911"].Name
                } : ${toCurrency(cars.Cars["1994 porsche 911"].Price)}
                \`${cars.Cars["1994 porsche 911"].alias}\`\n
                ${cars.Cars["2004 corvette c5"].Emote} ${
                  cars.Cars["2004 corvette c5"].Name
                } : ${toCurrency(cars.Cars["2004 corvette c5"].Price)}
                \`${cars.Cars["2004 corvette c5"].alias}\`\n
                ${cars.Cars["1990 bmw 850i"].Emote} ${
                  cars.Cars["1990 bmw 850i"].Name
                } : ${toCurrency(cars.Cars["1990 bmw 850i"].Price)}
                \`${cars.Cars["1990 bmw 850i"].alias}\`\n
                ${cars.Cars["2018 kia stinger"].Emote} ${
                  cars.Cars["2018 kia stinger"].Name
                } : ${toCurrency(cars.Cars["2018 kia stinger"].Price)}
                \`${cars.Cars["2018 kia stinger"].alias}\`\n
                ${cars.Cars["2015 hsv gts maloo"].Emote} ${
                  cars.Cars["2015 hsv gts maloo"].Name
                } : ${toCurrency(cars.Cars["2015 hsv gts maloo"].Price)}
                \`${cars.Cars["2015 hsv gts maloo"].alias}\`
                **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/XxvHmCc/cclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "third_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("B Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1
                ${cars.Cars["2020 audi tt rs"].Emote} ${
                  cars.Cars["2020 audi tt rs"].Name
                } : ${toCurrency(cars.Cars["2020 audi tt rs"].Price)}
                \`${cars.Cars["2020 audi tt rs"].alias}\`\n
                ${cars.Cars["2021 lexus rc f"].Emote} ${
                  cars.Cars["2021 lexus rc f"].Name
                } : ${toCurrency(cars.Cars["2021 lexus rc f"].Price)}
                \`${cars.Cars["2021 lexus rc f"].alias}\`\n
                ${cars.Cars["2011 bmw m3"].Emote} ${
                  cars.Cars["2011 bmw m3"].Name
                } : ${toCurrency(cars.Cars["2011 bmw m3"].Price)}
                \`${cars.Cars["2011 bmw m3"].alias}\`\n
                ${cars.Cars["2020 nissan 370z nismo"].Emote} ${
                  cars.Cars["2020 nissan 370z nismo"].Name
                } : ${toCurrency(cars.Cars["2020 nissan 370z nismo"].Price)}
                \`${cars.Cars["2020 nissan 370z nismo"].alias}\`\n
                ${cars.Cars["2021 toyota supra"].Emote} ${
                  cars.Cars["2021 toyota supra"].Name
                } : ${toCurrency(cars.Cars["2021 toyota supra"].Price)}
                \`${cars.Cars["2021 toyota supra"].alias}\`\n**
                **${cars.Cars["2020 porsche 718 cayman"].Emote} ${
                  cars.Cars["2020 porsche 718 cayman"].Name
                } : ${toCurrency(cars.Cars["2020 porsche 718 cayman"].Price)}
                \`${
                  cars.Cars["2020 porsche 718 cayman"].alias
                }\`**\n *TRIMS AVAILABLE*
                **${cars.Cars["2023 nissan z"].Emote} ${
                  cars.Cars["2023 nissan z"].Name
                } : ${toCurrency(cars.Cars["2023 nissan z"].Price)}
                \`${cars.Cars["2023 nissan z"].alias}\`\n
                ${cars.Cars["2012 lotus evora s"].Emote} ${
                  cars.Cars["2012 lotus evora s"].Name
                } : ${toCurrency(cars.Cars["2012 lotus evora s"].Price)}
                \`${cars.Cars["2012 lotus evora s"].alias}\`\n
                ${cars.Cars["2015 lotus exige sport"].Emote} ${
                  cars.Cars["2015 lotus exige sport"].Name
                } : ${toCurrency(cars.Cars["2015 lotus exige sport"].Price)}
                \`${cars.Cars["2015 lotus exige sport"].alias}\`\n
                ${cars.Cars["2011 audi rs5"].Emote} ${
                  cars.Cars["2011 audi rs5"].Name
                } : ${toCurrency(cars.Cars["2011 audi rs5"].Price)}
                \`${cars.Cars["2011 audi rs5"].alias}\`\n
                ${cars.Cars["2019 chevy camaro zl1"].Emote} ${
                  cars.Cars["2019 chevy camaro zl1"].Name
                } : ${toCurrency(cars.Cars["2019 chevy camaro zl1"].Price)}
                \`${cars.Cars["2019 chevy camaro zl1"].alias}\`\n
                ${cars.Cars["2012 dodge charger srt8"].Emote} ${
                  cars.Cars["2012 dodge charger srt8"].Name
                } : ${toCurrency(cars.Cars["2012 dodge charger srt8"].Price)}
                \`${cars.Cars["2012 dodge charger srt8"].alias}\`\n
                ${cars.Cars["2021 ford mustang mach 1"].Emote} ${
                  cars.Cars["2021 ford mustang mach 1"].Name
                } : ${toCurrency(cars.Cars["2021 ford mustang mach 1"].Price)}
                \`${cars.Cars["2021 ford mustang mach 1"].alias}\`\n
                ${cars.Cars["2012 dodge challenger srt8"].Emote} ${
                  cars.Cars["2012 dodge challenger srt8"].Name
                } : ${toCurrency(cars.Cars["2012 dodge challenger srt8"].Price)}
                \`${cars.Cars["2012 dodge challenger srt8"].alias}\`
                **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/5KHHqVW/Bclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "third_option_2") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("B Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 2
                ${cars.Cars["2017 dodge viper acr"].Emote} ${
                  cars.Cars["2017 dodge viper acr"].Name
                } : ${toCurrency(cars.Cars["2017 dodge viper acr"].Price)}
                \`${cars.Cars["2017 dodge viper acr"].alias}\`\n
                ${cars.Cars["2016 jaguar f type"].Emote} ${
                  cars.Cars["2016 jaguar f type"].Name
                } : ${toCurrency(cars.Cars["2016 jaguar f type"].Price)}
                \`${cars.Cars["2016 jaguar f type"].alias}\`\n
                ${cars.Cars["2009 corvette c6"].Emote} ${
                  cars.Cars["2009 corvette c6"].Name
                } : ${toCurrency(cars.Cars["2009 corvette c6"].Price)}
                \`${cars.Cars["2009 corvette c6"].alias}\`\n**
                **${cars.Cars["2019 chevy corvette c7"].Emote} ${
                  cars.Cars["2019 chevy corvette c7"].Name
                } : ${toCurrency(cars.Cars["2019 chevy corvette c7"].Price)}
                \`${
                  cars.Cars["2019 chevy corvette c7"].alias
                }\`\n** *TRIMS AVAILABLE*
                **${cars.Cars["2020 chevy corvette c8"].Emote} ${
                  cars.Cars["2020 chevy corvette c8"].Name
                } : ${toCurrency(cars.Cars["2020 chevy corvette c8"].Price)}
                \`${cars.Cars["2020 chevy corvette c8"].alias}\`\n
                ${cars.Cars["2015 mercedes amg gts"].Emote} ${
                  cars.Cars["2015 mercedes amg gts"].Name
                } : ${toCurrency(cars.Cars["2015 mercedes amg gts"].Price)}
                \`${cars.Cars["2015 mercedes amg gts"].alias}\`\n
                ${cars.Cars["2016 alfa romeo giulia"].Emote} ${
                  cars.Cars["2016 alfa romeo giulia"].Name
                } : ${toCurrency(cars.Cars["2016 alfa romeo giulia"].Price)}
                \`${cars.Cars["2016 alfa romeo giulia"].alias}\`**
                `
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/5KHHqVW/Bclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fourth_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("A Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1
                ${cars.Cars["2016 bmw i8"].Emote} ${
                  cars.Cars["2016 bmw i8"].Name
                } : ${toCurrency(cars.Cars["2016 bmw i8"].Price)}
                \`${cars.Cars["2016 bmw i8"].alias}\`\n
                ${cars.Cars["1998 ferrari f355"].Emote} ${
                  cars.Cars["1998 ferrari f355"].Name
                } : ${toCurrency(cars.Cars["1998 ferrari f355"].Price)}
                \`${cars.Cars["1998 ferrari f355"].alias}\`\n
                ${cars.Cars["2022 maserati mc20"].Emote} ${
                  cars.Cars["2022 maserati mc20"].Name
                } : ${toCurrency(cars.Cars["2022 maserati mc20"].Price)}
                \`${cars.Cars["2022 maserati mc20"].alias}\`\n
                ${cars.Cars["2021 nissan gtr"].Emote} ${
                  cars.Cars["2021 nissan gtr"].Name
                } : ${toCurrency(cars.Cars["2021 nissan gtr"].Price)}
                \`${cars.Cars["2021 nissan gtr"].alias}\`\n
                ${cars.Cars["1993 jaguar xj220"].Emote} ${
                  cars.Cars["1993 jaguar xj220"].Name
                } : ${toCurrency(cars.Cars["1993 jaguar xj220"].Price)}
                \`${cars.Cars["1993 jaguar xj220"].alias}\`\n
                ${cars.Cars["2021 porsche 911 gt3"].Emote} ${
                  cars.Cars["2021 porsche 911 gt3"].Name
                } : ${toCurrency(cars.Cars["2021 porsche 911 gt3"].Price)}
                \`${cars.Cars["2021 porsche 911 gt3"].alias}\`\n
                ${cars.Cars["2013 lexus lfa"].Emote} ${
                  cars.Cars["2013 lexus lfa"].Name
                } : ${toCurrency(cars.Cars["2013 lexus lfa"].Price)}
                \`${cars.Cars["2013 lexus lfa"].alias}\`\n
                ${cars.Cars["2017 ford gt"].Emote} ${
                  cars.Cars["2017 ford gt"].Name
                } : ${toCurrency(cars.Cars["2017 ford gt"].Price)}
                \`${cars.Cars["2017 ford gt"].alias}\`\n
                ${cars.Cars["2014 lamborghini huracan"].Emote} ${
                  cars.Cars["2014 lamborghini huracan"].Name
                } : ${toCurrency(cars.Cars["2014 lamborghini huracan"].Price)}
                \`${cars.Cars["2014 lamborghini huracan"].alias}\`\n
                ${cars.Cars["2018 audi r8"].Emote} ${
                  cars.Cars["2018 audi r8"].Name
                } : ${toCurrency(cars.Cars["2018 audi r8"].Price)}
                \`${cars.Cars["2018 audi r8"].alias}\`\n
                ${cars.Cars["2014 mclaren 12c"].Emote} ${
                  cars.Cars["2014 mclaren 12c"].Name
                } : ${toCurrency(cars.Cars["2014 mclaren 12c"].Price)}
                \`${cars.Cars["2014 mclaren 12c"].alias}\`\n
                ${cars.Cars["2021 mclaren gt"].Emote} ${
                  cars.Cars["2021 mclaren gt"].Name
                } : ${toCurrency(cars.Cars["2021 mclaren gt"].Price)}
                \`${cars.Cars["2021 mclaren gt"].alias}\`\n
                ${cars.Cars["2020 mclaren 570s"].Emote} ${
                  cars.Cars["2020 mclaren 570s"].Name
                } : ${toCurrency(cars.Cars["2020 mclaren 570s"].Price)}
                \`${cars.Cars["2020 mclaren 570s"].alias}\`\n
                ${cars.Cars["2016 bentley continental gt speed"].Emote} ${
                  cars.Cars["2016 bentley continental gt speed"].Name
                } : ${toCurrency(
                  cars.Cars["2016 bentley continental gt speed"].Price
                )}
                \`${cars.Cars["2016 bentley continental gt speed"].alias}\`\n
                ${cars.Cars["2020 aston martin vantage"].Emote} ${
                  cars.Cars["2020 aston martin vantage"].Name
                } : ${toCurrency(cars.Cars["2020 aston martin vantage"].Price)}
                \`${cars.Cars["2020 aston martin vantage"].alias}\`\n
                **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/T0Cd62J/aclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fourth_option_2") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("A Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 2\n
                ${cars.Cars["2011 aston martin one-77"].Emote} ${
                  cars.Cars["2011 aston martin one-77"].Name
                } : ${toCurrency(cars.Cars["2011 aston martin one-77"].Price)}
                \`${cars.Cars["2011 aston martin one-77"].alias}\`\n
                ${cars.Cars["2018 ferrari california"].Emote} ${
                  cars.Cars["2018 ferrari california"].Name
                } : ${toCurrency(cars.Cars["2018 ferrari california"].Price)}
                \`${cars.Cars["2018 ferrari california"].alias}\`\n
                ${cars.Cars["2005 pagani zonda f"].Emote} ${
                  cars.Cars["2005 pagani zonda f"].Name
                } : ${toCurrency(cars.Cars["2005 pagani zonda f"].Price)}
                \`${cars.Cars["2005 pagani zonda f"].alias}\`\n
                ${cars.Cars["2010 ferrari 458 italia"].Emote} ${
                  cars.Cars["2010 ferrari 458 italia"].Name
                } : ${toCurrency(cars.Cars["2010 ferrari 458 italia"].Price)}
                \`${cars.Cars["2010 ferrari 458 italia"].alias}\`\n**
                **${cars.Cars["2006 lamborghini gallardo"].Emote} ${
                  cars.Cars["2006 lamborghini gallardo"].Name
                } : ${toCurrency(cars.Cars["2006 lamborghini gallardo"].Price)}
                \`${
                  cars.Cars["2006 lamborghini gallardo"].alias
                }\`** *TRIMS AVAILABLE*\n
                `
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/T0Cd62J/aclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "fifth_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("S Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                  Page 1
                  ${cars.Cars["2018 lamborghini aventador s"].Emote} ${
                  cars.Cars["2018 lamborghini aventador s"].Name
                } : ${toCurrency(
                  cars.Cars["2018 lamborghini aventador s"].Price
                )}
                \`${cars.Cars["2018 lamborghini aventador s"].alias}\`\n
                  ${cars.Cars["2014 porsche 918 spyder"].Emote} ${
                  cars.Cars["2014 porsche 918 spyder"].Name
                } : ${toCurrency(cars.Cars["2014 porsche 918 spyder"].Price)}
                \`${cars.Cars["2014 porsche 918 spyder"].alias}\`\n
                  ${cars.Cars["2012 pagani huayra"].Emote} ${
                  cars.Cars["2012 pagani huayra"].Name
                } : ${toCurrency(cars.Cars["2012 pagani huayra"].Price)}
                \`${cars.Cars["2012 pagani huayra"].alias}\`\n
                  ${cars.Cars["2013 mclaren p1"].Emote} ${
                  cars.Cars["2013 mclaren p1"].Name
                } : ${toCurrency(cars.Cars["2013 mclaren p1"].Price)}
                \`${cars.Cars["2013 mclaren p1"].alias}\`\n
                  ${cars.Cars["2021 mclaren 720s"].Emote} ${
                  cars.Cars["2021 mclaren 720s"].Name
                } : ${toCurrency(cars.Cars["2021 mclaren 720s"].Price)}
                \`${cars.Cars["2021 mclaren 720s"].alias}\`\n
                  ${cars.Cars["2021 ferrari sf90 stradale"].Emote} ${
                  cars.Cars["2021 ferrari sf90 stradale"].Name
                } : ${toCurrency(cars.Cars["2021 ferrari sf90 stradale"].Price)}
                \`${cars.Cars["2021 ferrari sf90 stradale"].alias}\`\n
                  ${cars.Cars["2017 mercedes amg one"].Emote} ${
                  cars.Cars["2017 mercedes amg one"].Name
                } : ${toCurrency(cars.Cars["2017 mercedes amg one"].Price)}
                \`${cars.Cars["2017 mercedes amg one"].alias}\`\n
                  ${cars.Cars["2008 bugatti veyron"].Emote} ${
                  cars.Cars["2008 bugatti veyron"].Name
                } : ${toCurrency(cars.Cars["2008 bugatti veyron"].Price)}
                \`${cars.Cars["2008 bugatti veyron"].alias}\`\n
                  ${cars.Cars["2022 aston martin valkyrie"].Emote} ${
                  cars.Cars["2022 aston martin valkyrie"].Name
                } : ${toCurrency(cars.Cars["2022 aston martin valkyrie"].Price)}
                \`${cars.Cars["2022 aston martin valkyrie"].alias}\`\n
                  ${cars.Cars["2016 bugatti chiron"].Emote} ${
                  cars.Cars["2016 bugatti chiron"].Name
                } : ${toCurrency(cars.Cars["2016 bugatti chiron"].Price)}
                \`${cars.Cars["2016 bugatti chiron"].alias}\`\n
                  ${cars.Cars["2018 koenigsegg agera"].Emote} ${
                  cars.Cars["2018 koenigsegg agera"].Name
                } : ${toCurrency(cars.Cars["2018 koenigsegg agera"].Price)}
                \`${cars.Cars["2018 koenigsegg agera"].alias}\`
                  **`
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/Z13KtH8/sclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "special_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("U Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2013 lamborghini veneno"].Emote} ${
                  cars.Cars["2013 lamborghini veneno"].Name
                } : ${toCurrency(cars.Cars["2013 lamborghini veneno"].Price)}
                \`${cars.Cars["2013 lamborghini veneno"].alias}\`\n
                ${cars.Cars["2021 bugatti bolide"].Emote} ${
                  cars.Cars["2021 bugatti bolide"].Name
                } : ${toCurrency(cars.Cars["2021 bugatti bolide"].Price)}
                \`${cars.Cars["2021 bugatti bolide"].alias}\`\n
                ${cars.Cars["2020 koenigsegg regera"].Emote} ${
                  cars.Cars["2020 koenigsegg regera"].Name
                } : ${toCurrency(cars.Cars["2020 koenigsegg regera"].Price)}
                \`${cars.Cars["2020 koenigsegg regera"].alias}\`\n
                ${cars.Cars["2021 koenigsegg gemera"].Emote} ${
                  cars.Cars["2021 koenigsegg gemera"].Name
                } : ${toCurrency(cars.Cars["2021 koenigsegg gemera"].Price)}
                \`${cars.Cars["2021 koenigsegg gemera"].alias}\`\n
                ${cars.Cars["2020 bugatti divo"].Emote} ${
                  cars.Cars["2020 bugatti divo"].Name
                } : ${toCurrency(cars.Cars["2020 bugatti divo"].Price)}
                \`${cars.Cars["2020 bugatti divo"].alias}\`\n
                ${cars.Cars["2020 koenigsegg jesko"].Emote} ${
                  cars.Cars["2020 koenigsegg jesko"].Name
                } : ${toCurrency(cars.Cars["2020 koenigsegg jesko"].Price)}
                \`${cars.Cars["2020 koenigsegg jesko"].alias}\`\n
                ${cars.Cars["2020 ssc tuatara"].Emote} ${
                  cars.Cars["2020 ssc tuatara"].Name
                } : ${toCurrency(cars.Cars["2020 ssc tuatara"].Price)}
                \`${cars.Cars["2020 ssc tuatara"].alias}\`\n
                ${cars.Cars["thrust ssc"].Emote} ${
                  cars.Cars["thrust ssc"].Name
                } : ${toCurrency(cars.Cars["thrust ssc"].Price)}
                \`${cars.Cars["thrust ssc"].alias}\`
                **
                `
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/9r2LJFT/UCLASS.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "event_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("EV Class")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `**
                Page 1\n
                ${cars.Cars["2022 ford mustang mach e"].Emote} ${
                  cars.Cars["2022 ford mustang mach e"].Name
                } : ${toCurrency(cars.Cars["2022 ford mustang mach e"].Price)}\n
                ${cars.Cars["2020 tesla model s"].Emote} ${
                  cars.Cars["2020 tesla model s"].Name
                } : ${toCurrency(cars.Cars["2020 tesla model s"].Price)}\n
                ${cars.Cars["2022 audi e tron gt"].Emote} ${
                  cars.Cars["2022 audi e tron gt"].Name
                } : ${toCurrency(cars.Cars["2022 audi e tron gt"].Price)}\n
                ${cars.Cars["2022 porsche taycan"].Emote} ${
                  cars.Cars["2022 porsche taycan"].Name
                } : ${toCurrency(cars.Cars["2022 porsche taycan"].Price)}\n
                ${cars.Cars["2021 tesla model s plaid"].Emote} ${
                  cars.Cars["2021 tesla model s plaid"].Name
                } : ${toCurrency(cars.Cars["2021 tesla model s plaid"].Price)}\n
                ${cars.Cars["2020 lotus evija"].Emote} ${
                  cars.Cars["2020 lotus evija"].Name
                } : ${toCurrency(cars.Cars["2020 lotus evija"].Price)}\n
                ${cars.Cars["2022 rimac nevera"].Emote} ${
                  cars.Cars["2022 rimac nevera"].Name
                } : ${toCurrency(cars.Cars["2022 rimac nevera"].Price)}
                **
                `
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/Qv4Grxk/EVCLASS.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "new_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("New Cars")
              .setFooter(tipFooterPurchaseCar)
              .setDescription(
                `
                Page 1\n
                **${cars.Cars["2016 bmw m6"].Emote} ${cars.Cars["2016 bmw m6"].Name} : ${cars.Cars["2016 bmw m6"].Obtained}\n
                ${cars.Cars["2022 ferrari br20"].Emote} ${cars.Cars["2022 ferrari br20"].Name} : ${cars.Cars["2022 ferrari br20"].Obtained}\n**
                `
              )
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/BTj07zB/newlogo2.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "common_import") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("Common Import Cars")
              .setFooter(tipFooterPurchaseCar)
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
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/k674kNj/commonkey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "rare_import") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("Rare Import Cars")
              .setFooter(tipFooterPurchaseCar)
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
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/jvswjhm/rarekey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "exotic_import") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("Exotic Import Cars")
              .setFooter(tipFooterPurchaseCar)
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
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/jkR1Hp5/exotickey.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          } else if (value === "police_option") {
            let embed2;
            embed2 = new EmbedBuilder()

              .setTitle("Police Cars")
              .setFooter(tipFooterPurchaseCar)
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
              .setColor(colors.blue)
              .setThumbnail("https://i.ibb.co/zJ7wvjv/policeclass.png");
            interaction.editReply({ embeds: [embed2], components: [row] });
          }
        });
      });
  },
};
