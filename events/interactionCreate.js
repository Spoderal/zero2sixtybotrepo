const db = require("quick.db");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
    }
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
        if (db.fetch(`pet_${interaction.user.id}`)) {
          db.subtract(`pet_${interaction.user.id}.Condition`, 1);
          db.subtract(`pet_${interaction.user.id}.Oil`, 1);

          if (db.fetch(`pet_${interaction.user.id}.Oil`) < 50) {
            db.subtract(`pet_${interaction.user.id}.Love`, 1);
            interaction.user
              .send(`Careful, your pets oil is below 50!`)
              .catch(() => console.log("Dms off"));
          }
          if (db.fetch(`pet_${interaction.user.id}.Condition`) < 50) {
            db.subtract(`pet_${interaction.user.id}.Love`, 1);

            interaction.user
              .send(`Careful, your pets condition is below 50!`)
              .catch(() => console.log("Dms off"));
          }
          if (db.fetch(`pet_${interaction.user.id}.Love`) < 50) {
            interaction.user
              .send(`Careful, your pets love is below 50!`)
              .catch(() => console.log("Dms off"));
          }
          if (db.fetch(`pet_${interaction.user.id}.Love`) <= 0) {
            interaction.user
              .send(`Your pet blew up! Next time, take care of it!`)
              .catch(() => console.log("Dms off"));

            db.delete(`pet_${interaction.user.id}`);
          }
        }
      } catch (err) {
        if (err) console.error(err);
        try {
          await interaction.reply({
            content:
              "An error occurred, please contact our support team with the details.",
            ephemeral: true,
            fetchReply: true,
          });
        } catch (err) {
          await interaction.channel.send({
            content:
              "An error occurred, please contact our support team with the details.",
            fetchReply: true,
          });
        }
      }
    }
  },
};
