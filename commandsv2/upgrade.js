const discord = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { capitalize } = require("lodash");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upgrade")
    .setDescription("Upgrade a part on your car")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("Your car ID or Name to upgrade")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("part").setDescription("The part Name").setRequired(true)
    ),

  async execute(interaction) {
    let inputCarIdOrName = interaction.options.getString("car");
    let inputPartName = interaction.options.getString("part").toLowerCase();
    let partInLocalDB = partdb.Parts[inputPartName];
    if (!partInLocalDB) {
      return await interaction.reply("That's not a valid part");
    }

    let partType =
      partInLocalDB.Type === "ecu" ? "ECU" : capitalize(partInLocalDB.Type);

    let user1 = interaction.user;
    let userdata = await User.findOne({ id: user1.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let userParts = userdata.parts;
    let userCar = userdata.cars.find(
      (car) => car.ID == inputCarIdOrName || car.Name == inputCarIdOrName
    );

    if (inputCarIdOrName == "pet") {
      if (!userParts.includes("pet spoiler"))
        return await interaction.reply("You don't have a pet spoiler!");
      userdata.pet.spoiler = true;
      userdata.save();

      await interaction.reply(`✅`);
      return;
    }

    let selected = userCar || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red).setDescription(`
          That car/id isn't selected!
          Use \`/ids select [id] [car to select]\` to select a car to your specified id!\n
          **Example: \`/ids select 1 1995 mazda miata\`**
        `);
      return await interaction.reply({ embeds: [errembed] });
    }

    if (!userdata.parts.includes(inputPartName))
      return await interaction.reply("You don't have this part!");

    if (selected?.[partType])
      return await interaction.reply(`This car already has a ${partType}!`);

    if (partInLocalDB?.AddedSpeed > 0) {
      let newspeed = Number(partInLocalDB.AddedSpeed);
      let stat = Number(selected.Speed);
      selected.Speed = stat += newspeed;
    }
    if (partInLocalDB?.DecreaseSpeed > 0) {
      let newspeed = Number(partInLocalDB.DecreasedSpeed);
      let stat = Number(selected.Speed);
      selected.Speed = stat -= newspeed;
    }
    if (partInLocalDB?.AddedSixty > 0) {
      let newspeed = parseFloat(partInLocalDB.AddedSixty);
      let stat = parseFloat(selected.Acceleration);
      if (stat > 2) selected.Acceleration = stat -= newspeed;
      if (selected.Acceleration < 2) selected.Acceleration = 2;
    }
    if (partInLocalDB?.DecreasedSixty > 0) {
      let newspeed = parseFloat(partInLocalDB.DecreasedSixty);
      let stat = parseFloat(selected.Acceleration);
      selected.Acceleration = stat += newspeed;
    }
    if (partInLocalDB?.AddHandling > 0) {
      let newspeed = Number(partInLocalDB.AddHandling);
      let stat = Number(selected.Handling);
      selected.Handling = stat += newspeed;
    }
    if (partInLocalDB?.DecreasedHandling > 0) {
      let newspeed = Number(partInLocalDB.DecreasedHandling);
      let stat = Number(selected.Handling);
      selected.Handling = stat -= newspeed;
    }
    if (partInLocalDB?.AddedDrift > 0) {
      let newspeed = Number(partInLocalDB.AddedDrift);
      let stat = Number(selected.Drift);
      selected.Drift = stat += newspeed;
    }
    if (partInLocalDB?.DecreasedDrift > 0) {
      let newspeed = Number(partInLocalDB.DecreasedDrift);
      let stat = Number(selected.Drift);
      selected.Drift = stat -= newspeed;
    }
    if (selected?.Price && partInLocalDB?.Price > 0) {
      let resale = Number(partInLocalDB.Price * 0.35);
      let stat = Number(selected.Price);
      selected.Price = stat += resale;
    }

    selected[partType] = partInLocalDB.Name;

    await User.findOneAndUpdate(
      {
        id: user1.id,
      },
      {
        $set: {
          "cars.$[car]": selected,
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": selected.Name,
          },
        ],
      }
    );
    if(userdata.tutorial && userdata.tutorial.stage == 1){
      console.log("tutorial")
      interaction.channel.send({content: `Nice! Now your car is even faster! Thats all from the tutorial! If you have any other questions make sure to join the support server!`})
      userdata.tutorial = null
    }
    userdata.parts.splice(userdata.parts.indexOf(partInLocalDB.Name.toLowerCase()), 1);
    userdata.save();

    await interaction.reply(
      `Upgraded your ${partType} to ${partInLocalDB?.Name || inputPartName}`
    );
  },
};
