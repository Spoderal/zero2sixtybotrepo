const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const { toCurrency } = require("../common/utils");
const lodash = require("lodash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fuse")
    .setDescription("Fuse 2 tier 4 parts to get a tier 5 part")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to upgrade")
        .addChoices(
          { name: "Exhaust", value: "exhaust" },
          { name: "Tires", value: "tires" },
          { name: "Intake", value: "intake" },
          { name: "Clutch", value: "clutch" },
          { name: "Gearbox", value: "gearbox" },
          { name: "ECU", value: "ecu" },
          { name: "Drift Suspension", value: "dsuspension" },
          { name: "Drift Tires", value: "dtires" },
          { name: "Race Suspension", value: "rsuspension" },
          { name: "Intercooler", value: "intercooler" },
          { name: "Turbo", value: "turbo" },
          { name: "Spoiler", value: "spoiler" },
          { name: "Bodykit", value: "bodykit" },
          { name: "Weight", value: "weight" },
          { name: "Brakes", value: "brakes" },
          { name: "TXExhaust", value: "txexhaust" },
          { name: "TXIntake", value: "txintake" },
          { name: "TXTurbo", value: "txturbo" },
          { name: "TXClutch", value: "txclutch" }
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

    if (parttoinstall == "txexhaust") {
      let xessence = userdata.xessence;
      if (xessence < 100)
        return await interaction.reply(
          `You need 100 Xessence to fuse this part into a TX!`
        );
      if (!parts.includes("t5exhaust") && !parts.includes("T5Exhaust"))
        return await interaction.reply(`You need a T5Exhaust to do this fuse!`);

      for (var i = 0; i < 1; i++) parts.splice(parts.indexOf("t5exhaust"), 1);
      userdata.parts = parts;

      userdata.xessence -= 100;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into a TX...")
        .addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["t5exhaust"].Emote} ${partdb.Parts["t5exhaust"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["txexhaust"].Emote} ${partdb.Parts["txexhaust"].Name}`,
          },
        ]);
        userdata.parts.push("txexhaust");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
      }, 2000);
      return;
    } else if (parttoinstall == "txintake") {
      let xessence = userdata.xessence;
      if (xessence < 100)
        return await interaction.reply(
          `You need 100 Xessence to fuse this part into a TX!`
        );
      if (!parts.includes("t5intake") && !parts.includes("T5Intake"))
        return await interaction.reply(`You need a T5Intake to do this fuse!`);

      for (var f = 0; f < 1; f++) parts.splice(parts.indexOf("t5intake"), 1);
      userdata.parts = parts;

      userdata.xessence -= 100;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into a TX...")
        .addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["t5intake"].Emote} ${partdb.Parts["t5intake"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["txintake"].Emote} ${partdb.Parts["txintake"].Name}`,
          },
        ]);
        userdata.parts.push("txintake");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
      }, 2000);
      return;
    } else if (parttoinstall == "txturbo") {
      let xessence = userdata.xessence;
      if (xessence < 100)
        return await interaction.reply(
          `You need 100 Xessence to fuse this part into a TX!`
        );
      if (!parts.includes("t5turbo") && !parts.includes("T5Turbo"))
        return await interaction.reply(`You need a T5Turbo to do this fuse!`);

      for (var t = 0; t < 1; t++) parts.splice(parts.indexOf("t5turbo"), 1);
      userdata.parts = parts;

      userdata.xessence -= 100;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into a TX...")
        .addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["t5turbo"].Emote} ${partdb.Parts["t5turbo"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["txturbo"].Emote} ${partdb.Parts["txturbo"].Name}`,
          },
        ]);
        userdata.parts.push("txturbo");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
      }, 2000);
      return;
    } else if (parttoinstall == "txclutch") {
      let xessence = userdata.xessence;
      if (xessence < 100)
        return await interaction.reply(
          `You need 100 Xessence to fuse this part into a TX!`
        );
      if (!parts.includes("t5clutch") && !parts.includes("T5Clutch"))
        return await interaction.reply(`You need a T5Clutch to do this fuse!`);

      for (var e = 0; e < 1; e++) parts.splice(parts.indexOf("t5clutch"), 1);
      userdata.parts = parts;

      userdata.xessence -= 100;

      let embed = new discord.EmbedBuilder()
        .setTitle("Fusing into a TX...")
        .addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["t5clutch"].Emote} ${partdb.Parts["t5clutch"].Name}`,
          },
        ]);
      embed.setColor(colors.blue);

      await interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addFields([
          {
            name: `Part`,
            value: `${partdb.Parts["txclutch"].Emote} ${partdb.Parts["txclutch"].Name}`,
          },
        ]);
        userdata.parts.push("txclutch");
        userdata.save();
        interaction.editReply({ embeds: [embed] });
      }, 2000);
      return;
    } else {
      let parte = "";
      let partb = "";
      if (parttoinstall == "tires") {
        parte = "t4tires";
        partb = "t5slicks";
      } else if (parttoinstall == "exhaust") {
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
      } else if (parttoinstall == "weight") {
        parte = "t4weightreduction";
        partb = "t5weightreduction";
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

      setTimeout(() => {
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
      }, 2000);
    }
  },
};
