

const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const { toCurrency } = require("../common/utils");
const lodash = require("lodash");
const itemdb = require("../data/items.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fuse")
    .setDescription("Fuse 2 tier 4 parts to get a tier 5 part")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to upgrade")
        .addChoices(
          
          { name: "Epic Rocket Engine (EVENT)", value: "epic rocket engine" },
          { name: "Tires", value: "tires" },
          { name: "Exhaust", value: "exhaust" },
          { name: "Intake", value: "intake" },
          { name: "Clutch", value: "clutch" },
          { name: "ECU", value: "ecu" },
          { name: "Turbo", value: "turbo" },
          { name: "Suspension", value: "suspension" },
          { name: "Intercooler", value: "intercooler" },
          { name: "Brakes", value: "brakes" },
          { name: "Spoiler", value: "spoiler" },
          { name: "Gearbox", value: "gearbox" },
          { name: "Weight Reduction", value: "weightreduction" },
          { name: "Weight", value: "weight" },
          { name: "Slicks", value: "slicks" },
          { name: "Drift Suspension", value: "dsuspension" },
          { name: "Gas Tank", value: "gastank" },
          { name: "Fruit Punch", value: "fruit punch" },
          {name: "Offroad Tires", value: "offroadtires"},
          {name: "Crankshaft", value: "crankshaft"},  
          {name: "Apple Pie", value: "apple pie"},
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option 
      .setName("t5voucher")
      .setDescription("Use a T5 Voucher to skip the fusion process")
      .setRequired(false)
  ),

  async execute(interaction) {
    let user1 = interaction.user;
    let userdata = await User.findOne({ id: user1.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let parts = userdata.parts;
    let parttoinstall = interaction.options.getString("part");

    if (!parttoinstall)
      return await interaction.reply(
        "Specify a part! Try: Exhaust, Tires, Clutch, or Intake"
      );

      let t5vouch = interaction.options.getString("t5voucher")
      let uservouchers = userdata.t5vouchers

      if(t5vouch == true && uservouchers <= 0) return await interaction.reply("You dont have any T5 Vouchers!")

    if (!parts) return await interaction.reply("You dont have any parts!");
    if (parttoinstall == "fruit punch") {
      let items = userdata.items;
      let juice1 = userdata.items.filter((item) => item == "apple juice");
      let juice2 = userdata.items.filter((item) => item == "grape juice");
      let juice3 = userdata.items.filter((item) => item == "orange juice");
      if (juice1.length == 0)
        return await interaction.reply(`You're missing apple juice!`);
      if (juice2.length == 0)
        return await interaction.reply(`You're missing grape juice!`);
      if (juice3.length == 0)
        return await interaction.reply(`You're missing orange juice!`);

      for (var j = 0; j < 1; j++) items.splice(items.indexOf("apple juice"), 1);
      for (var j2 = 0; j2 < 1; j2++)
        items.splice(items.indexOf("grape juice"), 1);
      for (var j3 = 0; j3 < 1; j3++)
        items.splice(items.indexOf("orange juice"), 1);
      userdata.items = items;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into fruit punch...")
        .addFields([
          {
            name: `Items`,
            value: `${itemdb["apple juice"].Emote} ${itemdb["apple juice"].Name}\n${itemdb["grape juice"].Emote} ${itemdb["grape juice"].Name}\n${itemdb["orange juice"].Emote} ${itemdb["orange juice"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      let xt = setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Item`,
            value: `${itemdb["fruit punch"].Emote} ${itemdb["fruit punch"].Name}`,
          },
        ]);
        userdata.items.push("fruit punch");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
        
        clearTimeout(xt)
      }, 2000);
      return;
    } 
    else  if (parttoinstall == "apple pie") {
      let apples = userdata.items.filter(function hasmany(item) {
        return item === "apple"
      });
      if (5 > apples.length)
        return await interaction.reply(
          "You need 5 apples to make an apple pie!"
        );
        let uitems = userdata.items
        for (var i3 = 0; i3 < 5; i3++) uitems.splice(uitems.indexOf("apple"), 1);
      userdata.items = uitems;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into apple pie...")
        .addFields([
          {
            name: `Items`,
            value: `5x ${itemdb["apple"].Emote} ${itemdb["apple"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      let xt = setTimeout(async () => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Item`,
            value: `${itemdb["apple pie"].Emote} ${itemdb["apple pie"].Name}`,
          },
        ]);
        userdata.items.push("apple pie");
        await userdata.save();
        interaction.editReply({ embeds: [embed] });
        
        clearTimeout(xt)
      }, 2000);
      return;
    } 
    else if (parttoinstall == "epic rocket engine") {

      let epicalready = parts.filter((item) => item == "epic rocket engine");

      if (epicalready.length > 0){
        return await interaction.reply("You already have an epic rocket engine!")
      }

      let items = userdata.parts;
      let item7 = userdata.parts.filter((item) => item == "rocket engine");
      let item1 = userdata.parts.filter((item) => item == "nuclear core");
      let item2 = userdata.parts.filter((item) => item == "metal frame");
      let item3 = userdata.parts.filter((item) => item == "zionite pistons");
      let item4 = userdata.parts.filter((item) => item == "alien oil");
      let item5 = userdata.parts.filter((item) => item == "car hook");
      let item6 = userdata.parts.filter((item) => item == "heat panels");

      let missing = []
      console.log(item1)
      if (item7.length == 0){
        missing.push(`rocket engine`)

      }
      if (item1.length == 0){
        missing.push(`nuclear core`)

      }
      if (item2.length == 0){
        missing.push(`metal frame`)

      }
      if (item3.length == 0){
        missing.push(`zionite pistons`)

      }
        if (item4.length == 0){
          missing.push(`alien oil`)

        }
        if (item5.length == 0){
          missing.push(`car hook`)

        }
        if (item6.length == 0){

          missing.push(`heat panels`)
        }

        if(missing.length > 0){
          return await interaction.reply(`You're missing a ${missing.join(", ")}!`)

        }

        for (var i7 = 0; i7 < 1; i7++) items.splice(items.indexOf("rocket engine"), 1);
      for (var i1 = 0; i1 < 1; i1++) items.splice(items.indexOf("nuclear core"), 1);
      for (var i2 = 0; i2 < 1; i2++)
        items.splice(items.indexOf("metal frame"), 1);
      for (var i8 = 0; i8 < 1; i8++)
        items.splice(items.indexOf("zionite pistons"), 1);
        for (var i4 = 0; i4 < 1; i4++)
        items.splice(items.indexOf("alien oil"), 1);
        for (var i5 = 0; i5 < 1; i5++)
        items.splice(items.indexOf("car hook"), 1);
        for (var i6 = 0; i6 < 1; i6++)
        items.splice(items.indexOf("heat panels"), 1);
      userdata.parts = items;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into an epic rocket engine...")
        .addFields([
          {
            name: `Items`,
            value: `
            ${partdb.Parts["rocket engine"].Emote} ${partdb.Parts["rocket engine"].Name}
            \n${partdb.Parts["nuclear core"].Emote} ${partdb.Parts["nuclear core"].Name}
            \n${partdb.Parts["metal frame"].Emote} ${partdb.Parts["metal frame"].Name}
            \n${partdb.Parts["zionite pistons"].Emote} ${partdb.Parts["zionite pistons"].Name}
            \n${partdb.Parts["alien oil"].Emote} ${partdb.Parts["alien oil"].Name}
            \n${partdb.Parts["car hook"].Emote} ${partdb.Parts["car hook"].Name}
            \n${partdb.Parts["heat panels"].Emote} ${partdb.Parts["heat panels"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      let xt = setTimeout(async () => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Item`,
            value: `${partdb.Parts["epic rocket engine"].Emote} ${partdb.Parts["epic rocket engine"].Name}`,
          },
        ]);
        userdata.parts.push("epic rocket engine");
        await userdata.save();
        interaction.editReply({ embeds: [embed] });
        
        clearTimeout(xt)
      }, 2000);
      return;
    }

    else {
      
      if(partdb.Parts[`t4${parttoinstall.toLowerCase()}`]){

        let parte = `t4${parttoinstall.toLowerCase()}`
        let partb = `t5${parttoinstall.toLowerCase()}`

        let filtereduser = parts.filter(function hasmany(part) {
          return part === parte.toLowerCase();
        });
        if (2 > filtereduser.length && userdata.t5vouchers <= 0)
          return await interaction.reply(
            `You need 2 ${partdb.Parts[parte].Name} to fuse them!`
          );
  
        let embed = new discord.EmbedBuilder().setTitle("Fusing...").addFields([
          {
            name: `Parts`,
            value: `${partdb.Parts[parte].Emote} ${partdb.Parts[parte].Name}\n${partdb.Parts[parte].Emote} ${partdb.Parts[parte].Name}`,
          },
        ]);
        embed.setColor(colors.blue);
  
        await interaction.reply({ embeds: [embed] });
        let achievements = userdata.achievements || ["None"];
        if (achievements) {
          let fusionFiltered = achievements.filter(
            (achievement) => achievement.name == "Fusion Master"
          );
          if (fusionFiltered.length == 0) {
            console.log("none");
            achievements.push({
              name: "Fusion Master",
              amount: 0,
              id: "fusion master",
              completed: false,
            });
            userdata.markModified("achievements");
            userdata.update();
          }
          fusionFiltered = achievements.filter(
            (achievement) => achievement.name == "Fusion Master"
          );
          fusionFiltered[0].amount += 1;
          userdata.markModified("achievements");
  
          userdata.update();
          userdata.markModified("achievements");
  
          if (
            fusionFiltered[0].amount >= 50 &&
            fusionFiltered[0].completed !== true
          ) {
            embed.setDescription(
              `New achievement! <:ach_fusionmaster:1028936494783676416> You received ${toCurrency(
                achievementsdb.Achievements["fusion master"].Reward
              )}`
            );
            fusionFiltered[0].completed = true;
            userdata.cash += achievementsdb.Achievements["fusion master"].Reward;
            userdata.update();
            userdata.markModified("achievements");
          }
        }
        let yesno = ["yes", "no", "no"];
        let randomblueprint = lodash.sample(yesno);
  
        let xt = setTimeout(async () => {
          embed.setTitle("Fused!");
          embed.fields = [];
          embed.addFields([
            {
              name: `Part`,
              value: `${partdb.Parts[partb].Emote} ${partdb.Parts[partb].Name}`,
            },
          ]);
          interaction.editReply({ embeds: [embed] });
          let t5option = interaction.options.getString("t5voucher")
          if(userdata.t5vouchers > 0 && t5option == true){
            userdata.t5vouchers -= 1
          }
          else {
            for (var i = 0; i < 2; i++) parts.splice(parts.indexOf(parte.toLowerCase()), 1);

            userdata.parts = parts;
          }
  
          userdata.parts.push(partb);
          if (randomblueprint == "yes") {
            userdata.blueprints += 1;
            interaction.channel.send(
              "<:blueprint:1076026198171328562> +1 Blueprint!"
            );
          }
          console.log("t5")
          await userdata.save();
          
          clearTimeout(xt)
        }, 2000);
      }

    }
  },
};
