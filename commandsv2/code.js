"use strict";

const codes = require("../data/codes.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { toCurrency } = require("../common/utils");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Redeem a code")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to redeem")
        .setRequired(true)
    ),
  async execute(interaction) {
    let code = interaction.options.getString("code");
    let uid = interaction.user.id;
    if (!code)
      return await interaction.reply({
        content:
          "Specify a code to redeem! You can find codes in the Discord server, or on the Twitter page!",
        ephemeral: true,
      });
    let userdata = (await User.findOne({ id: uid })) || new User({ id: uid });

    let codesredeemed = userdata.codes;

    if (codes.Twitter[code]) {
      if (codesredeemed.includes(code))
        return await interaction.reply("You've already redeemed this code!");

      await interaction.reply(
        `Redeemed code ${code} and earned ${toCurrency(
          codes.Twitter[code].Reward
        )}`
      );
      userdata.cash += Number(codes.Twitter[code].Reward);

      codesredeemed.push(code);
      userdata.save();
    } else if (codes.Discord[code]) {
      if (codesredeemed.includes(code))
        return await interaction.reply("You've already redeemed this code!");
      if (cardb.Cars[codes.Discord[code].Reward.toLowerCase()]) {
        let car = codes.Discord[code].Reward.toLowerCase();
        let filteredegg = userdata.cars.filter((car) => car.Name == car);

        let carindb = cardb.Cars[car];
        if (!filteredegg[0]) {
          let eggobj = {
            ID: carindb.alias,
            Name: carindb.Name,
            Speed: carindb.Speed,
            Acceleration: carindb["0-60"],
            Handling: carindb.Handling,
            Parts: [],
            Emote: carindb.Emote,
            Livery: carindb.Image,
            Miles: 0,
            Resale: 0,
            Weight: carindb.Weight,
          };
          userdata.cars.push(eggobj);
          codesredeemed.push(code);
          userdata.save();
        }

        interaction.reply(`Found egg car "${carindb.Name}"!`);
        return;
      }

      await interaction.reply(
        `Redeemed code ${code} and earned ${toCurrency(
          codes.Discord[code].Reward
        )}`
      );
      userdata.cash += Number(codes.Discord[code].Reward);

      codesredeemed.push(code);
      userdata.save();
    } else if (codes.Patreon[code]) {
      let patreontier = userdata.patron.tier;

      if (!patreontier)
        return await interaction.reply(
          "You need to purchase a patreon tier to redeem this code!"
        );

      if (codesredeemed.includes(code))
        return await interaction.reply("You've already redeemed this code!");

      if (codes.Patreon[code].Gold) {
        await interaction.reply(
          `Redeemed code ${code} and earned ${toCurrency(
            codes.Patreon[code].Reward
          )} gold`
        );
        userdata.gold += Number(codes.Patreon[code].Reward);
      } else {
        await interaction.reply(
          `Redeemed code ${code} and earned ${toCurrency(
            codes.Patreon[code].Reward
          )}`
        );
        userdata.cash += Number(codes.Patreon[code].Reward);
      }

      codesredeemed.push(code);
      userdata.save();
    } else {
      await interaction.reply({
        content: "Thats not a valid code!",
        ephemeral: true,
      });
    }
  },
};
