const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View the default stats of a car or part")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("car_part")
        .setDescription("Get the default stats of a car")
        .addStringOption((option) =>
          option
            .setName("item")
            .setDescription("The item you want to see the stats for")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("carid")
        .setDescription("Get the stats and parts of your car")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The car you want to see the stats for")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("If you'd like to see the stats of a users car")
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    let subcommandfetch = interaction.options.getSubcommand();

    var list = cars.Cars;
    var item = interaction.options.getString("item");
    if (subcommandfetch == "car_part" && item && list[item.toLowerCase()]) {
      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;

      let car = item.toLowerCase();
      let carindb = list[car];
      if (!carindb) return interaction.reply(`Thats not a car!`);

      let trims = carindb.Trims || ["❌ No Trims"];
      let sellprice = carindb.Price * 0.65;
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${carindb.Emote} ${carindb.Name}`)
        .addFields([
          {
            name: `Speed`,
            value: `${speedemote} ${carindb.Speed}`,
            inline: true,
          },
          {
            name: `Acceleration`,
            value: `${accelerationemote} ${carindb["0-60"]}`,
            inline: true,
          },
          {
            name: `Handling`,
            value: `${handlingemote} ${carindb.Handling}`,
            inline: true,
          },
          {
            name: `Price`,
            value: `${toCurrency(carindb.Price)}`,
            inline: true,
          },
          {
            name: `Sell Price`,
            value: `${toCurrency(sellprice)}`,
            inline: true,
          },
          { name: `Trims`, value: `${trims.join("\n")}`, inline: true },
        ])

        .setColor(colors.blue)

        .setImage(carindb.Image);

      interaction.reply({ embeds: [embed] });
    } else if (subcommandfetch == "carid") {
      let idtoselect = interaction.options.getString("id");
      let userdata = await User.findOne({ id: interaction.user.id });
      let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
      let selected = filteredcar[0] || "No ID";
      if (selected == "No ID") {
        let errembed = new Discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor("DARK_RED")
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return interaction.reply({ embeds: [errembed] });
      }

      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;

      let carindb = selected;
      let sellprice = selected.Price || 0;
      let cardrift = selected.Drift || 0;
      let carimage = carindb.Livery || list[selected.Name.toLowerCase()].Image;
      console.log(sellprice);
      let embed = new Discord.EmbedBuilder()
        .setTitle(
          `Stats for ${interaction.user.username}'s ${carindb.Emote} ${carindb.Name}`
        )
        .addFields([
          {
            name: `Speed`,
            value: `${speedemote} ${carindb.Speed} MPH`,
            inline: true,
          },
          {
            name: `Acceleration`,
            value: `${accelerationemote} ${carindb.Acceleration}s`,
            inline: true,
          },
          {
            name: `Handling`,
            value: `${handlingemote} ${carindb.Handling}`,
            inline: true,
          },
          {
            name: `Drift`,
            value: `${handlingemote} ${cardrift}`,
            inline: true,
          },
          {
            name: `Sell Price`,
            value: `${toCurrency(sellprice)}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ])

        .setColor(colors.blue)

        .setImage(carimage);
      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("parts")
          .setEmoji("⚙️")
          .setLabel("Parts")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("stats")
          .setEmoji("📈")
          .setLabel("Stats")
          .setStyle("Secondary")
      );

      let msg = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });

      let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };

      const collector2 = msg.createMessageComponentCollector({
        filter,
      });

      collector2.on("collect", async (i) => {
        if (i.customId.includes("parts")) {
          let exhaust = selected.Exhaust || "Stock";
          let intake = selected.Intake || "Stock";
          let suspension = selected.Suspension || "Stock";
          let tires = selected.Tires || "Stock";
          let engine = selected.Engine || "Stock";
          let clutch = selected.Clutch || "Stock";
          let ecu = selected.ECU || "Stock";
          let turbo = selected.Turbo || "Stock";

          let partindb = partdb.Parts;

          let exhaustemote = partindb[exhaust.toLowerCase()].Emote || "🔵";
          let intakeemote = partindb[intake.toLowerCase()].Emote || "🔵";
          let suspensionemote =
            partindb[suspension.toLowerCase()].Emote || "🔵";
          let tiresemote = partindb[tires.toLowerCase()].Emote || "🔵";
          let clutchemote = partindb[clutch.toLowerCase()].Emote || "🔵";
          let ecuemote = partindb[ecu.toLowerCase()].Emote || "🔵";
          let engineemote = partindb[engine.toLowerCase()].Emote || "🔵";
          let turboemote = partindb[turbo.toLowerCase()].Emote || "🔵";

          let embed = new Discord.EmbedBuilder()
            .setTitle(
              `Parts for ${interaction.user.username}'s ${carindb.Emote} ${carindb.Name}`
            )
            .addFields([
              {
                name: `Exhaust`,
                value: `${exhaustemote} ${exhaust}`,
                inline: true,
              },
              {
                name: `Intake`,
                value: `${intakeemote} ${intake}`,
                inline: true,
              },
              { name: `Tires`, value: `${tiresemote} ${tires}`, inline: true },
              { name: `Turbo`, value: `${turboemote} ${turbo}`, inline: true },
              {
                name: `Suspension`,
                value: `${suspensionemote} ${suspension}`,
                inline: true,
              },
              {
                name: `Clutch`,
                value: `${clutchemote} ${clutch}`,
                inline: true,
              },
              { name: `ECU`, value: `${ecuemote} ${ecu}`, inline: true },
              {
                name: `Engine`,
                value: `${engineemote} ${engine}`,
                inline: true,
              },
              { name: `\u200b`, value: `\u200b`, inline: true },
            ])

            .setColor(colors.blue)
            .setImage(carimage);
          i.update({ embeds: [embed] });
        } else if (i.customId.includes("stats")) {
          let embed = new Discord.EmbedBuilder()
            .setTitle(
              `Stats for ${interaction.user.username}'s ${carindb.Emote} ${carindb.Name}`
            )
            .addFields([
              {
                name: `Speed`,
                value: `${speedemote} ${carindb.Speed}`,
                inline: true,
              },
              {
                name: `Acceleration`,
                value: `${accelerationemote} ${carindb.Acceleration}`,
                inline: true,
              },
              {
                name: `Handling`,
                value: `${handlingemote} ${carindb.Handling}`,
                inline: true,
              },
              {
                name: `Drift`,
                value: `${handlingemote} ${cardrift}`,
                inline: true,
              },
              {
                name: `Sell Price`,
                value: `${toCurrency(sellprice)}`,
                inline: true,
              },
              { name: `\u200b`, value: `\u200b`, inline: true },
              { name: `\u200b`, value: `\u200b`, inline: true },
            ])

            .setColor(colors.blue)

            .setImage(carimage);
          i.update({ embeds: [embed] });
        }
      });
    } else if (
      subcommandfetch == "car_part" &&
      partdb.Parts[item.toLowerCase()]
    ) {
      let part = interaction.options.getString("item");
      part = part.toLowerCase();

      let partindb = partdb.Parts[part];

      if (!partindb) return interaction.reply(`Thats not a part!`);
      let stats = [];

      if (partindb.AddedSpeed) {
        stats.push(`Speed: +${partindb.AddedSpeed}`);
      }
      if (partindb.AddedDrift) {
        stats.push(`Drift: +${partindb.AddedDrift}`);
      }

      if (partindb.DecreasedDrift) {
        stats.push(`Drift: -${partindb.DecreasedDrift}`);
      }
      if (partindb.AddHandling) {
        stats.push(
          `<:handling:983963211403505724> Handling: +${partindb.AddHandling}`
        );
      }
      if (partindb.DecreaseHandling) {
        stats.push(
          `<:handling:983963211403505724> Handling: -${partindb.DecreaseHandling}`
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${partindb.Emote} ${partindb.Name}`)
        .setDescription(`${stats.join("\n")}`)
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};
