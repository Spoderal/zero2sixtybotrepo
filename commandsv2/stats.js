const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");
const partdb = require("../data/partsdb.json");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency, blankInlineField, convertMPHtoKPH } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const itemdb = require("../data/items.json");

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
    let userdata = await User.findOne({ id: interaction.user.id });
    let settings = userdata.settings

    if (subcommandfetch == "car_part" && item && list[item.toLowerCase()]) {
      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;
      let car = item.toLowerCase();
      let carindb = list[car];

      let speed = `${carindb.Speed} MPH`

      if(settings.ph == "KMH"){
        speed = `${Math.floor(convertMPHtoKPH(carindb.Speed))} KMH`
      }

      if (!carindb) return await interaction.reply(`Thats not a car!`);

      let trims = carindb.Trims || ["❌ No Trims"];
      let sellprice = carindb.Price * 0.65;

      let embed = new Discord.EmbedBuilder()
        .setTitle(`Stats for ${carindb.Emote} ${carindb.Name}`)
        .addFields([
          {
            name: `Speed`,
            value: `${speedemote} ${speed}`,
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

      await interaction.reply({ embeds: [embed] });
    } else if (subcommandfetch == "carid") {
      let idtoselect = interaction.options.getString("id");
     
      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

      let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
      let selected = filteredcar[0] || "No ID";

      if (selected == "No ID") {
        let errembed = new Discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red).setDescription(`
            That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n
            **Example: /ids Select 1 1995 mazda miata**
          `);

        return await interaction.reply({ embeds: [errembed] });
      }

      let handlingemote = emotes.handling;
      let speedemote = emotes.speed;
      let accelerationemote = emotes.zero2sixty;
      let carindb = selected;
      let sellprice = selected.Resale || 0;
      let cardrift = selected.Drift || 0;
      let carimage = carindb.Livery || list[selected.Name.toLowerCase()].Image;
      let speed = `${carindb.Speed} MPH`

      if(settings.ph == "KMH"){
        speed = `${Math.floor(convertMPHtoKPH(carindb.Speed))} KMH`
      }
      let embed = new Discord.EmbedBuilder()
        .setTitle(
          `Stats for ${interaction.user.username}'s ${carindb.Emote} ${carindb.Name}`
        )
        .addFields([
          {
            name: `Speed`,
            value: `${speedemote} ${speed}`,
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
          blankInlineField,
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
          let exhaust = selected.Exhaust || "Stock Exhaust";
          let intake = selected.Intake || "Stock Intake";
          let suspension = selected.Suspension || "Stock Suspension";
          let tires = selected.Tires || "Stock Tires";
          let engine = selected.Engine || "Stock Engine";
          let clutch = selected.Clutch || "Stock Clutch";
          let ecu = selected.ECU || "Stock ECU";
          let turbo = selected.Turbo || "Stock Turbo";
          let nitro = selected.Nitro || "Stock Nitro";
          let intercooler = selected.Intercooler || "Stock Intercooler";
          let gearbox = selected.Gearbox || "Stock Gearbox";
          let brakes = selected.Brakes || "Stock Brakes";

          let partindb = partdb.Parts;

          let exhaustemote = partindb[exhaust.toLowerCase()]?.Emote || "🔵";
          let intakeemote = partindb[intake.toLowerCase()]?.Emote || "🔵";
          let suspensionemote =
            partindb[suspension.toLowerCase()]?.Emote || "🔵";
          let tiresemote = partindb[tires.toLowerCase()]?.Emote || "🔵";
          let clutchemote = partindb[clutch.toLowerCase()]?.Emote || "🔵";
          let ecuemote = partindb[ecu.toLowerCase()]?.Emote || "🔵";
          let engineemote = partindb[engine.toLowerCase()]?.Emote || "🔵";
          let turboemote = partindb[turbo.toLowerCase()]?.Emote || "🔵";
          let nitroemote = partindb[nitro.toLowerCase()]?.Emote || "🔵";
          let intercooleremote =
            partindb[intercooler.toLowerCase()]?.Emote || "🔵";
          let gearboxemote = partindb[gearbox.toLowerCase()]?.Emote || "🔵";
          let brakesemote = partindb[brakes.toLowerCase()]?.Emote || "🔵";

          let embed = new Discord.EmbedBuilder()
            .setTitle(
              `Parts for ${interaction.user.username}'s ${carindb.Emote} ${carindb.Name}`
            )
            .addFields([
              {
                name: `Exhaust`,
                value: `${exhaustemote} ${exhaust.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Intake`,
                value: `${intakeemote} ${intake.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Tires`,
                value: `${tiresemote} ${tires.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Turbo`,
                value: `${turboemote} ${turbo.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Suspension`,
                value: `${suspensionemote} ${suspension.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Clutch`,
                value: `${clutchemote} ${clutch.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `ECU`,
                value: `${ecuemote} ${ecu.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Engine`,
                value: `${engineemote} ${engine.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Nitro`,
                value: `${nitroemote} ${nitro.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Intercooler`,
                value: `${intercooleremote} ${intercooler.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Gearbox`,
                value: `${gearboxemote} ${gearbox.split(" ")[0]}`,
                inline: true,
              },
              {
                name: `Brakes`,
                value: `${brakesemote} ${brakes.split(" ")[0]}`,
                inline: true,
              },
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
              blankInlineField,
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

      if (!partindb) return await interaction.reply(`Thats not a part!`);
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

      await interaction.reply({ embeds: [embed] });
    } else if (
      subcommandfetch == "car_part" &&
      itemdb.Other[item.toLowerCase()]
    ) {
      let itemindb = itemdb.Other[item.toLowerCase()];
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Information for ${itemindb.Emote} ${itemindb.Name}`)
        .setDescription(itemindb.Action)
        .addFields({
          name: "Type",
          value: `${itemindb.Type}`,
        })
        .setColor(colors.blue);

      interaction.reply({ embeds: [embed] });
    }
  },
};
