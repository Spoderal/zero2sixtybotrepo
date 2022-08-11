const Discord = require("discord.js");
const pfpdb = require("../data/pfpsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editprofile")
    .setDescription("Edit your profile card")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Description or helmet")
        .addChoices(
          { name: "Helmet", value: "helmet" },
          { name: "Description", value: "description" },
          { name: "View Helmets", value: "view helmets" },
          { name: "Background", value: "background" },
          { name: "View backgrounds", value: "vbackground" }
        )

        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The helmet, or description you'd like to set")
        .setRequired(false)
    ),
  async execute(interaction) {
    let option = interaction.options.getString("option");
    let userdata = await User.findOne({ id: interaction.user.id });
    let bgdb = require("../data/backgrounds.json");

    if (option == "helmet") {
      let userpfps = userdata.pfps;

      let pfp = interaction.options.getString("item");
      if (!pfp) return await interaction.reply("Specify a helmet!");
      let pfplist = pfpdb;
      if (!pfplist.Pfps[pfp.toLowerCase()])
        return await interaction.reply("Thats not a profile picture.");
      if (!userpfps)
        return await interaction.reply("You dont have any profile pictures.");
      if (!userpfps.includes(pfp.toLowerCase()))
        return await interaction.reply("You dont own that profile picture.");

      userdata.helmet = pfp.toLowerCase();
      userdata.save();

      await interaction.reply(`Set your profile picture to "${pfp}"`);
    } else if (option == "description") {
      let titletoset = interaction.options.getString("item");
      let letterCount = titletoset.replace(/\s+/g, "").length;
      if (letterCount > 35) return await interaction.reply("Max characters 35!");

      userdata.description = titletoset;
      userdata.save();

      await interaction.reply(`Set your profile description to "${titletoset}"`);
    } else if (option == "background") {
      let pfp = interaction.options.getString("item");
      if (!pfp)
        return await interaction.reply(
          "Specify a background! The available backgrounds are: Space, Flames, Police, Finish Line, Ocean, and Default"
        );
      if (!bgdb[pfp.toLowerCase()])
        return await interaction.reply(
          "Thats not a profile background! The available backgrounds are: Space, Flames, Police, Finish Line, Ocean, and Default"
        );

      userdata.background = pfp;
      let dailytask = userdata.dailytask;
      if (
        dailytask &&
        !dailytask.completed &&
        dailytask.task == "Change your profile background"
      ) {
        interaction.channel.send(`Task completed!`);
        dailytask.completed = true;

        userdata.cash += dailytask.reward;
      }
      await interaction.reply(`Set your profile background to "${pfp}"`);
    } else if (option == "vbackground") {
      var bgs = [];
      for (let bg in bgdb) {
        bgs.push(`${bgdb[bg].Emote} ${bgdb[bg].Name}`);
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle("Backgrounds Available")
        .setDescription(`${bgs.join("\n\n")}`)
        .setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });
    } else if (option == "view helmets") {
      let userpfps = userdata.pfps;
      if (userpfps == ["None"] || userpfps == null || !userpfps)
        return await interaction.reply("You don't have any helmets!");
      var userhelmets = [];
      let actpfp;
      for (var i = 0; i < userpfps.length; i++ && userpfps !== ["None"]) {
        actpfp = userpfps[i];
        userhelmets.push(
          `${pfpdb.Pfps[actpfp].Name} ${pfpdb.Pfps[actpfp].Emote}`
        );
      }
      userhelmets = lodash.chunk(
        userhelmets.map((a) => `${a}\n`),
        10
      );
      let embed = new Discord.EmbedBuilder()
        .setTitle("Your Profile Helmets")
        .setDescription(`${userhelmets[0].join(` \n`)}`);

      embed
        .setColor(colors.blue)
        .setThumbnail("https://i.ibb.co/F0hLvQt/newzerologo.png");
      await interaction.reply("Please wait...");
      interaction.channel.send({ embeds: [embed] }).then(async (emb) => {
        ["⏮️", "◀️", "▶️", "⏭️", "⏹️"].forEach(async (m) => await emb.react(m));
        const filter = (_, u) => u.id === interaction.user.id;
        const collector = emb.createReactionCollector({ filter, time: 30000 });
        let page = 1;
        collector.on("collect", async (r, user) => {
          let current = page;
          emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
          if (r.emoji.name === "◀️" && page !== 1) page--;
          else if (r.emoji.name === "▶️" && page !== userhelmets.length) page++;
          else if (r.emoji.name === "⏮️") page = 1;
          else if (r.emoji.name === "⏭️") page = userhelmets.length;
          else if (r.emoji.name === "⏹️") return collector.stop();

          embed.setDescription(`\n${userhelmets[page - 1].join("\n")}`);

          if (current !== page) {
            embed.setFooter({ text: `Pages ${page}/${userhelmets.length}` });
            emb.edit({ embeds: [embed] });
          }
        });
      });
    }
  },
};
