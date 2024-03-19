const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require(`../schema/profile-schema`);
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json");
const achievementdb = require("../data/achievements.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givebage")
    .setDescription("Give badges to users (OWNER ONLY)")
    .addStringOption((option) =>
      option
        .setName("badge")
        .setDescription("The badge to give")
        .setRequired(true)
        .addChoices({name: "Bug Smasher", value: "bug smasher"})
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the item to")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "937967206652837928"
    ) {
      await interaction.reply("You dont have permission to use this command!");
      return;
    } else {
      let togive = interaction.options.getString("badge");
      let givingto = interaction.options.getUser("user");

      if (!togive) return;
      if (!givingto) return;

      let udata2 = await User.findOne({ id: givingto.id });

 
     let badge =  achievementdb.Achievements[togive]

     let badgein = {
         name: badge.Name,
         id: badge.Name.toLowerCase(),
         completed: true
      
     }

      udata2.achievements.push(badgein);

      udata2.save()

      await interaction.reply(`Gave ${givingto.username} the ${togive} achievement!`)
      
    }
  },
};
