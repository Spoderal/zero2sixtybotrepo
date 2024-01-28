

const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const Global = require("../schema/global-schema");
const { toCurrency } = require("../common/utils");
const { isNaN } = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gas")
    .setDescription("Fill up your car")
    .addStringOption((option) =>
      option
        .setDescription("The car to install the part on")
        .setName("car")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("gallons")
        .setDescription(`The gallons to add to your car`)
        .setChoices(
          { name: `1`, value: `1` },
          { name: `5`, value: `5` },
          { name: `Full`, value: `full` }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    let global = await Global.findOne({});
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let gallons = interaction.options.getString(`gallons`)

    let caroption = interaction.options.getString(`car`)

    let usercars = userdata.cars;

    let selected = usercars.filter((car) => car.ID == caroption.toLowerCase());

    if (!selected[0])
      return interaction.reply(
        `You don't have this car! Make sure to put the cars **ID**, not full name.`
      );


    if (selected[0].Electric) {
      let charge = 10000;

      let cardbprice =
        cars.Cars[selected[0].Name.toLowerCase()].Price || 100000;
      let finalprice = cardbprice / charge;

      if (finalprice > userdata.cash)
        return interaction.reply(
          `You need ${toCurrency(finalprice)} to charge your car`
        );

      if (selected[0].Range == selected[0].MaxRange)
        return interaction.reply(`Your cars gas tank is full!`);

      selected[0].Range = selected[0].MaxRange;

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

      userdata.cash -= finalprice;
      userdata.save();

      interaction.reply(
        `Charged up your ${selected[0].Name} for ${toCurrency(finalprice)}`
      );
      return;
    } else  {
      let gas = global.gas;
      let usergas = selected[0].Gas || 10
      let maxgas = selected[0].MaxGas || 10
      if(gallons == "full"){
        gallons = maxgas
      }
      else {
        gallons = Number(gallons)
      }
      if(isNaN(usergas)){
        usergas = 10
      }
      console.log(usergas)
      console.log(gallons)
      let finalprice = gas * gallons;

      finalprice = Math.round(finalprice);

      if (finalprice > userdata.cash)
        return interaction.reply(
          `You need ${toCurrency(finalprice)} to fill ${gallons} gallons`
        );

        if(usergas == null || !usergas || isNaN(usergas)){
          console.log("true")
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car].Gas": (usergas + gallons)
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

          await userdata.save()

          return interaction.reply("Your cars gas tank blew up but now its fixed")

        }

      if (selected[0].Gas == maxgas)
        return interaction.reply(`Your cars gas tank is full!`);

      if (gallons == "full") {
        selected[0].Gas = maxgas;
      } else {
        selected[0].Gas += gallons;
        if (selected[0].Gas > selected[0].MaxGas) {
          selected[0].Gas = selected[0].MaxGas;
        }
      }

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
      userdata.cash -= finalprice;
      userdata.save();

      interaction.reply(
        `Filled up your ${selected[0].Name} for ${toCurrency(finalprice)}`
      );
    }
  },
};
