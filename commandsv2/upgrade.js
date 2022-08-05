const discord = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upgrade")
    .setDescription("Upgrade a part on your car")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to remove")
        .addChoice("Exhaust", "exhaust")
        .addChoice("Tires", "tires")
        .addChoice("Intake", "intake")
        .addChoice("Turbo", "turbo")
        .addChoice("Suspension", "suspension")
        .addChoice("Spoiler", "spoiler")
        .addChoice("Body", "body")
        .addChoice("ECU", "ecu")
        .addChoice("Clutch", "clutch")
        .addChoice("Engine", "engine")
        .addChoice("Gearbox", "gearbox")
        .addChoice("Weight", "weight")
        .addChoice("Intercooler", "intercooler")

        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to upgrade the part on")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("partname")
        .setDescription("The part name to add")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user1 = interaction.user;
    let userdata = await User.findOne({ id: user1.id });
    let parttoinstall = interaction.options.getString("part");
    let cartoinstall = interaction.options.getString("car");
    let parte = interaction.options.getString("partname");

    let actpart;

    switch (parttoinstall) {
      case "exhaust":
        actpart = "Exhaust";
        break;
      case "intake":
        actpart = "Intake";
        break;
      case "tires":
        actpart = "Tires";
        break;
      case "engine":
        actpart = "Engine";
        break;
      case "turbo":
        actpart = "Turbo";
        break;
      case "weight":
        actpart = "Weight";
        break;
      case "gearbox":
        actpart = "Gearbox";
        break;
      case "body":
        actpart = "Body";
        break;
      case "ecu":
        actpart = "ECU";
        break;
      case "spoiler":
        actpart = "Spoiler";
        break;
      case "suspension":
        actpart = "Suspension";
        break;
      case "intercooler":
        actpart = "Intercooler";
        break;
      case "clutch":
        actpart = "Clutch";
        break;
    }

    let filteredcar = userdata.cars.filter((car) => car.ID == cartoinstall);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }

    console.log(actpart);
    let realpart = parte;
    if (!userdata.parts.includes(realpart.toLowerCase()))
      return interaction.reply(`You don't have this part!`);
    if (selected[actpart] && selected[actpart] !== null)
      return interaction.reply(`This car already has a "${actpart}"!`);
    console.log(realpart);
    let partindb = partdb.Parts[realpart.toLowerCase()];
    if (partindb.AddedSpeed && partindb.AddedSpeed > 0) {
      let newspeed = Number(partindb.AddedSpeed);
      let stat = Number(selected.Speed);
      selected.Speed = stat += newspeed;
    }
    if (partindb.DecreasedSpeed && partindb.DecreaseSpeed > 0) {
      let newspeed = Number(partindb.DecreasedSpeed);
      let stat = Number(selected.Speed);

      selected.Speed = stat -= newspeed;
    }
    if (partindb.AddedSixty && partindb.AddedSixty > 0) {
      let newspeed = parseFloat(partindb.AddedSixty);
      let stat = parseFloat(selected.Acceleration);

      selected.Acceleration = stat -= newspeed;
    }
    if (partindb.DecreasedSixty && partindb.DecreasedSixty > 0) {
      let newspeed = parseFloat(partindb.DecreasedSixty);
      let stat = parseFloat(selected.Acceleration);

      selected.Acceleration = stat += newspeed;
    }
    if (partindb.AddHandling && partindb.AddHandling > 0) {
      let newspeed = Number(partindb.AddHandling);
      let stat = Number(selected.Handling);

      selected.Handling = stat += newspeed;
    }
    if (partindb.DecreasedHandling && partindb.DecreasedHandling > 0) {
      let newspeed = Number(partindb.DecreasedHandling);
      let stat = Number(selected.Handling);

      selected.Handling = stat -= newspeed;
    }
    if (partindb.AddedDrift && partindb.AddedDrift > 0) {
      let newspeed = Number(partindb.AddedDrift);
      let stat = Number(selected.Drift);

      selected.Drift = stat += newspeed;
    }
    if (partindb.DecreasedDrift && partindb.DecreasedDrift > 0) {
      let newspeed = Number(partindb.DecreasedDrift);
      let stat = Number(selected.Drift);

      selected.Drift = stat -= newspeed;
    }
    if (selected.Price && partindb.Price && partindb.Price > 0) {
      let resale = Number(partindb.Price * 0.35);

      let stat = Number(selected.Price);

      selected.Price = stat += resale;
    }

    selected[actpart] = partindb.Name;

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
    userdata.parts.pull(realpart.toLowerCase());
    userdata.save();

    interaction.reply(`✅`);
  },
};
