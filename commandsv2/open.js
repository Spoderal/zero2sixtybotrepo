"use strict";

const lodash = require("lodash");
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const titledb = require("../data/titles.json");
const partdb = require("../data/partsdb.json");

const ms = require("ms");
const Cooldowns = require("../schema/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a crate for helmets, cash, and more!")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to open")
        .addChoices(
          { name: "Common Crate", value: "common crate" },
          { name: "Rare Crate", value: "rare crate" },
          { name: "Prestige Crate", value: "prestige crate" },
          { name: "Vote Crate", value: "vote crate" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    let pfps = require("../data/pfpsdb.json");
    let crates = require("../data/cratedb.json");

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });
    let bought = interaction.options.getString("crate");
    let inv = userdata.items;
    let cooldown = 10000;
    let cratecool = cooldowndata.crate;
    if (cratecool !== null && cooldown - (Date.now() - cratecool) > 0) {
      let time = ms(cooldown - (Date.now() - cratecool));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Please wait ${time} before opening another crate.`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      return;
    }
    let boughtindb = crates.Crates[bought.toLowerCase()];
    console.log(boughtindb);

    if (!inv.includes(bought))
      return interaction.reply(
        `You don't have a ${boughtindb.Emote} ${boughtindb.Name}!`
      );

    let embed = new EmbedBuilder()
      .setTitle(`Unboxing ${boughtindb.Emote} ${boughtindb.Name}...`)
      .setColor(`#60b0f4`);

    interaction.reply({ embeds: [embed] });
    for (var s = 0; s < 1; s++)
      inv.splice(inv.indexOf(bought.toLowerCase()), 1);
    userdata.items = inv;
    userdata.update();
    cooldowndata.crate = Date.now();
    cooldowndata.save();
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

    setTimeout(async () => {
      let reward1 = rewards[0];
      let reward2 = rewards[1];
      let reward3 = rewards[2];
      let rewardsarr = []
      

      let name1;
      let name2;
      let name3;
      userdata = await User.findOne({ id: interaction.user.id });
      if (pfps.Pfps[reward1]) {
        name1 = `${pfps.Pfps[reward1].Emote} ${pfps.Pfps[reward1].Name}`
        
        userdata.pfps.push(pfps.Pfps[reward1].Name.toLowerCase());
        userdata.update();
      }
      if (pfps.Pfps[reward2]) {
        name2 = `${pfps.Pfps[reward2].Emote} ${pfps.Pfps[reward2].Name}`
        userdata.pfps.push(pfps.Pfps[reward2].Name.toLowerCase());
        userdata.update();
      }
      if (pfps.Pfps[reward3]) {
        name3 = `${pfps.Pfps[reward3].Emote} ${pfps.Pfps[reward3].Name}`

        userdata.pfps.push(pfps.Pfps[reward3].Name.toLowerCase());
        userdata.update();
      }

      

      if (reward1.endsWith(`Cash`)) {
        let amount = Number(reward1.split(" ")[0]);
        name1 = `$${amount} Cash`
        userdata.cash += amount;
        userdata.update();
      }

      if (reward2.endsWith(`Cash`)) {
        let amount2 = Number(reward2.split(" ")[0]);
        name2 = `$${amount2} Cash`
        userdata.cash += amount2;
        userdata.update();
      }

      if (reward3.endsWith(`Cash`)) {
        let amount3 = Number(reward3.split(" ")[0]);
        name3 = `$${amount3} Cash`

        userdata.cash += amount3;
        userdata.update();
      }

      if (titledb[reward1]) {
        name1 = titledb[reward1].Name;
        userdata.titles.push(name1.toLowerCase());
        userdata.update();
      }
      if (titledb[reward2]) {
        name2 = titledb[reward2].Name;
        userdata.titles.push(name2.toLowerCase());
        userdata.update();
      }
      if (titledb[reward3]) {
        name3 = titledb[reward3].Name;
        userdata.titles.push(name3.toLowerCase());
        userdata.update();
      }

      if (partdb.Parts[reward1]) {
        name1 = partdb.Parts[reward1].Name;
        
        userdata.parts.push(name1.toLowerCase());
        userdata.update();
      }
      if (partdb.Parts[reward2]) {
        name2 = partdb.Parts[reward2].Name;

        userdata.parts.push(name2.toLowerCase());
        userdata.update();
      }
      if (partdb.Parts[reward3]) {
        name3 = partdb.Parts[reward3].Name;
       
        userdata.parts.push(name3.toLowerCase());
        userdata.update();
      }

      await userdata.save();
      rewardsarr.push(`${name1}`)
      rewardsarr.push(`${name2}`)
      rewardsarr.push(`${name3}`)

 
      embed.setDescription(`${rewardsarr.join('\n')}`);
      console.log(rewards);
      await interaction.editReply({ embeds: [embed] });
    }, 5000);
  },
};
