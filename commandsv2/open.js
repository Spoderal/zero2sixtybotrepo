const lodash = require("lodash");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a crate for profile helmets")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to open")
        .addChoice("Common", "common")
        .addChoice("Rare", "rare")
        .addChoice("Seasonal", "seasonal")
        .setRequired(true)
    ),
  async execute(interaction) {
    let pfps = require("../data/pfpsdb.json");
    let crates = require("../data/cratedb.json");

    let userdata = await User.findOne({ id: interaction.user.id });

    let bought = interaction.options.getString("crate");
    let cash = userdata.cash;
    if (!bought)
      return interaction.reply(
        "**To use this command, specify the crate you want to buy. To check what crates are available check the crates shop by sending /crates.**"
      );
    if (!crates.Crates[bought.toLowerCase()])
      return interaction.reply(
        "**That crate isn't available yet, suggest it in the support server! In the meantime, check how to use the command by running /open.**"
      );
    if (!crates.Crates[bought.toLowerCase()].Price)
      return interaction.reply("Thats not a purchasable crate!");

    if (cash < crates.Crates[bought.toLowerCase()].Price)
      return interaction.reply(
        `You dont have enough cash! This crate costs $${
          crates.Crates[bought.toLowerCase()].Price
        }`
      );
    let cratecontents = crates.Crates[bought.toLowerCase()].Contents;
    let randomitem = lodash.sample(cratecontents);
    userdata.cash -= crates.Crates[bought.toLowerCase()].Price;
    let embed = new MessageEmbed();

    if (pfps.Pfps[randomitem]) {
      let helmets = userdata.pfps;
      if (helmets.includes(pfps.Pfps[randomitem].Name.toLowerCase())) {
        userdata.cash += crates.Crates[bought.toLowerCase()].Price;
        interaction.reply(
          `You already have the helmet you won, so you've received a full refund!`
        );
        return;
      }

      userdata.pfps.push(randomitem);
      userdata.save();
      embed.setTitle("Preview");
      embed.setThumbnail(pfps.Pfps[randomitem].Image).setColor("#60b0f4");
      interaction.reply({
        content: `You opened a ${bought} and won a ${randomitem} profile image!`,
        embeds: [embed],
      });
    }
  },
};
