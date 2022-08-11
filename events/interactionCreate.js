// const User = require(`../schema/profile-schema`);

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
    }
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      console.log(
        JSON.stringify(
          { command: { ...command }, interaction: { ...interaction } },
          null,
          2
        )
      );
      if (!command) return;

      try {
        await command.execute(interaction);
        // let userdata = await User.findOne({ id: interaction.user.id });

        // if (!userdata) return;

        // let pet = userdata.pet;
        // if (userdata && pet) {
        //   let newlove = (pet.condition -= 1);
        //   let newoil = (pet.oil -= 1);

        //   await User.findOneAndUpdate(
        //     {
        //       id: interaction.user.id,
        //     },
        //     {
        //       $set: {
        //         "pet.oil": newoil,
        //         "pet.condition": newlove,
        //       },
        //     }
        //   );

        //   if (pet.oil < 50 || pet.condition < 50) pet.love -= 1;
        //   if (pet.love < 10) {
        //     interaction.user.send(
        //       `Careful, your pets love is below 10! It might blow up!`
        //     );
        //   }
        //   if (pet.love <= 0) {
        //     interaction.user.send(
        //       `Your pet blew up! Next time, take care of it!`
        //     );
        //     pet = null;
        //   }
        //   userdata.save();
        // }
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
