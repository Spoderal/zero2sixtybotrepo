const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pvp")
    .setDescription("PVP race another user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to race with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id you want to race with")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car2")
        .setDescription("The users car id they want to race you with")
        .setRequired(true)
    ),
  async execute(interaction) {
    const discord = require("discord.js");

    const cars = require("../data/cardb.json");

    let user = interaction.user;
    let user2 = interaction.options.getUser("target");
    let car = interaction.options.getString("car");
    let car2 = interaction.options.getString("car2");

    if (!user2) return await interaction.reply("Specify a user to race!");

    let userdata = await User.findOne({ id: user.id });
    let userdata2 = await User.findOne({ id: user2.id });

    let idtoselect = car;
    let idtoselect2 = car2;

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }
    let filteredcar2 = userdata2.cars.filter((car) => car.ID == idtoselect2);
    let selected2 = filteredcar2[0] || "No ID";
    if (selected2 == "No ID") {
      let errembed = new discord.EmbedBuilder()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return await interaction.reply({ embeds: [errembed] });
    }

    let carindb1 = cars.Cars[selected.Name.toLowerCase()];
    let carindb2 = cars.Cars[selected2.Name.toLowerCase()];

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("approve")
        .setStyle("Success")
        .setEmoji("✔️"),
      new ButtonBuilder().setCustomId("deny").setStyle("Danger").setEmoji("✖️")
    );

    let carimage1 = carindb1.Image;
    let carimage2 = carindb2.Image;
    let u1speed = selected.Speed;
    let u2speed = selected2.Speed;

    let u1acc = selected.Acceleration;
    let u2acc = selected2.Acceleration;

    let u1handling = selected.Handling;
    let u2handling = selected2.Handling;

    let embed = new discord.EmbedBuilder()
      .setTitle(`${user2.username}, would you like to race ${user.username}?`)
      .addFields([
        {
          name: `${user.username}'s car`,
          value: `${carindb1.Emote} ${carindb1.Name}\n\nSpeed: ${u1speed} MPH\n0-60: ${u1acc}s\nHandling: ${u1handling}`,
        },
        {
          name: `${user2.username}'s car`,
          value: `${carindb2.Emote} ${carindb2.Name}\n\nSpeed: ${u2speed} MPH\n0-60: ${u2acc}s\nHandling: ${u2handling}`,
        },
      ])
      .setImage(carimage1)
      .setThumbnail(carimage2)
      .setColor(`#60b0f4`);

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return user2.id == btnInt.user.id;
    };
    const collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 30000,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes("approve")) {
        embed.setTitle("Racing!");
        i.update({ embeds: [embed], components: [] });

        let formula1 = u1speed / u1acc;
        let formula2 = u2speed / u2acc;

        let tracklength = 0;
        let tracklength2 = 0;

        setInterval(() => {
          tracklength += Number(formula1);
          tracklength2 += Number(formula2);
        }, 1000);
        setTimeout(async () => {
          if (tracklength > tracklength2) {
            embed.setTitle(`${user?.tag || user?.username} won!`);
            embed.setImage(carimage1);
            embed.setThumbnail();
          } else if (tracklength < tracklength2) {
            embed.setTitle(`${user2?.tag || user2?.username} won!`);
            embed.setImage(carimage2);
            embed.setThumbnail();
          }
          await i.editReply({ embeds: [embed] });
        }, 5000);
      } else {
        embed.addFields([{ name: "Result", value: "Declined" }]);
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);

        i.update({ embeds: [embed], components: [row] });
      }
    });
  },
};
