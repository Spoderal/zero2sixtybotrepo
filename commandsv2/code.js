

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
    } 
    else  if (codes.Eggs[code]) {
      let eggs = userdata.eggs;
      if (eggs.includes(codes.Eggs[code].Egg))  return await interaction.reply("You've already collected this egg!");
      let eggmobile = cardb.Cars[codes.Eggs[code].Reward]
      let carobj = {
        ID: eggmobile.alias,
        Name: eggmobile.Name,
        Speed: eggmobile.Speed,
        Acceleration: eggmobile["0-60"],
        Handling: eggmobile.Handling,
        WeightStat: eggmobile.Weight,
        Emote: eggmobile.Emote,
        Livery: eggmobile.Image,
        Miles: 0,
        Resale:0,
        Gas: 10,
        MaxGas: 10,
      };
      eggs.push(codes.Eggs[code].Egg);
      userdata.cars.push(carobj)

      if(eggs.length >= 11) {
        let goldenegg = cardb.Cars["2024 gold egg mobile"]
      let carobj = {
        ID: goldenegg.alias,
        Name: goldenegg.Name,
        Speed: goldenegg.Speed,
        Acceleration: goldenegg["0-60"],
        Handling: goldenegg.Handling,
        WeightStat: goldenegg.Weight,
        Emote: goldenegg.Emote,
        Livery: goldenegg.Image,
        Miles: 0,
        Resale:0,
        Gas: 10,
        MaxGas: 10,
      };
      userdata.push(carobj)
        await interaction.channel.send(`Found <:egg_gold:1219112554236739674> The Golden Egg and earned ${goldenegg.Emote} ${goldenegg.Name}! You've collected all 11 eggs and earned the "Egg Hunter" achievement!`);

      }
      await interaction.reply(`Found ${codes.Eggs[code].Emote} ${codes.Eggs[code].Egg} and earned ${eggmobile.Emote} ${eggmobile.Name}!`);
      userdata.save();
    }
    else if (codes.Discord[code]) {
      if (codesredeemed.includes(code)) return await interaction.reply("You've already redeemed this code!");
      

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
