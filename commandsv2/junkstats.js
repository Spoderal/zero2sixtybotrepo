const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const parts = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restore")
    .setDescription("View the status of the barn find you own and restore it")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car by id you want to view")
        .setRequired(true)
    ),
  async execute(interaction) {
    const db = require("quick.db");
    var idtoselect = interaction.options.getString("car");
    let car = db.fetch(`selected_${idtoselect}_${interaction.user.id}`);
    if (!car)
      return interaction.reply(
        "That id doesn't have a car! Use /ids select [id] [car] to select it!"
      );
    let uid = interaction.user.id;
    if (!car) return interaction.reply("Specify a car!");
    var usercars = db.fetch(`cars_${uid}`);
    if (!cars.Cars[car.toLowerCase()])
      return interaction.reply("Thats not a car!");
    car = car.toLowerCase();
    if (!usercars.includes(`${car.toLowerCase()}`))
      return interaction.reply("You dont have that car!");
    let exhaust =
      db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
    let tires = db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
    let intake = db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
    let clutch = db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
    let suspension =
      db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
      "Broken Suspension";
    let gearbox =
      db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";

    let body = db.fetch(`${cars.Cars[car].Name}body_${uid}`) || "Rusted";
    let carimage =
      db.fetch(`${cars.Cars[car].Name}livery_${uid}`) || cars.Cars[car].Image;
    let engine = db.fetch(`${cars.Cars[car].Name}engine_${uid}`) || "No Engine";
    if (!parts.Parts[engine.toLowerCase()]) {
      engine = "No Engine";
    }
    let licensePlate =
      db.fetch(`${cars.Cars[car].Name}license_plate_${uid}`) || "000000";
    let caremote = cars.Cars[car].Emote || emotes.none;

    console.log(engine);
    let engineemote = parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
    let gearboxemote =
      parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

    let exhaustemote =
      parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
    let intakeemote = parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
    let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
    let suspensionemote =
      parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;
    let clutchemote = parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;
    let spoileremote = emotes.spoiler;
    let items = db.fetch(`items_${interaction.user.id}`) || [];
    if (body == "Body") {
      body = "Restored";
      let restoredcar = cars.Cars[car].restored;
      carimage = cars.Cars[restoredcar.toLowerCase()].Image;
      spoileremote = emotes.spoilerRestored;
    }

    if (!cars.Cars[car].Junked)
      return interaction.reply("Thats not a junk car!");

    let row = new ActionRowBuilder();
    let row2 = new ActionRowBuilder();
    if (engine == "No Engine") {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Engine")
          .setCustomId("engine")
          .setStyle("Danger")
      );
    }
    if (exhaust == "Cracked Exhaust") {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Exhaust")
          .setCustomId("exhaust")
          .setStyle("Danger")
      );
    }
    if (intake == "No Intake") {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Intake")
          .setCustomId("intake")
          .setStyle("Danger")
      );
    }
    if (tires == "Flat Tires") {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Tires")
          .setCustomId("tires")
          .setStyle("Danger")
      );
    }
    if (suspension == "Broken Suspension") {
      row2.addComponents(
        new ButtonBuilder()
          .setLabel("Suspension")
          .setCustomId("suspension")
          .setStyle("Danger")
      );
    }
    if (clutch == "No Clutch") {
      row2.addComponents(
        new ButtonBuilder()
          .setLabel("Clutch")
          .setCustomId("clutch")
          .setStyle("Danger")
      );
    }
    if (body == "Rusted") {
      row2.addComponents(
        new ButtonBuilder()
          .setLabel("Body")
          .setCustomId("body")
          .setStyle("Danger")
      );
    }
    if (gearbox == "No Gearbox") {
      row2.addComponents(
        new ButtonBuilder()
          .setLabel("Gearbox")
          .setCustomId("gearbox")
          .setStyle("Danger")
      );
    }

    let color = "Danger";
    if (
      engine !== "No Engine" &&
      exhaust !== "Cracked Exhaust" &&
      intake !== "No Intake" &&
      tires !== "Flat Tires" &&
      gearbox !== "No Gearbox" &&
      suspension !== "Broken Suspension" &&
      body !== "Rusted" &&
      clutch !== "No Clutch"
    ) {
      color = "Success";
    }
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Restore")
        .setCustomId("restore")
        .setStyle(`${color}`)
    );

    let embed = new Discord.EmbedBuilder()
      .setFooter({ text: `License Plate: ${licensePlate}` })
      .setTitle(`${caremote} ${cars.Cars[car.toLowerCase()].Name}`)
      .addFields([
        { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
        { name: `${exhaustemote} Exhaust`, value: `${exhaust}`, inline: true },
        { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
        { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
        {
          name: `${suspensionemote} Suspension`,
          value: `${suspension}`,
          inline: true,
        },
        { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
        { name: `${spoileremote} Body`, value: `${body}`, inline: true },
        { name: `${gearboxemote} Gearbox`, value: `${gearbox}`, inline: true },
        { name: `\u200b`, value: `\u200b`, inline: true },
      ])
      .setColor(colors.blue)
      .setImage(`${carimage}`);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    if (row2.components[0]) {
      interaction.editReply({ components: [row, row2] });
    }

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on("collect", async (i) => {
      let restorepart;
      let userparts = db.fetch(`parts_${interaction.user.id}`) || [];
      if (i.customId.includes("exhaust")) {
        restorepart = "j1exhaust";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}exhaust_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let engine =
          db.fetch(`${cars.Cars[car].Name}engine_${uid}`) || "No Engine";
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let nexhaust = db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`);
        let nexhaustemote =
          parts.Parts[nexhaust.toLowerCase()].Emote || emotes.exhaust;
        let row = new ActionRowBuilder();

        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }
        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;
        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;
        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${nexhaustemote} Exhaust`,
            value: `${nexhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("engine")) {
        restorepart = "v6";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}engine_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let engine =
          db.fetch(`${cars.Cars[car].Name}engine_${uid}`) || "No Engine";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;
        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;
        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("clutch")) {
        restorepart = "j1clutch";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}clutch_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("suspension")) {
        restorepart = "j1suspension";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}suspension_${
            interaction.user.id
          }`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;
        let body = db.fetch(`${cars.Cars[car].Name}body_${uid}`);
        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("intake")) {
        restorepart = "j1intake";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}intake_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;
        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let body = db.fetch(`${cars.Cars[car].Name}body_${uid}`) || "Rusted";
        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }
        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("tires")) {
        restorepart = "j1tires";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}tires_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("gearbox")) {
        restorepart = "j1gearbox";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}gearbox_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;

        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("body")) {
        restorepart = "body";

        if (!items.includes("wrench")) {
          if (!userparts.includes(restorepart.toLowerCase()))
            return i.update({ content: "You don't own that part!" });
        }

        db.set(
          `${cars.Cars[car.toLowerCase()].Name}body_${interaction.user.id}`,
          `${parts.Parts[restorepart.toLowerCase()].Name}`
        );
        let exhaust =
          db.fetch(`${cars.Cars[car].Name}exhaust_${uid}`) || "Cracked Exhaust";
        let tires =
          db.fetch(`${cars.Cars[car].Name}tires_${uid}`) || "Flat Tires";
        let intake =
          db.fetch(`${cars.Cars[car].Name}intake_${uid}`) || "No Intake";
        let clutch =
          db.fetch(`${cars.Cars[car].Name}clutch_${uid}`) || "No Clutch";
        let suspension =
          db.fetch(`${cars.Cars[car].Name}suspension_${uid}`) ||
          "Broken Suspension";
        let gearbox =
          db.fetch(`${cars.Cars[car].Name}gearbox_${uid}`) || "No Gearbox";
        let engineemote =
          parts.Parts[engine.toLowerCase()].Emote || emotes.engine;
        let gearboxemote =
          parts.Parts[gearbox.toLowerCase()].Emote || emotes.engine;
        let body = db.fetch(`${cars.Cars[car].Name}body_${uid}`);

        let exhaustemote =
          parts.Parts[exhaust.toLowerCase()].Emote || emotes.exhaust;
        let intakeemote =
          parts.Parts[intake.toLowerCase()].Emote || emotes.intake;
        let tiresemote = parts.Parts[tires.toLowerCase()].Emote || emotes.tires;
        let suspensionemote =
          parts.Parts[suspension.toLowerCase()].Emote || emotes.suspension;

        let clutchemote =
          parts.Parts[clutch.toLowerCase()].Emote || emotes.clutch;

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        if (engine == "No Engine") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Engine")
              .setCustomId("engine")
              .setStyle("Danger")
          );
        }
        if (exhaust == "Cracked Exhaust") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Exhaust")
              .setCustomId("exhaust")
              .setStyle("Danger")
          );
        }
        if (intake == "No Intake") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Intake")
              .setCustomId("intake")
              .setStyle("Danger")
          );
        }
        if (tires == "Flat Tires") {
          row.addComponents(
            new ButtonBuilder()
              .setLabel("Tires")
              .setCustomId("tires")
              .setStyle("Danger")
          );
        }
        if (suspension == "Broken Suspension") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Suspension")
              .setCustomId("suspension")
              .setStyle("Danger")
          );
        }
        if (clutch == "No Clutch") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Clutch")
              .setCustomId("clutch")
              .setStyle("Danger")
          );
        }
        if (body == "Rusted") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Body")
              .setCustomId("body")
              .setStyle("Danger")
          );
        }
        if (gearbox == "No Gearbox") {
          row2.addComponents(
            new ButtonBuilder()
              .setLabel("Gearbox")
              .setCustomId("gearbox")
              .setStyle("Danger")
          );
        }

        let color = "Danger";
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          color = "SUCCESS";
        }
        row.addComponents(
          new ButtonBuilder()
            .setLabel("Restore")
            .setCustomId("restore")
            .setStyle(`${color}`)
        );
        embed.fields = [];

        embed.addFields([
          { name: `${engineemote} Engine`, value: `${engine}`, inline: true },
          {
            name: `${exhaustemote} Exhaust`,
            value: `${exhaust}`,
            inline: true,
          },
          { name: `${tiresemote} Tires`, value: `${tires}`, inline: true },
          { name: `${intakeemote} Intake`, value: `${intake}`, inline: true },
          {
            name: `${suspensionemote} Suspension`,
            value: `${suspension}`,
            inline: true,
          },
          { name: `${clutchemote} Clutch`, value: `${clutch}`, inline: true },
          { name: `${spoileremote} Body`, value: `${body}`, inline: true },
          {
            name: `${gearboxemote} Gearbox`,
            value: `${gearbox}`,
            inline: true,
          },
          { name: `\u200b`, value: `\u200b`, inline: true },
        ]);
        embed.setImage(carimage);

        let comp = [];
        if (row.components[0]) {
          comp.push(row);
        }
        if (row2.components[0]) {
          comp.push(row2);
        }
        i.update({ embeds: [embed], components: comp });
      } else if (i.customId.includes("restore")) {
        if (
          engine !== "No Engine" &&
          exhaust !== "Cracked Exhaust" &&
          intake !== "No Intake" &&
          tires !== "Flat Tires" &&
          gearbox !== "No Gearbox" &&
          suspension !== "Broken Suspension" &&
          body !== "Rusted" &&
          clutch !== "No Clutch"
        ) {
          db.add(`carsrrestored_${uid}`, 1);
          let achievements = db.fetch(`achievements_${uid}`) || ["None"];
          if (
            db.fetch(`carsrrestored_${uid}`) >= 5 &&
            !achievements.includes("rusty racer")
          ) {
            interaction.channel.send(
              `You just completed the achievement "Rusty Racer" and earned a rust helmet!`
            );
            db.push(`pfps_${uid}`, "rust helmet");
            db.push(`achievements_${uid}`, "rusty racer");
          }

          let restoredcar = cars.Cars[car.toLowerCase()].restored;
          let fullrestored = cars.Cars[restoredcar.toLowerCase()];
          console.log(fullrestored.Name.toLowerCase());
          let embed = new Discord.EmbedBuilder()
            .setTitle(`Fully Restored!`)
            .addFields([
              { name: `Car`, value: `${fullrestored.Name}` },
              { name: `ID`, value: `${fullrestored.alias}` },
            ])
            .setImage(fullrestored.Image)
            .setColor(colors.blue);
          i.update({ embeds: [embed] });
          db.set(
            `${cars.Cars[fullrestored.Name.toLowerCase()].Name}speed_${uid}`,
            cars.Cars[fullrestored.Name.toLowerCase()].Speed
          );
          db.set(
            `${cars.Cars[fullrestored.Name.toLowerCase()].Name}060_${uid}`,
            cars.Cars[fullrestored.Name.toLowerCase()]["0-60"]
          );
          db.set(
            `${cars.Cars[fullrestored.Name.toLowerCase()].Name}resale_${uid}`,
            cars.Cars[fullrestored.Name.toLowerCase()].sellprice
          );

          db.push(`cars_${uid}`, `${fullrestored.Name.toLowerCase()}`);

          let newusercars = db.fetch(`cars_${uid}`);
          for (let i = 0; i < 1; i++)
            newusercars.splice(newusercars.indexOf(car.toLowerCase()), 1);
          db.set(`cars_${uid}`, newusercars);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}speed_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}060_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}engine_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}restoration_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}suspension_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}gearbox_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}tires_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}intake_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}exhaust_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}clutch_${uid}`);
          db.delete(`${cars.Cars[car.toLowerCase()].Name}body_${uid}`);
        } else {
          i.update({ content: "Missing parts!" });
        }
      }
      if (items.includes("wrench")) {
        for (let i = 0; i < 1; i++) items.splice(items.indexOf("wrench"), 1);
        db.set(`items_${uid}`, items);
      } else {
        for (let i = 0; i < 1; i++)
          userparts.splice(userparts.indexOf(restorepart.toLowerCase()), 1);
        db.set(`parts_${uid}`, userparts);
      }
    });
  },
};
