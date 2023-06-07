const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const { numberWithCommas, toCurrency } = require("../common/utils");
const cardb = require("../data/cardb.json").Cars;
const lodash = require("lodash");
const branddb = require("../data/brands.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("carlist")
    .setDescription("Check the list of cars on the bot")
    .addSubcommand((cmd) =>
      cmd
        .setName("brand")
        .setDescription("Filter the cars by a brand")
        .addStringOption((option) =>
          option
            .setName("brand")
            .setDescription("The brand to search")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) => cmd.setName("all").setDescription("See all cars")),
  async execute(interaction) {
    let carslist = [];

    let brands = [];
    let subcommand = interaction.options.getSubcommand();

    await interaction.reply("Please wait...");
    for (let brand in branddb) {
      let br = branddb[brand];

      brands.push(br);
    }
    let embed = new EmbedBuilder().setTitle("List of cars in the game");
    if (subcommand == "all") {
      embed.setTitle("List of cars in the game");
      for (let car in cardb) {
        let brand = brands.filter((brand) => brand.emote == cardb[car].Emote);
        let price = cardb[car].Price;
        if (price == 0 || !price) {
          price = `**Found: ${cardb[car].Obtained}**` || "**Not Obtainable**";
        } else {
          price = `**${toCurrency(price)}**`;
        }
        if (price == `**Found: undefined**`) {
          price = "**Not Obtainable**";
        }
        carslist.push({
          Name: cardb[car].Name,
          Emote: cardb[car].Emote,
          Brand: brand[0],
          Price: price,
        });
      }
    } else if (subcommand == "brand") {
      let brandtofilter = interaction.options.getString("brand");

      if (!branddb[brandtofilter.toLowerCase()])
        return interaction.reply("Thats not a brand!");

      embed.setTitle(
        `List of ${branddb[brandtofilter.toLowerCase()].name} cars in the game`
      );
      for (let car in cardb) {
        let brand = brands.filter((brand) => brand.emote == cardb[car].Emote);
        let price = cardb[car].Price;

        if (price == 0) {
          price = `**Found: ${cardb[car].Obtained}**` || "**Not Obtainable**";
        } else {
          price = `**${toCurrency(price)}**`;
        }
        if (price == `**Found: undefined**`) {
          price = "**Not Obtainable**";
        }
        console.log(brand);
        if (
          brand[0] &&
          brand[0].name.toLowerCase() == brandtofilter.toLowerCase()
        ) {
          carslist.push({
            Name: cardb[car].Name,
            Emote: cardb[car].Emote,
            Brand: brand[0],
            Price: price,
          });
        }
      }
    }

    carslist = carslist.sort(function (a, b) {
      try {
        return a.Brand.name.localeCompare(b.Brand.name);
      } catch (err) {
        console.log("no brand");
      }
    });

    console.log(carslist[0]);

    let displaycars = [];

    for (let dis in carslist) {
      let car2 = carslist[dis];
      let price = car2.Price;

      displaycars.push(`${car2.Emote} ${car2.Name} : ${price}`);
    }

    displaycars = lodash.chunk(
      displaycars.map((a) => a),
      10
    );

    let page = 1;

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("first")
        .setEmoji("⏮️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("last")
        .setEmoji("⏭️")
        .setStyle("Secondary")
    );

    embed
      .setDescription(`${displaycars[0].join("\n")}`)
      .setColor(colors.blue)
      .setFooter({ text: `Pages ${page}/${displaycars.length}` });

    let msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector2.on("collect", async (i) => {
      let current = page;
      if (i.customId.includes("previous") && page !== 1) {
        embed.data.fields = null;

        page--;
      } else if (i.customId.includes("next") && page !== displaycars.length) {
        embed.data.fields = null;

        page++;
      } else if (i.customId.includes("first")) {
        embed.data.fields = null;

        page = 1;
      } else if (i.customId.includes("last")) {
        embed.data.fields = null;

        page = displaycars.length;
      }

      if (current !== page) {
        embed.setFooter({ text: `Pages ${page}/${displaycars.length}` });

        embed.setDescription(`${displaycars[page - 1].join("\n")}`);

        await i.update({
          embeds: [embed],
          fetchReply: true,
        });
      } else {
        return i.update({ content: "No pages left!" });
      }
    });
  },
};
