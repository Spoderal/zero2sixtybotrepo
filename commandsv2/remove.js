const discord = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { capitalize } = require("lodash");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a part from your car")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to remove")
        .addChoices(
          { name: "Exhaust", value: "exhaust" },
          { name: "Tires", value: "tires" },
          { name: "Intake", value: "intake" },
          { name: "Turbo", value: "turbo" },
          { name: "Suspension", value: "suspension" },
          { name: "Spoiler", value: "spoiler" },
          { name: "Body", value: "body" },
          { name: "ECU", value: "ecu" },
          { name: "Clutch", value: "clutch" },
          { name: "Engine", value: "engine" },
          { name: "Gearbox", value: "gearbox" },
          { name: "Weight", value: "weight" },
          { name: "Intercooler", value: "intercooler" },
          { name: "Nitro", value: "nitro" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to remove the part from")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user1 = interaction.user;
    let userdata = await User.findOne({ id: user1.id });
    let parttoinstall = interaction.options.getString("part");
    let cartoinstall = interaction.options.getString("car");
    let actpart = parttoinstall === "ecu" ? "ECU" : capitalize(parttoinstall);

    let filteredcar = userdata.cars.find((car) => car.ID == cartoinstall);
    let selected = filteredcar || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor(colors.discordTheme.red)
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    if (!selected[actpart])
      return await interaction.reply(`This car doesn't have a "${actpart}" !`);

    let realpart = selected[actpart];
    let partindb = partdb.Parts[realpart.toLowerCase()];
    if (partindb.AddedSpeed && partindb.AddedSpeed > 0) {
      let newspeed = Number(partindb.AddedSpeed);
      let stat = Number(selected.Speed);
      selected.Speed = stat -= newspeed;
    }
    if (partindb.DecreasedSpeed && partindb.DecreaseSpeed > 0) {
      let newspeed = Number(partindb.DecreasedSpeed);
      let stat = Number(selected.Speed);
      selected.Speed = stat += newspeed;
    }
    if (partindb.AddedSixty && partindb.AddedSixty > 0) {
      let newspeed = parseFloat(partindb.AddedSixty);
      let stat = parseFloat(selected.Acceleration);
      selected.Acceleration = stat += newspeed;
    }
    if (partindb.DecreasedSixty && partindb.DecreasedSixty > 0) {
      let newspeed = parseFloat(partindb.DecreasedSixty);
      let stat = parseFloat(selected.Acceleration);
      if (stat > 2) selected.Acceleration = stat -= newspeed;
    }
    if (partindb.AddHandling && partindb.AddHandling > 0) {
      let newspeed = Number(partindb.AddHandling);
      let stat = Number(selected.Handling);
      selected.Handling = stat -= newspeed;
    }
    if (partindb.DecreasedHandling && partindb.DecreasedHandling > 0) {
      let newspeed = Number(partindb.DecreasedHandling);
      let stat = Number(selected.Handling);
      selected.Handling = stat += newspeed;
    }
    if (partindb.AddedDrift && partindb.AddedDrift > 0) {
      let newspeed = Number(partindb.AddedDrift);
      let stat = Number(selected.Drift);
      selected.Drift = stat -= newspeed;
    }
    if (partindb.DecreasedDrift && partindb.DecreasedDrift > 0) {
      let newspeed = Number(partindb.DecreasedDrift);
      let stat = Number(selected.Drift);
      selected.Drift = stat += newspeed;
    }
    if (selected.Price && partindb.Price && partindb.Price > 0) {
      let resale = Number(partindb.Price * 0.35);
      let stat = Number(selected.Price);
      selected.Price = stat -= resale;
    }

    selected[actpart] = null;
    let newobj = selected;

    await User.findOneAndUpdate(
      {
        id: user1.id,
      },
      {
        $set: {
          "cars.$[car]": newobj,
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

    userdata.parts.push(`${realpart.toLowerCase()}`);
    userdata.save();

    await interaction.reply(`Removed ${actpart} from ${selected?.Name}`);
  },
};
