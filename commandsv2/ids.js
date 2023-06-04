const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ids")
    .setDescription("Manage your ids")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("select")
        .setDescription("Select a car to an ID")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car to set an id to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("id").setDescription("The id to set").setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("favorite")
        .setDescription("Favorite a car via IDs")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car to favorite")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unfavorite")
        .setDescription("Unfavorite a car via IDs")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car to favorite")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("tag")
      .setDescription("Tag a car for a group, such as for sale")
      .addStringOption((option) =>
        option
          .setName("car")
          .setDescription("The car to set an id to")
          .setRequired(true)
      )
      .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription("The tag to set, example: my porsches")
        .setRequired(true)
    )
  ),
  async execute(interaction) {
    const db = require("quick.db");

    let option = interaction.options.getSubcommand();

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let uid = interaction.user.id;

    if (option == "select") {
      let cars = require("../data/cardb.json");
      let usercars = userdata.cars;
      let idtochoose = interaction.options.getString("id");

      if (!usercars) return await interaction.reply("You don't own any cars!");
      let selecting = interaction.options.getString("car");
      if (!selecting) return await interaction.reply("Specify a car!");
      if (!idtochoose)
        return await interaction.reply(
          "Specify an id! Example: /ids select 1 1995 mazda miata"
        );

      if (!cars.Cars[selecting.toLowerCase()])
        return await interaction.reply("Thats not a car!");

      if (idtochoose == cars.Cars[selecting.toLowerCase()].Name)
        return await interaction.reply(
          "A car id must be unique! Not the car name."
        );
      let filteredcar = userdata.cars.filter(
        (car) => car.Name == cars.Cars[selecting.toLowerCase()].Name
      );
      let selected = filteredcar[0] || "No ID";
      if (selected == "No ID")
        return await interaction.reply("You don't own that car!");

      await User.findOneAndUpdate(
        {
          id: uid,
        },
        {
          $set: {
            "cars.$[car].ID": idtochoose,
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

      let embed = new Discord.EmbedBuilder()
        .setTitle("Selected ✅")
        .setDescription(
          `Selected your **${
            cars.Cars[selecting.toLowerCase()].Name
          }** to the ID "${idtochoose}", check with \`/garage cars\``
        )
        .setColor(`#60b0f4`);
      await interaction.reply({ embeds: [embed] });
    } else if (option == "deselect") {
      let usercars = db.fetch(`cars_${interaction.user.id}`);
      let idtochoose = interaction.options.getString("id");
      let selectedids = db.fetch(`selectedids_${interaction.user.id}`);
      if (!usercars) return await interaction.reply("You don't own any cars!");
      if (!idtochoose) return await interaction.reply("Specify an id!");
      if (!db.fetch(`selected_${idtochoose}_${interaction.user.id}`))
        return await interaction.reply(
          `There is no car set to that id! Run /ids select [id] [car] to select it, if you are reselecting a car, here's your old IDs: ${selectedids.join(
            ", "
          )}`
        );

      let selectedcar = db.fetch(
        `selected_${idtochoose}_${interaction.user.id}`
      );

      let cartoremove = `${idtochoose} : ${
        cars.Cars[selectedcar.toLowerCase()].Name
      }`;
      const filtered = selectedids.filter((e) => e !== cartoremove);
      db.set(`selectedids_${interaction.user.id}`, filtered);
      db.delete(`selected_${idtochoose}_${interaction.user.id}`);
      db.delete(`selected_${idtochoose}_${interaction.user.id}`);
      db.delete(
        `isselected_${cars.Cars[selectedcar.toLowerCase()].Name}_${
          interaction.user.id
        }`
      );
      db.delete(
        `selected_${cars.Cars[selectedcar.toLowerCase()].Name}_${
          interaction.user.id
        }`
      );

      await interaction.reply(`You deselected ${idtochoose}`);
    } else if (option == "favorite") {
      let idtochoose = interaction.options.getString("car");
      let carfiltered = userdata.cars.filter(
        (car) =>
          car.Name.toLowerCase() == idtochoose.toLowerCase() ||
          car.ID == idtochoose.toLowerCase()
      );
      if (!carfiltered[0])
        return interaction.reply(
          `That car wasn't found in your cars, did you make sure to specify a car id, or its name?`
        );

      let embed = new Discord.EmbedBuilder()
        .setTitle("New Favorite ⭐")
        .setColor(colors.blue)
        .setDescription(
          `${cars.Cars[carfiltered[0].Name.toLowerCase()].Emote} ${
            carfiltered[0].Name
          }`
        )
        .setThumbnail(`${cars.Cars[carfiltered[0].Name.toLowerCase()].Image}`);

      carfiltered[0]["Favorite"] = true;

      console.log(carfiltered);

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": carfiltered[0],
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": carfiltered[0].Name,
            },
          ],
        }
      );

      userdata.markModified("cars");
      userdata.save();

      await interaction.reply({ embeds: [embed] });
    }
    else if (option == "tag") {
      let idtochoose = interaction.options.getString("car");
      let carfiltered = userdata.cars.filter(
        (car) =>
          car.Name.toLowerCase() == idtochoose.toLowerCase() ||
          car.ID == idtochoose.toLowerCase()
      );
      let tagtoset = interaction.options.getString("tag");
      if (!carfiltered[0])
        return interaction.reply(
          `That car wasn't found in your cars, did you make sure to specify a car id, or its name?`
        );

      let embed = new Discord.EmbedBuilder()
        .setTitle("New Tag 🏷️")
        .setColor(colors.blue)
        .setDescription(
          `${cars.Cars[carfiltered[0].Name.toLowerCase()].Emote} ${
            carfiltered[0].Name
          }`
        )
        .setThumbnail(`${cars.Cars[carfiltered[0].Name.toLowerCase()].Image}`);

      carfiltered[0]["Tag"] = tagtoset;

      console.log(carfiltered);

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": carfiltered[0],
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": carfiltered[0].Name,
            },
          ],
        }
      );

      userdata.markModified("cars");
      userdata.save();

      await interaction.reply({ embeds: [embed] });
    }
    else if (option == "unfavorite") {
      let idtochoose = interaction.options.getString("car");
      let carfiltered = userdata.cars.filter(
        (car) =>
          car.Name.toLowerCase() == idtochoose.toLowerCase() ||
          (car.ID == idtochoose.toLowerCase() && car.Favorite == true)
      );
      if (!carfiltered[0])
        return interaction.reply(
          `That car wasn't found in your cars, did you make sure to specify a car id, or its name? It could also not be favorited`
        );

      let embed = new Discord.EmbedBuilder()
        .setTitle("Removed Favorite ✅")
        .setColor(colors.blue)
        .setDescription(
          `${cars.Cars[carfiltered[0].Name.toLowerCase()].Emote} ${
            carfiltered[0].Name
          }`
        )
        .setThumbnail(`${cars.Cars[carfiltered[0].Name.toLowerCase()].Image}`);

      carfiltered[0]["Favorite"] = false;

      console.log(carfiltered);

      await User.findOneAndUpdate(
        {
          id: interaction.user.id,
        },
        {
          $set: {
            "cars.$[car]": carfiltered[0],
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": carfiltered[0].Name,
            },
          ],
        }
      );

      userdata.markModified("cars");
      userdata.save();

      await interaction.reply({ embeds: [embed] });
    }
  },
};
