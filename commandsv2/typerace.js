const ms = require("pretty-ms");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Cooldowns = require("../schema/cooldowns");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const Global = require("../schema/global-schema");
const cardb = require("../data/cardb.json");
const { toCurrency } = require("../common/utils");
const achievementdb = require("../data/achievements.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("typerace")
    .setDescription("Test your typing speeds")
    .addSubcommand((subcommand) => subcommand
    .setName("race")
    .setDescription("Test your typing speeds")
    
    )
    .addSubcommand((subcommand) => subcommand
    .setName("leaderboard")
    .setDescription("View the typing leaderboard")),

  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();

    if(subcommand === "race") {
    let userdata = await User.findOne({ id: interaction.user.id });

    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });

      let typecooldown = cooldowndata.typecooldown;
      let timeout = 60000;

        if (cooldowndata.typecooldown !== null &&
          timeout - (Date.now() - cooldowndata.typecooldown) > 0) {
            let timeleft = ms(timeout - (Date.now() - cooldowndata.typecooldown));
            let embed = new discord.EmbedBuilder();

            embed.setTitle("Error!");
            embed.setColor(colors.discordTheme.red);
            embed.setDescription(`You have to wait ${timeleft} before you can type race again!`)
            return await interaction.reply({ embeds: [embed] });

        }

    cooldowndata.typecooldown = Date.now();

    cooldowndata.save();

    let sentences = ["ferrari is cool", "zero2sixty car", "best bot", "love the bot", "walter stinks"]
    let randomsentence = sentences[Math.floor(Math.random() * sentences.length)];
    let anticopy = randomsentence.split("").join(" ");

    let filter = (m) => m.author.id === interaction.user.id;

    await interaction.reply(`Type the sentence below as fast as you can!\n\n**${anticopy}**`);

    let start = Date.now();

    let response = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000 });

    if (!response.size) return await interaction.followUp("You didn't type anything on time");

    let end = Date.now();
    
    let time = end - start

    let sentence = response.first().content;

    if (sentence.toLowerCase() !== randomsentence.toLowerCase()) return await interaction.followUp("You did not type the correct sentence!");
    
    console.log(time)
    let timer2 = (end - start) * 0.001
    let multiplier = Number(timer2)
    console.log(multiplier);
    let rewards = Math.floor(50 / multiplier);

    let embed = new discord.EmbedBuilder();
    embed.setTitle("Results");
    embed.setColor(colors.discordTheme.green);
    embed.setDescription(`You typed the sentence in ${ms(time)}! You received ${rewards} keys!`)
    embed.setThumbnail("https://i.ibb.co/WV534Dt/key-z.png")
    await interaction.editReply({ embeds: [embed] });
  
    userdata.zkeys += rewards;
    let ogtime = userdata.typespeed2
    if(time < ogtime || !ogtime || userdata.typespeed2 == 0){
        userdata.typespeed2 = time
        
      }
      userdata.save()
  
    }
    else if(subcommand == "leaderboard"){
      await interaction.deferReply();
      let users = await User.find()
      let embed = new discord.EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor(colors.discordTheme.green)
      .setDescription("View the top 10 fastest typers!")
      .setThumbnail("https://i.ibb.co/WV534Dt/key-z.png")
      .setFooter({ text: "The lower the time, the better!" })

      let filteredUsers = users
      .filter((value) => value.typespeed2 > 0)
      .sort((b, a) => b.typespeed2 - a.typespeed2)

     filteredUsers = filteredUsers.slice(0 ,10)
      console.log(filteredUsers.length)
      for (let i = 0; i < filteredUsers.length; i++) {
        let user = filteredUsers[i];
        let userfetch = await interaction.client.users.fetch(user.id).catch(() => {});
        embed.addFields({name: `#${i + 1} ${userfetch.username}`, value: `Type Speed: ${ms(user.typespeed2)}`});

      }
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
