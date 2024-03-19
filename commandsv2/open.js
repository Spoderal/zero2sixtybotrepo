

const lodash = require("lodash");
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const titledb = require("../data/titles.json");
const partdb = require("../data/partsdb.json");
const itemdb = require("../data/items.json")
const ms = require("ms");
const Cooldowns = require("../schema/cooldowns");
const { emotes } = require("../common/emotes");
const outfits = require("../data/characters.json");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a crate for helmets, cash, and more!")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to open")
        .addChoices(
          { name: "Common Crate", value: "common crate" },
          { name: "Rare Crate", value: "rare crate" },
          { name: "Vote Crate", value: "vote crate" },
          { name: "PVP Crate", value: "pvp crate" },
          {name: "Item Crate", value: "item crate"},
          {name: "Legendary Crate", value: "legendary crate"}
        )
        .setRequired(true)
    )
    .addStringOption((option) =>option
    .setName("amount")
    .setDescription("The amount of crates you want to open")
    .setRequired(false)
    ),
  async execute(interaction) {
    let crates = require("../data/cratedb.json");

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let cooldowndata =
      (await Cooldowns.findOne({ id: interaction.user.id })) ||
      new Cooldowns({ id: interaction.user.id });
    let bought = interaction.options.getString("crate");
    let amount = interaction.options.getString("amount") || 1;
    let inv = userdata.items;
    let cooldown = 10000;
    let cratecool = cooldowndata.crate;
    if (cratecool !== null && cooldown - (Date.now() - cratecool) > 0) {
      let time = ms(cooldown - (Date.now() - cratecool));
      let timeEmbed = new EmbedBuilder()
        .setColor(colors.blue)
        .setDescription(`Please wait ${time} before opening another crate.`);
      await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      return;
    }
    let boughtindb = crates.Crates[bought.toLowerCase()];
    if (!boughtindb) return interaction.reply("That crate doesn't exist!");
    
        if (!inv.includes(bought))
          return interaction.reply(
            `You don't have a ${boughtindb.Emote} ${boughtindb.Name}!`
          );

    let filtereduser = inv.filter(function hasmany(item) {
      return item === bought.toLowerCase();
    });

    if (filtereduser.length < amount) return interaction.reply("You don't have enough crates!");
    
    
      cooldowndata.crate = Date.now();
     await cooldowndata.save();
     
    let embed = new EmbedBuilder()
      .setTitle(`Unboxing x${amount} ${boughtindb.Emote} ${boughtindb.Name}...`)
      .setColor(`#60b0f4`);
      let cash = 0;

   await interaction.reply({ embeds: [embed], fetchReply: true});
  let rewards = []
  let rewards2 = []
  let displayrewards = []
  let displayrew = []
  for (let i = 0; i < amount; i++) {
    // Open the crate and get the rewards

 rewards = openCrate(boughtindb)
    // Check if the rewards contain cash
    console.log(rewards)


    // Update the user's inventory with the reward
    // Update the rewards summary
    rewards.forEach((reward) => {
      
      console.log(`reward: ${reward}`)
      if(!reward.endsWith("Cash")){
        if(partdb.Parts[reward]) {
          userdata.parts.push(reward);
          displayrew.push(`${partdb.Parts[reward].Emote} ${partdb.Parts[reward].Name}`)
        }
        else if(itemdb[reward]) {
          userdata.items.push(reward);
          displayrew.push(`${itemdb[reward].Emote} ${itemdb[reward].Name}`)

        }
        else if(outfits.Helmets[reward] || outfits.Accessories[reward] || outfits.Outfits[reward]) {
          userdata.outfits.push(reward);
          if(outfits.Helmets[reward]){
            displayrew.push(`${outfits.Helmets[reward].Emote} ${outfits.Helmets[reward].Name}`)

          }
          else if(outfits.Accessories[reward]){
            displayrew.push(`${outfits.Accessories[reward].Emote} ${outfits.Accessories[reward].Name}`)

          
          }
        }
        else if(reward == "pvp outfit") {
          userdata.outfits.push("pvp outfit")
          displayrew.push(`${outfits.Helmets.pvp.Emote} PVP`)
        

        }
        rewards2.push(reward)
      }
      else if(reward.endsWith("Cash")) {
        console.log("cash")
        let cashReward = reward.split(" ")[0];
        console.log(cashReward)
        cash += parseInt(cashReward);
      }
      else if (
        reward.includes("garagespaces")
      ) {
        console.log("garage space")
        let amount = reward.split(" ")[0];
        parseInt(amount);
        displayrew.push(`${emotes.addgarage} ${amount} garage space(s)`)

        userdata.garageLimit += Number(amount);
      }
    });
  }
  let quantities = displayrew.reduce((obj, n) => {
    obj[n] = (obj[n] || 0) + 1;
    return obj;
  }, {});

   displayrewards = Object.entries(quantities).map(([n, count]) => `${n} x${count}`);

   // remove the crates from the inventory
    for (let i = 0; i < amount; i++) {
      let index = userdata.items.indexOf(bought.toLowerCase());
      userdata.items.splice(index, 1);
    }
    userdata.cash += cash
  // Update the user's inventory in the database
  await User.updateOne({ id: interaction.user.id }, { items: userdata.items });
  await userdata.save()
  // Display the rewards summary
  embed.setDescription(`Cash: ${toCurrency(cash)}\n${displayrewards.join("\n")}`);
  await interaction.editReply({ embeds: [embed] });
  },
};

function openCrate(crate) {
  let rewards = [];
  let rewardCount = 3
  for (let i = 0; i < rewardCount; i++) {
    let reward = lodash.sample(crate.Contents)
    
    if(reward == "helmet") {

      let helmets = []
      for(let helmet in outfits.Helmets) {
        helmets.push(helmet)
      }
      helmets = helmets.filter((helmet) => !helmet.Exclusive)
      
      let outfit = lodash.sample(helmets)
      reward = outfit.toLowerCase()
      if(crate == "pvp crate" ){
        reward = "pvp outfit"
      }
    }
    else if(reward == "accessory") {
      let accessories = []
      for(let accessory in outfits.Accessories) {
        accessories.push(accessory)
      }
      accessories = accessories.filter((accessory) => !accessory.Exclusive)
      console.log(accessories)
      let outfit = lodash.sample(accessories)
      reward = outfit.toLowerCase()
    }


      rewards.push(reward)
    
  
  }
  return rewards;
}