const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("discord.js");
const User = require("../schema/horseschema");
const cardb = require("../data/horsedb.json");
const colors = require("../common/colors");
const lodash = require("lodash");
const { emotes } = require("../common/emotes");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Begin your racing career"),
  async execute(interaction) {
    let userid = interaction.user.id;
    let userdata = await User.findOne({ id: userid });

    if (userdata) return await interaction.reply("You have an account!");
    interaction.reply({content: "Please wait...", fetchReply: true})



    let embed = new discord.EmbedBuilder({
      title: "You've started your journey!",
      thumbnail: { url: "https://tenor.com/view/la-merveille-des-merveilles-running-horses-gallop-beautiful-horse-gif-17031952" },
      description:
        `**Welcome to Horse2Sixty!**\nAllow me to introduce you to the world of Horse2Sixty, the year is 1859, and you're about to start your journey to become the best horse racer in the world!`,
    })

    embed.setColor(`${colors.blue}`)
    let msg

      let newuser = new User({id: userid});
      let horse = "thoroughbred"
      let carindb = cardb.Horses[horse];
      userdata = await User.findOne({ id: userid });
      if (userdata) return await interaction.editReply("You have an account!");
      let carobj = {
        ID: carindb.ID,
        Name: carindb.Name,
        Speed: carindb.Speed,
        Stamina: carindb.Stamina,
        Jump: carindb.Jump,
        Emote: carindb.Emote,
        Image: carindb.Image,
        Strength: carindb.Strength
      };
      
      newuser.horses.push(carobj);
      newuser.save();

      await interaction.editReply({
        content: `**THIS IS AN APRIL FOOLS JOKE, YOUR ZERO2SIXTY DATA IS UNHARMED, AND WILL COME BACK IN 3 DAYS**`,
        embeds: [embed],
        fetchReply: true,
      });
      
    },
  };
