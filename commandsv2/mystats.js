const {
    ActionRowBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const colors = require("../common/colors");
  const { emotes } = require("../common/emotes");
  const squads = require("../data/squads.json");
  const { toCurrency } = require("../common/utils");
  const User = require("../schema/profile-schema")
  const { GET_STARTED_MESSAGE } = require("../common/constants");
  const ms = require("pretty-ms");
  const cardb = require("../data/cardb.json")

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("mystats")
      .setDescription("See your in game stats including your race time, best cars, and more!"),
    async execute(interaction) {
      let userdata = await User.findOne({ id: interaction.user.id });
      if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

      let cars = userdata.cars;
      let racetime = userdata.racetime

      let cararray = []

      for(let i in cardb.Cars){
        cararray.push(cardb.Cars[i])
      }
      

      let bestcarspeed = cars.sort((a, b) => b.Speed - a.Speed)[0];
      let bestcarhandling = cars.sort((a, b) => b.Handling - a.Handling)[0];

      let racetimems = ms(racetime)
      let cardata = cararray.find(x => x.Name === bestcarspeed.Name)
      let cardata2 = cararray.find(x => x.Name === bestcarhandling.Name)

      let embed = new EmbedBuilder()
        .setTitle(`📊 Your Stats`)
        .setColor(colors.blue)
        .addFields({name: "Race Time", value: `${racetimems}`})
        .addFields({name: "Top Car Speed", value: `${cardata.Emote} ${cardata.Name} with ${bestcarspeed.Speed} speed`})
        .addFields({name: "Top Car Handling", value: `${cardata2.Emote} ${cardata2.Name} with ${bestcarhandling.Handling} handling`})
        .addFields({name: "Total Cars", value: `${cars.length}`})
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
    },
  };
  