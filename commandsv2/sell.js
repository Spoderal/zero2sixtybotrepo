

const { SlashCommandBuilder } = require("@discordjs/builders");
const { toCurrency } = require("../common/utils");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
let parts = require("../data/partsdb.json");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const cardb = require("../data/cardb.json");
const itemdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell a car or part")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to sell")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to sell")
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id });

    let timeout = 10000;

    if (
      cooldowns.trading !== null &&
      timeout - (Date.now() - cooldowns.trading) > 0
    ) {
      return interaction.reply({
        content: `You need to wait to use this command because you're trading with someone! **IF SOMEONE IS ABUSING THIS, REPORT IT TO STAFF IMMEDIATELY**`,
      });
    }
    let userparts = userdata.parts;
    let selling = interaction.options.getString("item");
    let amount = interaction.options.getNumber("amount") || 1;
    let amount2 = Math.round(amount);

    let usercars = userdata.cars;
    if (!selling) return await interaction.reply("Specify a car or part!");

    let filteredcar = userdata.cars.filter(
      (car) =>
        car.ID.toLowerCase() == selling.toLowerCase() ||
        (car.Name.toLowerCase() == selling.toLowerCase() &&
          car.Favorite !== true)
    );

    let selected = filteredcar[0] || "No ID";


    if (selected !== "No ID") {
      let price = selected.Resale

      if(!selected.Resale || selected.Resale == 0){
        price = cardb.Cars[selected.Name.toLowerCase()].sellprice * 0.35
      }


      if(userdata.location == "united kingdom"){
        price = cardb.Cars[selected.Name.toLowerCase()].Price * 0.30;
      }

        

      if (amount2 > filteredcar.length)  return interaction.reply("You don't have that many of that car!");
      console.log(price)
      price = price * amount2;

      if (userdata.items.includes("coconut")) {
        price = price += price * 0.05;
      }
      for (var b = 0; b < usercars.length; b++)
        if (usercars[b].Name === selected.Name) {
          usercars.splice(b, amount2);
          break;
        }
      if (isNaN(price)) {
        price = 0;
      }
      userdata.cars = usercars;
      userdata.cash += Number(price);
      if(userdata.cars.length <= 0) return interaction.reply("You need to have at least 1 car!")


      await interaction.reply(
        `You sold ${amount2} ${selected.Name} for ${toCurrency(price)}!`
      );
    } else if (parts.Parts[selling.toLowerCase()]) {
      if (
        !userparts.includes(
          parts.Parts[selling.toLowerCase()].Name.toLowerCase()
        )
      )
        return await interaction.reply("You dont have that part!");
      
      let filtereduser = userparts.filter(function hasmany(part) {
        return part === selling.toLowerCase();
      });
      if (amount2 > filtereduser.length)
        return await interaction.reply(
          "You don't have that many of that part!"
        );
      let finalamount = 0;

        let resale = parts.Parts[selling.toLowerCase()].Price * 0.35;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      
      if (parts.Parts[selling.toLowerCase()].Tier == "4" && parts.Parts[selling.toLowerCase()].Price == 0) {
        let resale = 1000;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      } else if (parts.Parts[selling.toLowerCase()].Tier == "5" && parts.Parts[selling.toLowerCase()].Price == 0) {
        let resale = 2500;
        finalamount = amount2 * resale;
        userdata.cash += finalamount;
      }
      for (var i2 = 0; i2 < amount2; i2++)
        userparts.splice(userparts.indexOf(selling.toLowerCase()), 1);
      userdata.parts = userparts;
      await interaction.reply(
        `You sold your ${selling} for ${toCurrency(finalamount)}!`
      );
    }  else if (itemdb[selling.toLowerCase()]) {
      if(!userdata.items.includes(selling.toLowerCase())) return interaction.reply('You dont have that item!')
      let useritems = userdata.items;
      let finalprice = itemdb[selling.toLowerCase()].Price * 0.35;
      useritems.splice(useritems.indexOf(selling.toLowerCase()), 1);
      userdata.items = useritems;
      userdata.cash += finalprice


      await interaction.reply(`You sold your ${selling} for ${toCurrency(finalprice)}!`);
    } 

    await userdata.save();
  },
};
