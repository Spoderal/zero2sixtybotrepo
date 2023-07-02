const parts = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  SelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
} = require("discord.js");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { emotes } = require("../common/emotes");
const { tipFooterPurchasePart } = require("../common/tips");
const User = require("../schema/profile-schema");
const lodash = require("lodash");

module.exports = {
  data: new SlashCommandBuilder().setName("parts").setDescription("Buy parts"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Exhausts")
        .setCustomId("exhaust")
        .setEmoji("<:part_t1exhaust:1101027462932086855>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Tires")
        .setCustomId("tires")
        .setEmoji("<:part_t1tires:1101042346231070773>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Intakes")
        .setCustomId("intakes")
        .setEmoji("<:part_t1intake:1101659642095992882>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Brakes")
        .setCustomId("brakes")
        .setEmoji("<:part_t1brakes:1101659686698221659>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Clutches")
        .setCustomId("clutches")
        .setEmoji("<:part_t1clutch:1101665127645839420>")
        .setStyle("Secondary")
    );
    const prow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Suspension")
        .setCustomId("suspension")
        .setEmoji("<:part_t1suspension:1101666668247253085>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Turbos")
        .setCustomId("turbos")
        .setEmoji("<:t1turbo:989758553340383272>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Gearboxes")
        .setCustomId("gearboxes")
        .setEmoji("<:part_t1gearbox:1101757211123908618>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("ECU")
        .setCustomId("ecu")
        .setEmoji("<:part_t1ecu:1102062324371693599>")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Engines")
        .setCustomId("engines")
        .setEmoji("<:v12:1069491173850353684>")
        .setStyle("Secondary"),
        
    );

    let prow3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel("Intercoolers")
      .setCustomId("intercooler")
      .setEmoji("<:part_t1intercooler:1123148189999038514>")
      .setStyle("Secondary")

    )

    let userdata = await User.findOne({ id: interaction.user.id });
    let part;
    let embed = new EmbedBuilder()
      .setTitle("Car Parts")
      .setThumbnail("https://i.ibb.co/89GbzcB/Logo-Makr-8u-BQuo.png")
      .addFields([
        {
          name: "Available Parts",
          value: `
          *Choose a part from the buttons below*\n
        `,
          inline: true,
        },
      ])
      .setColor(colors.blue)
      .setDescription(
        `\`/buy (part)\` to buy a part or use the buy button\n\n[Official Server](https://discord.gg/bHwqpxJnJk)`
      );

    let msg = await interaction.reply({
      content: "Please wait...",
      fetchReply: true,
    });
    let num = 0;

    let exhaustarr = [];
    let tiresarr = [];
    let intakearr = [];
    let brakearr = [];
    let clutcharr = [];
    let suspenarr = [];
    let turboarr = [];
    let ecuarr = [];
    let enginearr = [];
    let gearboxarr = [];

    let intercoolerarr = [];

    let partsarr = [];
    for (let p in parts.Parts) {
      part = parts.Parts[p];
      partsarr.push(parts.Parts[p]);

      if (
        part.Name &&
        !part.Name.startsWith("J") &&
        !part.Name.startsWith("BM") &&
        part.Price > 0
      ) {
        if (part.Type == "exhaust") {
          exhaustarr.push(part);
        } else if (part.Type == "tires") {
          tiresarr.push(part);
        } else if (part.Type == "intake") {
          intakearr.push(part);
        } else if (part.Type == "brakes") {
          brakearr.push(part);
        } else if (part.Type == "clutch") {
          clutcharr.push(part);
        } else if (part.Type == "suspension") {
          suspenarr.push(part);
        } else if (part.Type == "turbo") {
          turboarr.push(part);
        } else if (part.Type == "ecu") {
          ecuarr.push(part);
        } else if (part.Type == "engine") {
          enginearr.push(part);
        } else if (part.Type == "gearbox") {
          gearboxarr.push(part);
        }
        else if (part.Type == "intercooler") {
          intercoolerarr.push(part);
        }
      }
    }

    exhaustarr = exhaustarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    tiresarr = tiresarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    intakearr = intakearr.sort((a, b) => {
      return a.Price - b.Price;
    });

    brakearr = brakearr.sort((a, b) => {
      return a.Price - b.Price;
    });

    clutcharr = clutcharr.sort((a, b) => {
      return a.Price - b.Price;
    });

    suspenarr = suspenarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    turboarr = turboarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    ecuarr = ecuarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    enginearr = enginearr.sort((a, b) => {
      return a.Price - b.Price;
    });

    gearboxarr = gearboxarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    intercoolerarr = intercoolerarr.sort((a, b) => {
      return a.Price - b.Price;
    });

    exhaustarr = lodash.chunk(
      exhaustarr.map((a) => a),
      1
    );

    tiresarr = lodash.chunk(
      tiresarr.map((a) => a),
      1
    );

    intakearr = lodash.chunk(
      intakearr.map((a) => a),
      1
    );
    brakearr = lodash.chunk(
      brakearr.map((a) => a),
      1
    );
    clutcharr = lodash.chunk(
      clutcharr.map((a) => a),
      1
    );
    suspenarr = lodash.chunk(
      suspenarr.map((a) => a),
      1
    );
    turboarr = lodash.chunk(
      turboarr.map((a) => a),
      1
    );
    enginearr = lodash.chunk(
      enginearr.map((a) => a),
      1
    );
    gearboxarr = lodash.chunk(
      gearboxarr.map((a) => a),
      1
    );

    ecuarr = lodash.chunk(
      ecuarr.map((a) => a),
      1
    );

    intercoolerarr = lodash.chunk(
      intercoolerarr.map((a) => a),
      1
    );

    let row9 = new ActionRowBuilder().addComponents(
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
    let rowbuy = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buy")
        .setEmoji("💲")
        .setLabel("Buy")
        .setStyle("Secondary")
    );

    await interaction.editReply({
      embeds: [embed],
      components: [row, prow2, prow3],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id;
    };
    const collector = msg.createMessageComponentCollector({
      filter: filter,
    });
    let page = 1;
    let classpage = exhaustarr;
    collector.on("collect", async (i) => {
      if (i.customId.includes("exhaust")) {
        part = exhaustarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = exhaustarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("tires")) {
        part = tiresarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = tiresarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } 
      else if (i.customId.includes("intercooler")) {
        part = intercoolerarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = intercoolerarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } 
      else if (i.customId.includes("intakes")) {
        part = intakearr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = intakearr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("brakes")) {
        part = brakearr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = brakearr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("clutches")) {
        part = clutcharr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = clutcharr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("suspension")) {
        part = suspenarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = suspenarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("turbos")) {
        part = turboarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = turboarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("gearboxes")) {
        part = gearboxarr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = gearboxarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, row9, prow3, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("ecu")) {
        part = ecuarr[0][0];
        let statsdisp = [];

        console.log(part);

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = ecuarr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("engines")) {
        part = enginearr[0][0];
        let statsdisp = [];

        if (part.AddedSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
        }
        if (part.DecreaseSpeed > 0) {
          statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
        }
        if (part.AddedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
          );
        }
        if (part.DecreasedSixty > 0) {
          statsdisp.push(
            `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
          );
        }
        if (part.AddHandling > 0) {
          statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
        }
        if (part.DecreasedHandling > 0) {
          statsdisp.push(
            `${emotes.handling} Handling: -${part.DecreasedHandling}`
          );
        }
        if (part.AddWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
        }
        if (part.DecreaseWeight > 0) {
          statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
        }

        if (part.Obtained) {
          statsdisp.push(`Obtained: ${part.Obtained}`);
        }

        if (part.Price > 0) {
          statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
        }

        classpage = enginearr;
        let embed2 = new EmbedBuilder()
          .setTitle(`${part.Emote} ${part.Name}`)
          .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
          .setColor(colors.blue);

        if (part.Image) {
          embed2.setThumbnail(part.Image);
        }

        i.update({
          embeds: [embed2],
          fetchReply: true,
          components: [row, prow2, prow3, row9, rowbuy],
        });

        page = 1;
      } else if (i.customId.includes("buy")) {
        if (userdata.cash < part.Price || part.Price <= 0)
          return i.update({
            content: "You can't afford this part!",
            embeds: [],
            components: [],
          });

        userdata.parts.push(part.Name.toLowerCase());
        userdata.cash -= Number(part.Price);
        userdata.save();

        i.update(`✅ Bought ${part.Name}`);
      } else {
        console.log(page);
        let current = page;
        if (i.customId.includes("previous") && page !== 1) {
          embed.data.description = null;

          page--;
        } else if (i.customId.includes("next") && page !== classpage.length) {
          embed.data.description = null;

          page++;
        } else if (i.customId.includes("first")) {
          embed.data.description = null;

          page = 1;
        } else if (i.customId.includes("last")) {
          embed.data.description = null;

          page = classpage.length;
        }
        let embed4 = new EmbedBuilder();
        for (let e in classpage[page - 1]) {
          part = classpage[page - 1][e];
          let statsdisp = [];

          if (part.AddedSpeed > 0) {
            statsdisp.push(`${emotes.speed} Power: +${part.AddedSpeed}`);
          }
          if (part.DecreaseSpeed > 0) {
            statsdisp.push(`${emotes.speed} Power: -${part.AddedSpeed}`);
          }
          if (part.AddedSixty > 0) {
            statsdisp.push(
              `${emotes.zero2sixty} Acceleration: -${part.AddedSixty}`
            );
          }
          if (part.DecreasedSixty > 0) {
            statsdisp.push(
              `${emotes.zero2sixty} Acceleration: +${part.DecreasedSixty}`
            );
          }
          if (part.AddHandling > 0) {
            statsdisp.push(`${emotes.handling} Handling: +${part.AddHandling}`);
          }
          if (part.DecreasedHandling > 0) {
            statsdisp.push(
              `${emotes.handling} Handling: -${part.DecreasedHandling}`
            );
          }
          if (part.AddWeight > 0) {
            statsdisp.push(`${emotes.weight} Weight: +${part.AddWeight}`);
          }
          if (part.DecreaseWeight > 0) {
            statsdisp.push(`${emotes.weight} Weight: -${part.DecreaseWeight}`);
          }

          if (part.Obtained) {
            statsdisp.push(`Obtained: ${part.Obtained}`);
          }

          if (part.Price > 0) {
            statsdisp.push(`\nPrice: ${toCurrency(part.Price)}`);
          }
          embed4
            .setTitle(`${part.Emote} ${part.Name}`)
            .setDescription(`**Stats**\n${statsdisp.join("\n")}`)
            .setColor(colors.blue);

          if (part.Image) {
            embed4.setThumbnail(part.Image);
          }
        }

        if (current !== page) {
          i.update({ embeds: [embed4], fetchReply: true });
        } else {
          return i.update({ content: "No pages left!" });
        }
      }
    });
  },
};
