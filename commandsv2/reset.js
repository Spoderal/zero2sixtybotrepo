const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("BOT OWNER ONLY")
    .addStringOption((option) =>
      option.setName("command").setDescription("The command").setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "670895157016657920"
    ) {
      await interaction.reply({
        content: "You dont have permission to use this command!",
        ephemeral: true,
      });
      return;
    } else {
      const User = require(`../schema/profile-schema`);
      const cardb = require("../data/cardb.json");
      const partdb = require("../data/partsdb.json");
      const ocardb = require("../data/oldcars.json");

      let users = await User.find();

      for (let u in users) {
        let userdata = users[u];
        if (
          userdata !== undefined &&
          userdata !== null &&
          userdata.id &&
          userdata.id !== null
        ) {
          try {
            let udata = await User.findOne({ id: userdata.id });
            console.log(udata);
            if (udata !== null) {
              udata.rp4 = 0;
              udata.notoriety = 0;
              udata.seasonrewards = [];
              udata.season1claimed = 0;
              udata.crew = null;

              udata.save();
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  },
};
