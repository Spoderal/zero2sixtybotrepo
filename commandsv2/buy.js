

const { SlashCommandBuilder } = require("@discordjs/builders");
const itemdb = require("../data/items.json");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
let warehousedb = require("../data/warehouses.json");
let cardb = require("../data/cardb.json").Cars
let houses = require("../data/houses.json");
const { EmbedBuilder } = require("discord.js");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const { toCurrency, numberWithCommas } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const partdb = require("../data/partsdb.json")
const carpacks = require("../data/carpacks.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy a car or item")

    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The car or item to buy")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to buy")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    ),


  async execute(interaction) {

    const userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    const global = await Global.findOne({});

    let amount = interaction.options.getNumber("amount") || 1

    let cash = userdata.cash;
    const usercars = userdata.cars;
    const garagelimit = userdata.garageLimit;
    let tier = userdata.tier;
    let bought = interaction.options.getString("item").toLowerCase();
   


    let cars = []
    let hous = []
    for(let car in cardb){

      cars.push(cardb[car])
    }
    for(let house in houses){
      hous.push(houses[house])
    }

      // Use the findCar function
      let car = cars.find(c => c.alias=== bought || c.Name.toLowerCase() === bought)
      let item = itemdb[bought.toLowerCase()]
      let part = partdb.Parts[bought.toLowerCase()]
      let house = hous.find(h => h.id.toLowerCase() === bought)
      let warehouse = warehousedb[bought.toLowerCase()]
      let carpack = carpacks[bought.toLowerCase()]


  

      if(item && bought !== "pvp crate"){
        let itemprice = item.Price * amount
        if(itemprice > cash){
          return await interaction.reply({ content: `You don't have enough cash`, ephemeral: true })
        }
        if(item.Price == 0 ) return interaction.reply("This item isn't purchasable!")
        let iteminshop = global.itemshop.find(i => i.Name === item.Name)
        if(iteminshop){
          userdata.cash -= itemprice
          for (let i = 0; i < amount; i++) {
            userdata.items.push(item.Name.toLowerCase());
          }
        

        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${item.Name}`)
        .setDescription(`You bought x${amount} ${item.Emote} ${item.Name} for ${emotes.cash} ${toCurrency(itemprice)}`)
        .setColor(colors.blue)
        .setThumbnail(item.Image)
        .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})


        await interaction.reply({ embeds: [embed] })

        }
        else {
          return await interaction.reply({ content: `That item isn't in the weekly item shop`, ephemeral: true })
        }

      }
      else if(part){
        
        if(part.Price == 0) return interaction.reply("This part isn't purchasable!")
        let itemprice = part.Price * amount
        if(itemprice > cash){
          return await interaction.reply({ content: `You don't have enough cash`, ephemeral: true })
        }
        if(part.Price > cash){
          return await interaction.reply({ content: `You don't have enough cash to buy this part`, ephemeral: true })
        }
        userdata.cash -= itemprice
        for (let i = 0; i < amount; i++) {
          userdata.parts.push(part.Name.toLowerCase());
        }

        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${part.Name}`)
        .setDescription(`You bought x${amount} ${part.Emote} ${part.Name} for ${emotes.cash} ${toCurrency(itemprice)}`)
        .setColor(colors.blue)
        .setThumbnail(part.Image)
        .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})

        await interaction.reply({ embeds: [embed] })


        if(userdata.tutorial && userdata.tutorial.started == true && userdata.tutorial.stage == 5 && userdata.tutorial.type == "starter"){
          console.log("TUTORIAL")
          let tut = userdata.tutorial
          tut.stage += 1
          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "tutorial": tut,
              },
            },
      
          );
      
          interaction.channel.send(`**TUTORIAL:** Nice purchase! Now where did it go you may ask? Well, run \`/garage\` again and select the parts button to see your newly aquired part`)
        }

      }
      else if(carpack){
        if(carpack.Gold > userdata.gold){
          return await interaction.reply({ content: `You don't have enough gold to buy this car pack!`, ephemeral: true })
        }
        userdata.gold -= carpack.Gold
        for(let car in carpack.cars){
          let carobj = {
            ID: cardb[carpack.cars[car]].alias,
            Name: cardb[carpack.cars[car]].Name,
            Speed: cardb[carpack.cars[car]].Speed,
            Acceleration: cardb[carpack.cars[car]]["0-60"],
            Handling: cardb[carpack.cars[car]].Handling,
            WeightStat: cardb[carpack.cars[car]].Weight,
            Emote: cardb[carpack.cars[car]].Emote,
            Livery: cardb[carpack.cars[car]].Image,
            Miles: 0,
            Gas: 10,
            MaxGas: 10,
          };
          userdata.cars.push(carobj)
        }
        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${carpack.Name}`)
        .setDescription(`You bought ${carpack.Name} for ${emotes.gold} ${toCurrency(carpack.Price)}`)
        .setColor(colors.blue)
        .setFooter({text: `You now have ${toCurrency(userdata.gold)}`})

        await interaction.reply({ embeds: [embed] })

      }

      else if(house){
        if(house.Price > cash){
          return await interaction.reply({ content: `You don't have enough cash to buy this house`, ephemeral: true })
        }
        if(userdata.houses.find(h => h.id === house.id)){
          return await interaction.reply({ content: `You already own this house`, ephemeral: true })
        }
        if(house.Price == 0 ) return interaction.reply("This house isn't purchasable!")
        userdata.cash -= house.Price
          userdata.houses.push(house)
     userdata.garageLimit += house.Space
        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${house.Name}`)
        .setDescription(`You bought a ${house.Emote} ${house.Name} for ${emotes.cash} ${toCurrency(house.Price)}`)
        .setColor(colors.blue)
        .setThumbnail(house.Image)
        .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})

        await interaction.reply({ embeds: [embed] })

      }
      else if(warehouse){
        if(warehouse.Price > cash){
          return await interaction.reply({ content: `You don't have enough cash to buy this warehouse`, ephemeral: true })
        }
        if(userdata.warehouses.find(w => w === warehouse.Name.toLowerCase())){
          return await interaction.reply({ content: `You already own this warehouse`, ephemeral: true })
        }
        userdata.cash -= warehouse.Price
        userdata.warehouses.push(warehouse.Name.toLowerCase())
        userdata.garageLimit += warehouse.Space
        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${warehouse.Name}`)
        .setDescription(`You bought a ${warehouse.Emote} ${warehouse.Name} for ${emotes.cash} ${toCurrency(warehouse.Price)}`)
        .setColor(colors.blue)
        .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})

        await interaction.reply({ embeds: [embed] })

      }
      else if(car){
        if(car.Price == 0 && !car.Heart && !car.Carver && !car.Tokens && !car.Exclusive) return interaction.reply("This car isn't purchasable!")

        if(car.tier > tier){
          return await interaction.reply({ content: `You need to be tier ${car.tier} to buy this car, try beating the tier ${car.tier} squad`, ephemeral: true })
        }
        if(usercars.length >= garagelimit){
          return await interaction.reply({ content: `Your garage is full, you need to upgrade your garage to store more cars`, ephemeral: true })
        }
        let currency = `${emotes.cash} ${toCurrency(car.Price)}`
      
        if(car.Exclusive){
          if(userdata.zkeys < car.Exclusive){
            return await interaction.reply({ content: `You need ${car.Exclusive} carver cash to buy this car`, ephemeral: true })
          }
          userdata.zkeys -= car.Exclusive
          let carobj = {
            ID: car.alias,
            Name: car.Name,
            Speed: car.Speed,
            Acceleration: car["0-60"],
            Handling: car.Handling,
            WeightStat: car.Weight,
            Emote: car.Emote,
            Livery: car.Image,
            Miles: 0,
            Resale:0,
            Gas: 10,
            MaxGas: 10,
          };

          userdata.cars.push(carobj)
          userdata.save()
          currency = `<:key_z:1140029565360668783> ${numberWithCommas(car.Exclusive)}`
          let embed = new EmbedBuilder()
          .setTitle(`You bought a ${car.Name}`)
          .setDescription(`You bought a ${car.Emote} ${car.Name} for ${currency}`)
          .setColor(colors.blue)
          .setImage(car.Image)
          .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})
  
         return await interaction.reply({ embeds: [embed] })
        }
        if(car.Tokens){
          if(userdata.pvptokens < car.Tokens){
            return await interaction.reply({ content: `You need ${car.Tokens} PVP Tokens to buy this car`, ephemeral: true })
          }
          userdata.pvptokens -= car.Tokens
          let carobj = {
            ID: car.alias,
            Name: car.Name,
            Speed: car.Speed,
            Acceleration: car["0-60"],
            Handling: car.Handling,
            WeightStat: car.Weight,
            Emote: car.Emote,
            Livery: car.Image,
            Miles: 0,
            Resale:0,
            Gas: 10,
            MaxGas: 10,
          };
          currency = `${emotes.pvptokens} ${numberWithCommas(car.Exclusive)}`
          userdata.cars.push(carobj)
          userdata.save()
          let embed = new EmbedBuilder()
          .setTitle(`You bought a ${car.Name}`)
          .setDescription(`You bought a ${car.Emote} ${car.Name} for ${currency}`)
          .setColor(colors.blue)
          .setImage(car.Image)
          .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})
  
         return await interaction.reply({ embeds: [embed] })
        }
        
        else {

          if(car.Price > cash){
            return await interaction.reply({ content: `You don't have enough cash to buy this car`, ephemeral: true })
          }
          if(usercars.find(c => c.alias === car.alias)){
            return await interaction.reply({ content: `You already own this car`, ephemeral: true })
          }
          userdata.cash -= car.Price
          let resale = car.Price * 0.75
          let carobj = {
            ID: car.alias,
            Name: car.Name,
            Speed: car.Speed,
            Acceleration: car["0-60"],
            Handling: car.Handling,
            WeightStat: car.Weight,
            Emote: car.Emote,
            Livery: car.Image,
            Miles: 0,
            Resale:resale,
            Gas: 10,
            MaxGas: 10,
          };
          if(car.Electric){
            carobj.Range = Number(car.Range)
            carobj.MaxRange = Number(car.Range)
  
          }
          else {
            carobj.Gas = 10
            carobj.MaxGas = 10
  
          }
  
          userdata.cars.push(carobj)
        }

        await userdata.save()

        let embed = new EmbedBuilder()
        .setTitle(`You bought a ${car.Name}`)
        .setDescription(`You bought a ${car.Emote} ${car.Name} for ${currency}`)
        .setColor(colors.blue)
        .setImage(car.Image)
        .setFooter({text: `You now have ${toCurrency(userdata.cash)}`})

        await interaction.reply({ embeds: [embed] })
      }
      else if(bought == "pvp crate"){
        if(userdata.pvptokens < 100){
          return await interaction.reply({ content: `You need 100 PVP Tokens to buy a PVP Crate`, ephemeral: true })
        }

        userdata.pvptokens -= 100

        userdata.items.push("pvp crate")
        await userdata.save()

        await interaction.reply({ content: `You bought a PVP Crate for 100 PVP Tokens`, ephemeral: true })

      }
      else {
        return await interaction.reply({ content: `I couldn't find that car or item`, ephemeral: true })
      }



  },
};
