

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const titlesdb = require("../data/titles.json");
const outfits = require("../data/characters.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editprofile")
    .setDescription("Edit your profile card and character")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Helmet, outfit, or accessory")
        .addChoices(
          { name: "Helmet", value: "helmet" },
          { name: "Outfit", value: "outfit" },
          { name: "Accessory", value: "accessory" }

        )

        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The helmet, title, or outfit you'd like to set")
        .setRequired(false)
    ),
  async execute(interaction) {
    let option = interaction.options.getString("option");
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let bgdb = require("../data/backgrounds.json");

    if (option == "helmet") {
      let userpfps = userdata.outfits;

      let pfp = interaction.options.getString("item");
      if (!pfp) return await interaction.reply("Specify a helmet.");
      if (!outfits.Helmets[pfp.toLowerCase()]) return await interaction.reply("Thats not a helmet.");
      if (!userpfps)  return await interaction.reply("You dont have any profile pictures.");
      if (!userpfps.includes(pfp.toLowerCase()))   return await interaction.reply("You dont own that helmet.");



      userdata.helmet = pfp.toLowerCase();
      userdata.save();

      await interaction.reply(`Set your helmet to "${pfp}"`);
    } 
   else if (option == "outfit") {
      let userpfps = userdata.outfits;

      let pfp = interaction.options.getString("item");
      if (!pfp) return await interaction.reply("Specify a outfit.");
      if (!outfits.Outfits[pfp.toLowerCase()]) return await interaction.reply("Thats not a outfit.");
      if (!userpfps)  return await interaction.reply("You dont have any profile pictures.");
      if (!userpfps.includes(pfp.toLowerCase()))   return await interaction.reply("You dont own that outfit.");



      userdata.outfit = pfp.toLowerCase();
      userdata.save();

      await interaction.reply(`Set your outfit to "${pfp}"`);
    } 
    else if (option == "accessory") {
      let userpfps = userdata.outfits;

      let pfp = interaction.options.getString("item");
      if (!pfp) return await interaction.reply("Specify a accessory.");
      if (!outfits.Accessories[pfp.toLowerCase()]) return await interaction.reply("Thats not a accessory.");
      if (!userpfps)  return await interaction.reply("You dont have any profile pictures.");
      if (!userpfps.includes(pfp.toLowerCase()))   return await interaction.reply("You dont own that outfit.");



      userdata.accessory = pfp.toLowerCase();
      userdata.save();

      await interaction.reply(`Set your accessory to "${pfp}"`);
    } 
  },
};
