

const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
let cardb = require("../data/cardb.json");
const { numberWithCommas } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rating")
    .setDescription("See your cars rating")
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car to view the rating of")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let caroption = interaction.options.getString("car");

    let usercars = userdata.cars || [];

    let selected = usercars.filter((car) => car.ID == caroption);

    if (!selected[0])
      return interaction.reply(
        "Thats not a car! Make sure to specify the car by **ID**, not name"
      );
    let stars = [];
    let rating = selected[0].Rating || 0;
    let washed = selected[0].Dirt || 100;
    let miles = selected[0].Miles || 0;

    if (userdata.items.includes("star sticker")) {
      rating += 1;
    }

    if (washed < 50) {
      rating -= 2;
    }

    if (rating <= 2) {
      stars = ["⭐"];
    } else if (rating <= 4) {
      stars = ["⭐", "⭐"];
    } else if (rating <= 6) {
      stars = ["⭐", "⭐", "⭐"];
    } else if (rating <= 8) {
      stars = ["⭐", "⭐", "⭐", "⭐"];
    } else if (rating >= 9) {
      stars = ["⭐", "⭐", "⭐", "⭐", "⭐"];
    }

    let carimg =
      selected[0].Image || cardb.Cars[selected[0].Name.toLowerCase()].Image;

    let embed = new EmbedBuilder()
      .setTitle(`Rating of your ${selected[0].Name}`)
      .setDescription(`${stars.join(" ")}`)
      .setImage(`${carimg}`)
      .setColor(colors.blue)
      .addFields(
        { name: `Cleanliness`, value: `${washed}%` },
        { name: `Miles`, value: `${numberWithCommas(miles)}` }
      )
      .setFooter({
        text: `Boost your rating by installing body kits, liveries, and washing it!`,
      });

    if (washed < 50) {
      embed.setColor(`#54412f`);
    }

    if (selected[0].HasLivery) {
      embed.addFields({ name: `Livery`, value: `⭐` });
    }

    let price = 100;


    let row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("wash")
        .setEmoji(`🧼`)
        .setLabel(`Wash for $${price}`)
        .setStyle(`Secondary`)
    );

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id == btnInt.user.id;
    };
    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "wash") {
        selected[0].Dirt = 100;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "cars.$[car]": selected[0],
            },
          },

          {
            arrayFilters: [
              {
                "car.Name": selected[0].Name,
              },
            ],
          }
        );

        userdata.save();

        interaction.editReply({ content: `Washed!`, fetchReply: true });
      }
    });
  },
};
