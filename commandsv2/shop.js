const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const lodash = require("lodash")
const petdb = require("../data/pets.json")
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View event shops"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let row = new Discord.ActionRowBuilder()
    .setComponents(
      new Discord.ButtonBuilder()
      .setCustomId("buy_pumpkin")
      .setLabel("Buy Pumpkin")
      .setEmoji("<:pet_pumpkin:1155765933718126662>")
      .setStyle("Secondary"),
      new Discord.ButtonBuilder()
      .setCustomId("buy_skull")
      .setLabel("Buy Skull")
      .setEmoji("<a:pet_skull:1155765929452503070>")
      .setStyle("Secondary"),
      new Discord.ButtonBuilder()
      .setCustomId("buy_eyeball")
      .setLabel("Buy Eyeball")
      .setEmoji("<:pet_eyeball:1159584622573781002>")
      .setStyle("Secondary"),
      new Discord.ButtonBuilder()
      .setCustomId("buy_ghost")
      .setLabel("Buy Ghost")
      .setEmoji("<:pet_ghost:1155765930702405662>")
      .setStyle("Secondary"),
      new Discord.ButtonBuilder()
      .setCustomId("buy_spooky")
      .setLabel("Buy Spooky Title")
      .setStyle("Secondary")
     
    )

    let embed = new Discord.EmbedBuilder()
    .setTitle("Zalloween Shop")
    .setDescription("Buy items from the Zalloween Shop!")
    .addFields({name:"For Sale", value: "<:pet_pumpkin:1155765933718126662> Pet Pumpkin : <:item_candy:1155765935022559342> 250 Candy\n<a:pet_skull:1155765929452503070> Pet Skull: <:item_candy:1155765935022559342> 250 Candy\n<:pet_eyeball:1159584622573781002> Pet Eyeball <:item_candy:1155765935022559342> 250 Candy\n<:pet_ghost:1155765930702405662> Pet Ghost: <:item_candy:1155765935022559342> 250 Candy\nSpooky Title: <:item_candy:1155765935022559342> 500 Candy"})
    .setColor(colors.blue)
    

   let msg = await interaction.reply({embeds: [embed], components: [row]})


   let filter = (user) => {
    user.id == interaction.user.id

   }

   let collector = msg.createMessageComponentCollector({
    filter,
    time: 30000
   })

   collector.on("collect", async (i) => {

      if(i.customId.includes("buy_pumpkin")){
        if(userdata.zcandy < 250) return i.update(`You need 250 candy to get a pet!`)
        let randname = lodash.sample(petdb.pumpkin)
        let petobj = {
          name: randname,
          hunger: 100,
          thirst: 100,
          love: 100,
          tier: petdb.pumpkin.Tier,
          pet: petdb.pumpkin.Name.toLowerCase(),
          xessence: 50,
        };
        userdata.zcandy -= 250
        userdata.pet = petobj

        userdata.save()

        await i.update(`✅`)
      }
      else if(i.customId.includes("buy_skull")){
        if(userdata.zcandy < 250) return i.update(`You need 250 candy to get a pet!`)
        let randname = lodash.sample(petdb.skull)
        let petobj = {
          name: randname,
          hunger: 100,
          thirst: 100,
          love: 100,
          tier: petdb.skull.Tier,
          pet: petdb.skull.Name.toLowerCase(),
          xessence: 50,
        };
        userdata.zcandy -= 250
        userdata.pet = petobj

        userdata.save()

        await i.update(`✅`)
      }
      else if(i.customId.includes("buy_eyeball")){
        if(userdata.zcandy < 250) return i.update(`You need 250 candy to get a pet!`)
        let randname = lodash.sample(petdb.eyeball)
        let petobj = {
          name: randname,
          hunger: 100,
          thirst: 100,
          love: 100,
          tier: petdb.eyeball.Tier,
          pet: petdb.eyeball.Name.toLowerCase(),
          xessence: 50,
        };
        userdata.zcandy -= 250
        userdata.pet = petobj

        userdata.save()

        await i.update(`✅`)
      }
      else if(i.customId.includes("buy_ghost")){
        if(userdata.zcandy < 250) return i.update(`You need 250 candy to get a pet!`)
        let randname = lodash.sample(petdb.ghost)
        let petobj = {
          name: randname,
          hunger: 100,
          thirst: 100,
          love: 100,
          tier: petdb.ghost.Tier,
          pet: petdb.ghost.Name.toLowerCase(),
          xessence: 50,
        };
        userdata.zcandy -= 250
        userdata.pet = petobj

        userdata.save()

        await i.update(`✅`)
      }
      else if(i.customId.includes("buy_spooky")){
        if(userdata.zcandy < 500) return i.update(`You need 250 candy to get this title!`)
        userdata.zcandy -= 500
        userdata.titles.push("spooky")

        userdata.save()

        await i.update(`✅`)
      }
   })


  },
};
