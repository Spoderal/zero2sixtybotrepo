

const lodash = require("lodash");
const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const { createCanvas, loadImage } = require("canvas");
const partdb = require("../data/partsdb.json");
const cardb = require("../data/cardb.json");
const ms = require("ms");
const Cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blueprint")
    .setDescription("Use a blueprint!")
    .addStringOption((option) =>
      option
        .setName("blueprint_type")
        .setDescription("The blueprint to use")
        .setRequired(true)
        .setChoices({ name: "Blueprint", value: "blueprint" },
        { name: "F1 Blueprint", value: "f1blueprint" }, )
    ),
  async execute(interaction) {
    try {

    
    let blueprints = require("../data/imports.json").blueprints;
    let type = interaction.options.getString("blueprint_type");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });
    let cooldown = 30000;
    let cratecool = cooldowndata.blueprint;
    if (cratecool !== null && cooldown - (Date.now() - cratecool) > 0) {
      let time = ms(cooldown - (Date.now() - cratecool));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(
          `Please wait ${time} before revealing another blueprint.`
        );
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      return;
    }
    //fix
    if (type == "blueprint") {
      let boughtindb = blueprints;

      if (userdata.blueprints <= 0)
        return interaction.reply(`You don't have any blueprints!`);
      userdata.blueprints -= 1;
      userdata.update();

      userdata.save();
      let embed = new EmbedBuilder()
        .setTitle(`Revealing blueprint...`)
        .setColor(`#60b0f4`);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });

      cooldowndata.blueprint = Date.now();
      cooldowndata.save();
      const canvas = createCanvas(1280, 720);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage("https://i.ibb.co/6WwF0gJ/crateunbox.png");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      let x = 0;
      let itemcooldown = cooldowndata.applejuice;
      let timeout = 30000;
      let rewards = [];

      let i = setInterval(() => {
        x++;
        let contents = boughtindb.Contents;
        if (
          itemcooldown !== null &&
          timeout - (Date.now() - itemcooldown) < 0
        ) {
          userdata.using.pull("apple juice");
          userdata.update();
          contents = boughtindb.Contents;
        } else {
          contents = boughtindb.Cars;
        }
        let reward = lodash.sample(contents);
        rewards.push(reward);

        if (x == 3) {
          clearInterval(i);
        }
      }, 1000);

      let xt = setTimeout(async () => {
        let reward1 = rewards[0];
        let reward2 = rewards[1];
        let reward3 = rewards[2];

        let name1;
        let name2;
        let name3;
      

        ctx.restore();
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "#00000";
        let imageload = await loadImage("https://i.ibb.co/y8RDM5v/cash.png");

        if (reward1.endsWith(`Cash`)) {
          let amount = Number(reward1.split(" ")[0]);
          name1 = `${amount} Cash`;
          ctx.drawImage(imageload, 150, 200, 150, 150);
        }

        if (reward2.endsWith(`Cash`)) {
          let amount2 = Number(reward2.split(" ")[0]);
          name2 = `${amount2} Cash`;
          ctx.drawImage(imageload, 570, 200, 150, 150);
        }

        if (reward3.endsWith(`Cash`)) {
          let amount3 = Number(reward3.split(" ")[0]);
          name3 = `${amount3} Cash`;
          ctx.drawImage(imageload, 970, 200, 150, 150);
        }

        if (partdb.Parts[reward1]) {
          let partimg = partdb.Parts[reward1].Image;
          name1 = partdb.Parts[reward1].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 150, 200, 150, 150);
          ctx.save();
        }
        if (partdb.Parts[reward2]) {
          let partimg = partdb.Parts[reward2].Image;
          name2 = partdb.Parts[reward2].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 570, 200, 150, 150);
          ctx.save();
        }
        if (partdb.Parts[reward3]) {
          let partimg = partdb.Parts[reward3].Image;
          name3 = partdb.Parts[reward3].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 970, 200, 150, 150);
          ctx.save();
        }

   
        if (cardb.Cars[reward1]) {
          let carimg = cardb.Cars[reward1].Image;
          name1 = cardb.Cars[reward1].Name;
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 80, 200, 320, 180);
          ctx.save();
        }
        if (cardb.Cars[reward2]) {
          let carimg = cardb.Cars[reward2].Image;
          name2 = cardb.Cars[reward2].Name;
          let loadedpart = await loadImage(carimg);
          ctx.drawImage(loadedpart, 500, 200, 320, 180);
          ctx.save();
        }
        if (cardb.Cars[reward3]) {
          let carimg = cardb.Cars[reward3].Image;
          name3 = cardb.Cars[reward3].Name;
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 900, 200, 320, 180);
          ctx.save();
        }


        if (reward1 == "f1 blueprint") {
          let carimg = "https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name1 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 80, 200, 320, 180);
          ctx.save();
        }
        if (reward2 == "f1 blueprint") {
          let carimg ="https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name2 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);
          ctx.drawImage(loadedpart, 500, 200, 320, 180);
          ctx.save();
        }
        if (reward3 == "f1 blueprint") {
          let carimg ="https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name3 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 900, 200, 320, 180);
          ctx.save();
        }


        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("reward1")
            .setLabel("Reward 1")
            .setStyle("Primary"),
          new ButtonBuilder()
            .setCustomId("reward2")
            .setLabel("Reward 2")
            .setStyle("Primary"),
          new ButtonBuilder()
            .setCustomId("reward3")
            .setLabel("Reward 3")
            .setStyle("Primary")
        );

        ctx.fillText(name1, 100, 565);
        ctx.fillText(name2, 520, 565);
        ctx.fillText(name3, 920, 565);

        let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        embed.setImage(`attachment://profile-image.png`);
        embed.setTitle("Choose 1 reward from the choices below!");

        await interaction.editReply({
          embeds: [embed],
          files: [attachment],
          components: [row],
        });

        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
        let collector = msg.createMessageComponentCollector({
          filter: filter2,
          time: 25000,
        });

        collector.on("collect", async (i) => {
          if (i.customId.endsWith("reward1")) {
            if (cardb.Cars[reward1]) {
              let carindb = cardb.Cars[reward1.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                WeightStat: carindb.Weight,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward1.endsWith(`Cash`)) {
              let amount = Number(reward1.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward1 == "f1 blueprint") {
 

              userdata.f1blueprint += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward1.toLowerCase()]) {
              userdata.parts.push(reward1.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          } else if (i.customId.endsWith("reward2")) {
            if (cardb.Cars[reward2]) {
              let carindb = cardb.Cars[reward2.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                WeightStat: carindb.Weight,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward2.endsWith(`Cash`)) {
              let amount = Number(reward2.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward2 == "f1 blueprint") {
 

              userdata.f1blueprint += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward2.toLowerCase()]) {
              userdata.parts.push(reward2.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          } else if (i.customId.endsWith("reward3")) {
            if (cardb.Cars[reward3]) {
              let carindb = cardb.Cars[reward3.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                WeightStat: carindb.Weight,
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward3.endsWith(`Cash`)) {
              let amount = Number(reward3.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward3 == "f1 blueprint") {
 

              userdata.f1blueprint += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward3.toLowerCase()]) {
              userdata.parts.push(reward3.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          }
        });
        
        clearTimeout(xt)
      }, 5000);
    } else if (type == "f1blueprint") {
      blueprints = require("../data/imports.json").f1blueprints;

      let boughtindb = blueprints;

      if (userdata.f1blueprint < 2)
        return interaction.reply(
          `You don't have enough F1 Blueprints! You need 2`
        );
      userdata.f1blueprint -= 2;
      let embed = new EmbedBuilder()
        .setTitle(`Revealing blueprint...`)
        .setColor(`#60b0f4`);

      let msg = await interaction.reply({ embeds: [embed], fetchReply: true });

      userdata.update();
      cooldowndata.blueprint = Date.now();
      cooldowndata.save();
      const canvas = createCanvas(1280, 720);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage("https://i.ibb.co/NNXTP05/blueprintunbox.png");
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      let x = 0;
      let rewards = [];
      let i = setInterval(() => {
        x++;
        let reward = lodash.sample(boughtindb.Contents);
        rewards.push(reward);

        if (x == 3) {
          clearInterval(i);
        }
      }, 1000);

      let yt = setTimeout(async () => {
        let reward1 = rewards[0];
        let reward2 = rewards[1];
        let reward3 = rewards[2];

        let name1;
        let name2;
        let name3;
      

        ctx.restore();
        ctx.font = "40px sans-serif";
        ctx.fillStyle = "#00000";
        let imageload = await loadImage("https://i.ibb.co/y8RDM5v/cash.png");

        if (reward1.endsWith(`Cash`)) {
          let amount = Number(reward1.split(" ")[0]);
          name1 = `${amount} Cash`;
          ctx.drawImage(imageload, 150, 200, 150, 150);
        }

        if (reward2.endsWith(`Cash`)) {
          let amount2 = Number(reward2.split(" ")[0]);
          name2 = `${amount2} Cash`;
          ctx.drawImage(imageload, 570, 200, 150, 150);
        }

        if (reward3.endsWith(`Cash`)) {
          let amount3 = Number(reward3.split(" ")[0]);
          name3 = `${amount3} Cash`;
          ctx.drawImage(imageload, 970, 200, 150, 150);
        }

        if (partdb.Parts[reward1]) {
          let partimg = partdb.Parts[reward1].Image;
          name1 = partdb.Parts[reward1].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 150, 200, 150, 150);
          ctx.save();
        }
        if (partdb.Parts[reward2]) {
          let partimg = partdb.Parts[reward2].Image;
          name2 = partdb.Parts[reward2].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 570, 200, 150, 150);
          ctx.save();
        }
        if (partdb.Parts[reward3]) {
          let partimg = partdb.Parts[reward3].Image;
          name3 = partdb.Parts[reward3].Name;
          let loadedpart = await loadImage(partimg);

          ctx.drawImage(loadedpart, 970, 200, 150, 150);
          ctx.save();
        }

        
        if (cardb.Cars[reward1]) {
          let carimg = cardb.Cars[reward1].Image;
          name1 = cardb.Cars[reward1].Name;
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 80, 200, 320, 180);
          ctx.save();
        }
        if (cardb.Cars[reward2]) {
          let carimg = cardb.Cars[reward2].Image;
          name2 = cardb.Cars[reward2].Name;
          let loadedpart = await loadImage(carimg);
          ctx.drawImage(loadedpart, 500, 200, 320, 180);
          ctx.save();
        }
        if (cardb.Cars[reward3]) {
          let carimg = cardb.Cars[reward3].Image;
          name3 = cardb.Cars[reward3].Name;
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 900, 200, 320, 180);
          ctx.save();
        }
        if (reward1 == "f1 blueprint") {
          let carimg = "https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name1 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 80, 200, 320, 180);
          ctx.save();
        }
        if (reward2 == "f1 blueprint") {
          let carimg ="https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name2 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);
          ctx.drawImage(loadedpart, 500, 200, 320, 180);
          ctx.save();
        }
        if (reward3 == "f1 blueprint") {
          let carimg ="https://i.ibb.co/QvRFqvC/blueprintf1.png";
          name3 = "F1 Blueprint";
          let loadedpart = await loadImage(carimg);

          ctx.drawImage(loadedpart, 900, 200, 320, 180);
          ctx.save();
        }

        let row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("reward1")
            .setLabel("Reward 1")
            .setStyle("Primary"),
          new ButtonBuilder()
            .setCustomId("reward2")
            .setLabel("Reward 2")
            .setStyle("Primary"),
          new ButtonBuilder()
            .setCustomId("reward3")
            .setLabel("Reward 3")
            .setStyle("Primary")
        );

        ctx.fillText(name1, 100, 565);
        ctx.fillText(name2, 520, 565);
        ctx.fillText(name3, 920, 565);

        let attachment = new AttachmentBuilder(await canvas.toBuffer(), {
          name: "profile-image.png",
        });
        embed.setImage(`attachment://profile-image.png`);
        embed.setTitle("Choose 1 reward from the choices below!");

        await interaction.editReply({
          embeds: [embed],
          files: [attachment],
          components: [row],
        });

        let filter2 = (btnInt) => {
          return interaction.user.id === btnInt.user.id;
        };
        let collector = msg.createMessageComponentCollector({
          filter: filter2,
          time: 25000,
        });

        collector.on("collect", async (i) => {
          if (i.customId.endsWith("reward1")) {
            if (cardb.Cars[reward1]) {
              let carindb = cardb.Cars[reward1.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                WeightStat: carindb.Weight,
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward1.endsWith(`Cash`)) {
              let amount = Number(reward1.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward1 == "f1 blueprint") {

              userdata.f1blueprints += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward1.toLowerCase()]) {
              userdata.parts.push(reward1.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          } else if (i.customId.endsWith("reward2")) {
            if (cardb.Cars[reward2]) {
              let carindb = cardb.Cars[reward2.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward2.endsWith(`Cash`)) {
              let amount = Number(reward2.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward2 == "f1 blueprint") {

              userdata.f1blueprints += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward2.toLowerCase()]) {
              userdata.parts.push(reward2.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          } else if (i.customId.endsWith("reward3")) {
            if (cardb.Cars[reward3]) {
              let carindb = cardb.Cars[reward3.toLowerCase()];
              let carobj = {
                ID: carindb.alias,
                Name: carindb.Name,
                Speed: carindb.Speed,
                Acceleration: carindb["0-60"],
                Handling: carindb.Handling,
                Parts: [],
                Emote: carindb.Emote,
                Livery: carindb.Image,
                Miles: 0,
                Gas: 10,
                MaxGas: 10,
              };

              userdata.cars.push(carobj);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward3.endsWith(`Cash`)) {
              let amount = Number(reward3.split(" ")[0]);

              userdata.cash += parseInt(amount);
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (reward3 == "f1 blueprint") {

              userdata.f1blueprint += 1
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
            if (partdb.Parts[reward3.toLowerCase()]) {
              userdata.parts.push(reward3.toLowerCase());
              userdata.save();
              await interaction.editReply({ content: "✅" });
              collector.stop();
              return;
            }
          }
        });

        
        clearTimeout(yt)

      }, 5000);
    }
  }
  catch(err){
    return console.log(err)
  }
  },
};
