const discord = require("discord.js");
const seasons = require("../data/seasons.json");
const cardb = require("../data/cardb.json");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");

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
        .addChoice("Season", "season")
        .addChoice("Crew", "crew")
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
    let global = await Global.findOne({});
    if (type == "season") {
      let rew = interaction.options.getString("reward");
      uid = interaction.user.id;

      let newredeemed = userdata.seasonrewards;

      let noto = userdata.noto;
      if (!rew)
        return interaction.reply({
          content: "Specify which reward you'd like to redeem. (1, 2, 3, etc)",
          ephemeral: true,
        });
      if (newredeemed.includes(rew))
        return interaction.reply({
          content: "You've already claimed this reward!",
          ephemeral: true,
        });
      if (rew > 50 || isNaN(rew))
        return interaction.reply({
          content: "Thats not a reward!",
          ephemeral: true,
        });
      if (!newredeemed.includes(`${rew - 1}`) && rew != "1")
        return interaction.reply({
          content:
            "You need to claim the reward before this before you can claim it!",
          ephemeral: true,
        });
      let item = seasons.Seasons.Summer.Rewards[rew];
      if (noto < item.Required)
        return interaction.reply({
          content: `You need ${item.Required} notoriety for this reward!`,
          ephemeral: true,
        });
      if (item.Item.endsWith("Cash")) {
        console.log("Cash");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed $${amount}`);
        userdata.cash += Number(amount);
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("RP")) {
        console.log("RP");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} RP`);
        userdata.rp += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (
        item.Item.endsWith("Barn Maps") ||
        item.Item.endsWith("Barn Map")
      ) {
        console.log("Barn Maps");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Barn Maps`);
        userdata.cmaps += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Common Keys")) {
        console.log("Common Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Common Keys`);
        userdata.ckeys += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Drift Keys")) {
        console.log("Drift Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Drift Keys`);
        userdata.dkeys += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (
        item.Item.endsWith("Garage Space") ||
        item.Item.endsWith("Garage Spaces")
      ) {
        console.log("Garage Space");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Garage Spaces`);

        userdata.garage += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Rare Keys")) {
        console.log("Rare Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Rare Keys`);
        userdata.rkeys += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Exotic Keys")) {
        console.log("Exotic Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Exotic Keys`);
        userdata.ekeys += amount;
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Helmet")) {
        console.log("Helmet");
        console.log(item.Number);

        interaction.reply(`Redeemed ${item.Item}`);
        userdata.pfps.push(item.Item);

        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Part")) {
        console.log("Part");
        console.log(item.Number);
        let part = item.Item.split(" ")[0];

        interaction.reply(`Redeemed ${part}`);
        userdata.parts.push(part.toLowerCase());
        userdata.seasonrewards.push(item.Number);
      } else if (item.Item.endsWith("Badge")) {
        let badge = item.Item;
        userdata.badges.push(badge);
        interaction.reply(`Redeemed ${badge}`);
        userdata.seasonrewards.push(item.Number);
      } else {
        console.log("Car");
        console.log(item.Item);
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
        interaction.reply(`Redeemed ${carobj.Name}`);
      }

      userdata.noto -= item.Required;
      userdata.save();
    } else if (type == "crew") {
      let rew = interaction.options.getString("reward");
      let ucrew = userdata.crew;

      let crews = global.crews;

      let crew2 = crews.filter((crew) => crew.name == ucrew.name);
      if (!crew2[0]) return interaction.reply("That crew doesn't exist!");

      let timeout = 259200000;
      let joined = userdata.joinedcrew;

      if (joined !== null && timeout - (Date.now() - joined) > 0) {
        let time = ms(timeout - (Date.now() - joined));
        let timeEmbed = new discord.MessageEmbed()
          .setColor("#60b0f4")
          .setDescription(
            `You need to be in this crew for ${time} before claiming rewards.`
          );
        return interaction.reply({ embeds: [timeEmbed] });
      }
      let redeemed = userdata.crewclaimed;

      let rewardss = require("../data/seasons.json").Seasons.Crew1.Rewards;
      let newredeemed = redeemed;

      let crewinf = crew2[0];
      let crewrank = crewinf.Rank;
      if (!rew)
        return interaction.reply({
          content: "Specify which reward you'd like to redeem. (1, 2, 3, etc)",
          ephemeral: true,
        });
      if (newredeemed.includes(rew))
        return interaction.reply({
          content: "You've already claimed this reward!",
          ephemeral: true,
        });
      if (!rewardss[rew] || isNaN(rew))
        return interaction.reply({
          content: "Thats not a reward!",
          ephemeral: true,
        });
      if (!newredeemed.includes(`${rew - 1}`) && rew != "1" && rew != "100")
        return interaction.reply({
          content:
            "You need to claim the reward before this before you can claim it!",
          ephemeral: true,
        });
      let item = seasons.Seasons.Crew1.Rewards[rew];
      if (crewrank < item.Number)
        return interaction.reply({
          content: `You need crew rank ${item.Number} for this reward!`,
          ephemeral: true,
        });
      if (item.Item.endsWith("Cash")) {
        console.log("Cash");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed $${amount}`);
        userdata.cash += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Notoriety")) {
        console.log("Notoriety");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Notoriety`);
        userdata.noto += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Legendary Barn Maps") ||
        item.Item.endsWith("Legendary Barn Map")
      ) {
        console.log("Barn Maps");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Barn Maps`);
        userdata.lmaps += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Bank Increase")) {
        console.log("Bank Increase");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Bank Increase`);
        userdata.items.push("bank increase");
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Super wheelspin") ||
        item.Item.endsWith("Super wheelspins")
      ) {
        console.log("Super wheelspin");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Super wheelspins`);
        userdata.swheelspins += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Common Keys")) {
        console.log("Common Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Common Keys`);
        userdata.ckeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Drift Keys")) {
        console.log("Drift Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Drift Keys`);
        userdata.dkeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (
        item.Item.endsWith("Garage Space") ||
        item.Item.endsWith("Garage Spaces")
      ) {
        console.log("Garage Space");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Garage Spaces`);
        userdata.garagelimit += Number(amount);

        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Rare Keys")) {
        console.log("Rare Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Rare Keys`);
        userdata.rkeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Exotic Keys")) {
        console.log("Exotic Keys");
        let amount = item.Item.split(" ")[0];
        console.log(item.Number);
        console.log(amount);
        interaction.reply(`Redeemed ${amount} Exotic Keys`);
        userdata.ekeys += Number(amount);
        userdata.crewclaimed.push(item.Number);
      } else if (item.Item.endsWith("Part")) {
        console.log("Part");
        console.log(item.Number);
        let part = item.Item.split(" ")[0];

        interaction.reply(`Redeemed ${part}`);
        userdata.parts.push(part.toLowerCase());
        userdata.crewclaimed.push(item.Number);
      } else {
        console.log("Car");
        console.log(item.Item);
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

        interaction.reply(`Redeemed ${cartogive.Name}`);
      }
      userdata.save();
    }
  },
};
