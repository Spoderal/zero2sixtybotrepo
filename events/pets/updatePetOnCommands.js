const User = require(`../schema/profile-schema`);

async function updatePetOnCommands(interaction) {
  let userdata = await User.findOne({ id: interaction.user.id });
  let pet = userdata?.pet;

  if (!userdata || !pet) return;
  let newlove = (pet.condition -= 1);
  let newoil = (pet.oil -= 1);
  await User.findOneAndUpdate(
    {
      id: interaction.user.id,
    },
    {
      $set: {
        "pet.oil": newoil,
        "pet.condition": newlove,
      },
    }
  );

  if (pet.oil < 50 || pet.condition < 50) pet.love -= 1;
  else if (pet.love < 10) {
    interaction.user.send(
      `Careful, your pets love is below 10! It might blow up!`
    );
  } else if (pet.love <= 0) {
    interaction.user.send(`Your pet blew up! Next time, take care of it!`);
    pet = null;
  }

  userdata.save();
}

module.exports = {
  updatePetOnCommands,
};
