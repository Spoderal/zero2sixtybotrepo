const lodash = require("lodash");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

const { createCanvas, loadImage } = require('canvas')


module.exports = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("Open a crate for profile helmets")
    .addStringOption((option) =>
      option
        .setName("crate")
        .setDescription("The crate you want to open")
        .addChoices(
          { name: "Common", value: "common" },
          { name: "Rare", value: "rare" },
          { name: "Seasonal", value: "seasonal" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    let pfps = require("../data/pfpsdb.json");
    let crates = require("../data/cratedb.json");

    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let bought = interaction.options.getString("crate");
    let inv = userdata.items;

    let boughtindb = crates.Crates[bought.toLowerCase()]

    if(!inv.includes(bought)) return interaction.reply(`You don't have a ${boughtindb.Emote} ${boughtindb.Name}!`)

    
    
    let embed = new EmbedBuilder()
    .setTitle(`Unboxing ${boughtindb.Emote} ${boughtindb.Name}...`)
    .setColor(`#60b0f4`);
    
    interaction.reply({embeds: [embed]})
    

    const canvas = createCanvas(1280, 720)
    const ctx = canvas.getContext('2d')
    const bg = await loadImage('https://i.ibb.co/6WwF0gJ/crateunbox.png')
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    let x = 0
    let rewards = []
    let i = setInterval(() => {
      x++
      let reward = lodash.sample(boughtindb.Contents)
      rewards.push(reward)

      if(x == 3){
        clearInterval(i)
      }
    }, 1000);


    
    setTimeout(async () => {
      let reward1 = rewards[0]
      let reward2 = rewards[1]
      let reward3 = rewards[2]

      let name1
      let name2
      let name3
      if(pfps.Pfps[reward1]){
        let helmetimg = pfps.Pfps[reward1].Image
        name1 = pfps.Pfps[reward1].Name
       let loadedhelm = await loadImage(helmetimg)

       ctx.drawImage(loadedhelm, 150, 200, 150, 150);
       ctx.save()
      }
      if(pfps.Pfps[reward2]){
        let helmetimg = pfps.Pfps[reward2].Image
        name2 = pfps.Pfps[reward2].Name
       let loadedhelm = await loadImage(helmetimg)

       ctx.drawImage(loadedhelm, 570, 200, 150, 150);
       ctx.save()
      }
      if(pfps.Pfps[reward3]){
        let helmetimg = pfps.Pfps[reward3].Image
        name3 = pfps.Pfps[reward3].Name
       let loadedhelm = await loadImage(helmetimg)

       ctx.drawImage(loadedhelm, 970, 200, 150, 150);
       ctx.save()
      }

      ctx.restore();
ctx.font = '40px sans-serif';
ctx.fillStyle = '#00000';
let imageload = await loadImage("https://i.ibb.co/y8RDM5v/cash.png")

if(reward1.endsWith(`Cash`)){
  let amount = Number(reward1.split(" ")[0]);
  name1 = `${amount} Cash`
  ctx.drawImage(imageload, 150, 200, 150, 150);
}

if(reward2.endsWith(`Cash`)){
  let amount2 = Number(reward2.split(" ")[0]);
  name2 = `${amount2} Cash`
  ctx.drawImage(imageload, 570, 200, 150, 150);
}

if(reward3.endsWith(`Cash`)){
  let amount3 = Number(reward3.split(" ")[0]);
  name3 = `${amount3} Cash`
  ctx.drawImage(imageload, 970, 200, 150, 150);
}


ctx.fillText(name1, 100, 565);
ctx.fillText(name2, 520, 565);
ctx.fillText(name3, 920, 565);

      let attachment = new AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });
      embed.setImage(`attachment://profile-image.png`)
      console.log(rewards)
      await interaction.editReply({embeds: [embed], files: [attachment]})
    }, 5000);


    }
  }
