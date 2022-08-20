const discord = require("discord.js");
const seasons = require("../data/seasons.json");
const cardb = require("../data/cardb.json");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reward")
    .setDescription("Redeem a summer reward")
    .addStringOption((option) =>
      option
        .setName("type")
        .setRequired(true)
        .setDescription(
          "Decide if you want to claim a reward from a crew or season"
        )
        .addChoices(
          { name: "Season", value: "season" },
          { name: "Crew", value: "crew" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reward")
        .setDescription("The # of the reward you'd like to redeem")
        .setRequired(true)
    ),
  async execute(interaction) {
    let type = interaction.options.getString("type");
    let uid = interaction.user.id;

    let userdata = await User.findOne({ id: uid });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let global = await Global.findOne({});
    if (type == "season") {
      let rew = interaction.options.getString("reward");
      uid = interaction.user.id;

      let newredeemed = userdata.seasonrewards;

      let noto = userdata.noto;
      if (!rew)
        return await interaction.reply({
          content: "Specify which reward you'd like to redeem. (1, 2, 3, etc)",
          ephemeral: true,
        });
      if (newredeemed.includes(rew))
        return await interaction.reply({
          content: "You've already claimed this reward!",
          ephemeral: true,
        });
      if (rew > 50 || isNaN(rew))
        return await interaction.reply({
          content: "Thats not a reward!",
          ephemeral: true,
        });
      if (!newredeemed.includes(`${rew - 1}`) && rew != "1")
        return await interaction.reply({
          content:
            "You need to claim the reward before this before you can claim it!",
          ephemeral: true,
        });
      let item = seasons.Seasons.Summer.Rewards[rew];
      if (noto < item.Required)
        return await interaction.reply({
          content: `You need ${item.Required} notoriety for this reward!`,
          ephemeral: true,
        });
      if (item.Item.endsWith("Cash")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed $${amount}`);
        userdata.cash += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("RP")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} RP`);
        userdata.rp += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (
        item.Item.endsWith("Barn Maps") ||
        item.Item.endsWith("Barn Map")
      ) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Barn Maps`);
        userdata.cmaps += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Common Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Common Keys`);
        userdata.ckeys += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Drift Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Drift Keys`);
        userdata.dkeys += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (
        item.Item.endsWith("Garage Space") ||
        item.Item.endsWith("Garage Spaces")
      ) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Garage Spaces`);

        userdata.garageLimit += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Rare Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Rare Keys`);
        userdata.rkeys += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Exotic Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Exotic Keys`);
        userdata.ekeys += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Helmet")) {
        await interaction.reply(`Redeemed ${item.Item}`);
        userdata.pfps.push(item.Item);

        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Part")) {
        let part = item.Item.split(" ")[0];

        await interaction.reply(`Redeemed ${part}`);
        userdata.parts.push(part.toLowerCase());
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Badge")) {
        let badge = item.Item;
        userdata.badges.push(badge);
        await interaction.reply(`Redeemed ${badge}`);
        userdata.seasonrewards.push(item.Number);
      } else {
        let carindb = cardb.Cars[item.Item.toLowerCase()];
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

        userdata.cars.push(carobj);
        userdata.seasonrewards.push(item.Number);
        await interaction.reply(`Redeemed ${carobj.Name}`);
      }

      userdata.noto -= item.Required;
      userdata.save();
    } else if (type == "crew") {
      let rew = interaction.options.getString("reward");
      let ucrew = userdata.crew;

      let crews = global.crews;

      let crew2 = crews.filter((crew) => crew.name == ucrew.name);
      if (!crew2[0]) return await interaction.reply("That crew doesn't exist!");

      let timeout = 259200000;
      let joined = userdata.joinedcrew;

      if (joined !== null && timeout - (Date.now() - joined) > 0) {
        let time = ms(timeout - (Date.now() - joined));
        let timeEmbed = new discord.EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(
            `You need to be in this crew for ${time} before claiming rewards.`
          );
        return await interaction.reply({ embeds: [timeEmbed] });
      }
      let redeemed = userdata.crewclaimed;

      let rewardss = require("../data/seasons.json").Seasons.Crew1.Rewards;
      let newredeemed = redeemed;

      let crewinf = crew2[0];
      let crewrank = crewinf.Rank;
      if (!rew)
        return await interaction.reply({
          content: "Specify which reward you'd like to redeem. (1, 2, 3, etc)",
          ephemeral: true,
        });
      if (newredeemed.includes(rew))
        return await interaction.reply({
          content: "You've already claimed this reward!",
          ephemeral: true,
        });
      if (!rewardss[rew] || isNaN(rew))
        return await interaction.reply({
          content: "Thats not a reward!",
          ephemeral: true,
        });
      if (!newredeemed.includes(`${rew - 1}`) && rew != "1" && rew != "100")
        return await interaction.reply({
          content:
            "You need to claim the reward before this before you can claim it!",
          ephemeral: true,
        });
      let item = seasons.Seasons.Crew1.Rewards[rew];
      if (crewrank < item.Number)
        return await interaction.reply({
          content: `You need crew rank ${item.Number} for this reward!`,
          ephemeral: true,
        });
      if (item.Item.endsWith("Cash")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed $${amount}`);
        userdata.cash += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Notoriety")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Notoriety`);
        userdata.noto += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Legendary Barn Maps") ||
        item.Item.endsWith("Legendary Barn Map")
      ) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Barn Maps`);
        userdata.lmaps += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Bank Increase")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Bank Increase`);
        userdata.items.push("bank increase");
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Super wheelspin") ||
        item.Item.endsWith("Super wheelspins")
      ) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Super wheelspins`);
        userdata.swheelspins += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Common Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Common Keys`);
        userdata.ckeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Drift Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Drift Keys`);
        userdata.dkeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Garage Space") ||
        item.Item.endsWith("Garage Spaces")
      ) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Garage Spaces`);
        userdata.garagelimit += Number(amount);

        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Rare Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Rare Keys`);
        userdata.rkeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Exotic Keys")) {
        let amount = item.Item.split(" ")[0];
        await interaction.reply(`Redeemed ${amount} Exotic Keys`);
        userdata.ekeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Part")) {
        let part = item.Item.split(" ")[0];

        await interaction.reply(`Redeemed ${part}`);
        userdata.parts.push(part.toLowerCase());
        userdata.crewclaimed.push(item.Number);
      } else {
        let cartogive = cardb.Cars[item.Item.toLowerCase()];
        let carindb = cartogive;
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
        userdata.cars.push(carobj);

        userdata.crewclaimed.push(item.Number);

        await interaction.reply(`Redeemed ${cartogive.Name}`);
      }
      userdata.save();
    }
  },
};
