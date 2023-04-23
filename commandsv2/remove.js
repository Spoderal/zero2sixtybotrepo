const discord = require("discord.js");
const partdb = require("../data/partsdb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { capitalize } = require("lodash");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");
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
          { name: "Weight reduction", value: "Weight reduction" },
          { name: "Intercooler", value: "intercooler" },
          { name: "Nitro", value: "nitro" },
          { name: "Brakes", value: "brakes" },
          { name: "Springs", value: "springs" },
          { name: "Drivetrain", value: "drivetrain" },
          { name: "All", value: "all" }
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
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

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
    console.log(actpart);
    if (!selected[actpart] && actpart !== "All")
      return await interaction.reply(`This car doesn't have a "${actpart}" !`);

    if (actpart == "All") {
      let carindb = cardb.Cars[selected.Name.toLowerCase()];
      if (selected.Exhaust !== null) {
        userdata.parts.push(selected.Exhaust.toLowerCase());
      }
      if (selected.Tires !== null) {
        userdata.parts.push(selected.Tires.toLowerCase());
      }
      if (selected.Intake !== null) {
        userdata.parts.push(selected.Intake.toLowerCase());
      }
      if (selected.Turbo !== null) {
        userdata.parts.push(selected.Turbo.toLowerCase());
      }
      if (selected.Suspension !== null) {
        userdata.parts.push(selected.Suspension.toLowerCase());
      }
      if (selected.Spoiler !== null) {
        userdata.parts.push(selected.Spoiler.toLowerCase());
      }
      if (selected.Body !== null) {
        userdata.parts.push(selected.Body.toLowerCase());
      }
      if (selected.ECU !== null) {
        userdata.parts.push(selected.ECU.toLowerCase());
      }
      if (selected.Clutch !== null) {
        userdata.parts.push(selected.Clutch.toLowerCase());
      }
      if (selected.Engine !== null) {
        userdata.parts.push(selected.Engine.toLowerCase());
      }
      if (selected.Gearbox !== null) {
        userdata.parts.push(selected.Gearbox.toLowerCase());
      }
      if (selected.Intercooler !== null) {
        userdata.parts.push(selected.Intercooler.toLowerCase());
      }
      if (selected.Springs !== null) {
        userdata.parts.push(selected.Springs.toLowerCase());
      }
      if (selected.Brakes !== null) {
        userdata.parts.push(selected.Brakes.toLowerCase());
      }
      if (selected.Drivetrain !== null) {
        userdata.parts.push(selected.Drivetrain.toLowerCase());
      }
      if (selected["Weight reduction"] !== null) {
        userdata.parts.push(selected["Weight reduction"].toLowerCase());
      }
      selected.Exhaust = null;
      selected.Tires = null;
      selected.Intake = null;
      selected.Turbo = null;
      selected.Suspension = null;
      selected.Spoiler = null;
      selected.Body = null;
      selected.ECU = null;
      selected.Clutch = null;
      selected.Engine = null;
      selected.Gearbox = null;
      selected.Intercooler = null;
      selected["Weight reduction"] = null;
      selected.Brakes = null;
      selected.Drivetrain = null;
      selected.Springs = null;
      selected.Speed = carindb.Speed;
      selected.Acceleration = carindb["0-60"];
      selected.Weight = carindb.Weight;
      selected.Handling = carindb.Handling;
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

      userdata.save();

      return interaction.reply("Removed all parts from your car!");
    }

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
      if (selected.Acceleration < 2) selected.Acceleration = 2;
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
    if (partindb.DecreaseWeight && partindb.DecreaseWeight > 0) {
      let newspeed = Number(partindb.DecreaseWeight);
      let stat = Number(selected.WeightStat);
      if (stat > 500) {
        selected.WeightStat = stat += newspeed;
      }
    }
    if (partindb.AddWeight && partindb.AddWeight > 0) {
      let newspeed = Number(partindb.AddWeight);
      let stat = Number(selected.WeightStat);
      selected.WeightStat = stat -= newspeed;
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
