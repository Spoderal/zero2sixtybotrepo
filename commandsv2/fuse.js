const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const partdb = require("../data/partsdb.json");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fuse")
    .setDescription("Fuse 2 tier 4 parts to get a tier 5 part")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to upgrade")
        .addChoice("Exhaust", "exhaust")
        .addChoice("Tires", "tires")
        .addChoice("Intake", "intake")
        .addChoice("Clutch", "clutch")
        .addChoice("Gearbox", "gearbox")
        .addChoice("ECU", "ecu")
        .addChoice("Drift Suspension", "dsuspension")
        .addChoice("Race Suspension", "rsuspension")
        .addChoice("Intercooler", "intercooler")
        .addChoice("Turbo", "turbo")
        .addChoice("Spoiler", "spoiler")
        .addChoice("TXExhaust", "txexhaust")
        .setRequired(true)
    ),

  async execute(interaction) {
    let user1 = interaction.user;
    let userdata = await User.findOne({ id: user1.id });

    let parts = userdata.parts;
    let parttoinstall = interaction.options.getString("part");

    if (!parttoinstall)
      return interaction.reply(
        "Specify a part! Try: Exhaust, Tires, Clutch, or Intake"
      );

    if (!parts) return interaction.reply("You dont have any parts!");
    let list3 = [
      "exhaust",
      "tires",
      "intake",
      "clutch",
      "gearbox",
      "ecu",
      "intercooler",
      "dsuspension",
      "rsuspension",
      "turbo",
      "spoiler",
      "txexhaust",
    ];

    if (!list3.includes(parttoinstall.toLowerCase()))
      return interaction.reply(
        "Thats not an available fuse part! Try: Exhaust, Tires, Intercooler, Clutch, Gearbox, ECU, Drift Suspension, Race Suspension, or Intake"
      );

    if (parttoinstall == "txexhaust") {
      let xessence = userdata.xessence;
      if (xessence < 100)
        return interaction.reply(
          `You need 100 Xessence to fuse this part into a TX!`
        );
      if (!parts.includes("t5exhaust"))
        return interaction.reply(`You need a T5Exhaust to do this fuse!`);

      for (var i = 0; i < 1; i++) parts.splice(parts.indexOf("t5exhaust"), 1);
      userdata.parts = parts;

      userdata.xessence -= 100;

      let embed = new discord.MessageEmbed()
        .setTitle("Fusing into a TX...")
        .addField(
          `Part`,
          `${partdb.Parts["t5exhaust"].Emote} ${partdb.Parts["t5exhaust"].Name}`
        );
      embed.setColor("#60b0f4");

      interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.setColor("#ffffff");
        embed.fields = [];
        embed.addField(
          `Part`,
          `${partdb.Parts["txexhaust"].Emote} ${partdb.Parts["txexhaust"].Name}`
        );
        userdata.parts.push("txexhaust");
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
      }

      let filtereduser = parts.filter(function hasmany(part) {
        return part === parte.toLowerCase();
      });
      console.log(filtereduser);
      if (2 > filtereduser.length)
        return interaction.reply(
          `You need 2 ${partdb.Parts[parte].Name} to fuse them!`
        );

      let embed = new discord.MessageEmbed()
        .setTitle("Fusing...")
        .addField(
          `Parts`,
          `${partdb.Parts[parte].Emote} ${partdb.Parts[parte].Name}\n${partdb.Parts[parte].Emote} ${partdb.Parts[parte].Name}`
        );
      embed.setColor("#60b0f4");

      interaction.reply({ embeds: [embed] });

      setTimeout(() => {
        embed.setTitle("Fused!");
        embed.fields = [];
        embed.addField(
          `Part`,
          `${partdb.Parts[partb].Emote} ${partdb.Parts[partb].Name}`
        );
        interaction.editReply({ embeds: [embed] });

        for (var i = 0; i < 2; i++)
          parts.splice(parts.indexOf(parte.toLowerCase()), 1);
        userdata.parts = parts;

        userdata.parts.push(partb);
        userdata.save();
      }, 2000);
    }
  },
};
