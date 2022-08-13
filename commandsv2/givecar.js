const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require(`../schema/profile-schema`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givecar")
    .setDescription("Give cars to users (OWNER ONLY)")
    .addStringOption((option) =>
      option.setName("car").setDescription("The car to give").setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the car to")
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
      let togive = interaction.options.getString("car");
      let givingto = interaction.options.getUser("user");

      if (!togive) return;
      if (!givingto) return;
      
      let udata2 = await User.findOne({id: givingto.id}) 
      if (!cars.Cars[togive.toLowerCase()])
      return await interaction.reply("Thats not a car!");
        let carindb = cars.Cars[togive.toLowerCase()]
        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: carindb.Speed,
          Acceleration: carindb["0-60"],
          Handling: carindb.Handling,
          Parts: [],
          Emote: carindb.Emote,
          Livery: carindb.Image,
          Miles: 0,
        };
        if (carindb.Range) {
          carobj = {
            ...carobj,
            Range: carindb.Range,
            MaxRange: carindb.Range,
          };
        }

        udata2.cars.push(carobj)
          
        udata2.save()



      await interaction.reply(
        `Gave <@${givingto.id}> a ${cars.Cars[togive.toLowerCase()].Name}`
      );
    }
  },
};
