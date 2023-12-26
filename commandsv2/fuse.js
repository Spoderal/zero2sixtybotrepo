

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
          { name: "Tires", value: "tires" },
          { name: "Slicks", value: "slicks" },
          { name: "Exhaust", value: "exhaust" },
          { name: "Clutch", value: "clutch" },
          { name: "ECU", value: "ecu" },
          { name: "Turbo", value: "turbo" },
          { name: "Race Suspension", value: "rsuspension" },
          { name: "Drift Suspension", value: "dsuspension" },
          { name: "Intercooler", value: "intercooler" },
          { name: "Brakes", value: "brakes" },
          { name: "Bodykit", value: "bodykit" },
          { name: "Weight Reduction", value: "weightreduction" },
          { name: "Weight", value: "weight" },
          { name: "Fruit Punch", value: "fruit punch" },
          {name: "Epic Rocket Engine", value: "epic rocket engine"}
        )
        .setRequired(true)
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
    else if (parttoinstall == "epic rocket engine") {

      if(userdata.moontokens < 1000) return interaction.reply(`You need 1000 moon tokens to fuse these parts!`)

      let items = userdata.parts;
      let item1 = userdata.parts.filter((item) => item == "nuclear core");
      let item2 = userdata.parts.filter((item) => item == "metal frame");
      let item3 = userdata.parts.filter((item) => item == "zionite pistons");
      let item4 = userdata.parts.filter((item) => item == "alien oil");
      let item5 = userdata.parts.filter((item) => item == "car hook");
      let item6 = userdata.parts.filter((item) => item == "heat panels");

      console.log(item1)
      if (item1.length == 0)
        return await interaction.reply(`You're missing a nuclear core!`);
      if (item2.length == 0)
        return await interaction.reply(`You're missing a metal frame!`);
      if (item3.length == 0)
        return await interaction.reply(`You're missing zionite pistons!`);
        if (item4.length == 0)
        return await interaction.reply(`You're missing alien oil!`);
        if (item5.length == 0)
        return await interaction.reply(`You're missing a car hook!`);
        if (item6.length == 0)
        return await interaction.reply(`You're missing heat panels!`);

      for (var i1 = 0; i1 < 1; i1++) items.splice(items.indexOf("nuclear core"), 1);
      for (var i2 = 0; i2 < 1; i2++)
        items.splice(items.indexOf("metal frame"), 1);
      for (var i3 = 0; i3 < 1; i3++)
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
            value: `${partdb.Parts["nuclear core"].Emote} ${partdb.Parts["nuclear core"].Name}
            \n${partdb.Parts["metal frame"].Emote} ${partdb.Parts["metal frame"].Name}
            \n${partdb.Parts["zionite pistons"].Emote} ${partdb.Parts["zionite pistons"].Name}
            \n${partdb.Parts["alien oil"].Emote} ${partdb.Parts["alien oil"].Name}
            \n${partdb.Parts["car hook"].Emote} ${partdb.Parts["car hook"].Name}
            \n${partdb.Parts["heat panels"].Emote} ${partdb.Parts["heat panels"].Name}`,
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
            value: `${partdb.Parts["epic rocket engine"].Emote} ${partdb.Parts["epic rocket engine"].Name}`,
          },
        ]);
        userdata.parts.push("epic rocket engine");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
        
        clearTimeout(xt)
      }, 2000);
      return;
    }
    else {
      let parte = "";
      let partb = "";
      if (parttoinstall == "tires") {
        parte = "t4tires";
        partb = "t5slicks";
      } 
      if (parttoinstall == "slicks") {
        parte = "t4slicks";
        partb = "t5slicks";
      }else if (parttoinstall == "exhaust") {
        parte = "t4exhaust";
        partb = "t5exhaust";
      } else if (parttoinstall == "intake") {
        parte = "t4intake";
        partb = "t5intake";
      } else if (parttoinstall == "clutch") {
        parte = "t4clutch";
        partb = "t5clutch";
      } else if (parttoinstall == "gearbox") {
        parte = "t4gearbox";
        partb = "t5gearbox";
      } else if (parttoinstall == "ecu") {
        parte = "t4ecu";
        partb = "t5ecu";
      } else if (parttoinstall == "dsuspension") {
        parte = "t4driftsuspension";
        partb = "t5driftsuspension";
      } else if (parttoinstall == "dtires") {
        parte = "t4drifttires";
        partb = "t5drifttires";
      } else if (parttoinstall == "rsuspension") {
        parte = "t4racesuspension";
        partb = "t5racesuspension";
      } else if (parttoinstall == "intercooler") {
        parte = "t4intercooler";
        partb = "t5intercooler";
      } else if (parttoinstall == "turbo") {
        parte = "t4turbo";
        partb = "t5turbo";
      } else if (parttoinstall == "spoiler") {
        parte = "t4spoiler";
        partb = "t5spoiler";
      } else if (parttoinstall == "brakes") {
        parte = "t4brakes";
        partb = "t5brakes";
      } else if (parttoinstall == "bodykit") {
        parte = "t4bodykit";
        partb = "t5bodykit";
      } else if (parttoinstall == "weightreduction") {
        parte = "t4weightreduction";
        partb = "t5weightreduction";
      } else if (parttoinstall == "weight") {
        parte = "t4weight";
        partb = "t5weight";
      }

      let filtereduser = parts.filter(function hasmany(part) {
        return part === parte.toLowerCase();
      });
      if (2 > filtereduser.length)
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

      let xt = setTimeout(() => {
        embed.setTitle("Fused!");
        embed.fields = [];
        embed.addFields([
          {
            name: `Part`,
            value: `${partdb.Parts[partb].Emote} ${partdb.Parts[partb].Name}`,
          },
        ]);
        interaction.editReply({ embeds: [embed] });

        for (var i = 0; i < 2; i++)
          parts.splice(parts.indexOf(parte.toLowerCase()), 1);
        userdata.parts = parts;

        userdata.parts.push(partb);
        if (randomblueprint == "yes") {
          userdata.blueprints += 1;
          interaction.channel.send(
            "<:blueprint:1076026198171328562> +1 Blueprint!"
          );
        }
        userdata.save();
        
        clearTimeout(xt)
      }, 2000);
    }
  },
};
