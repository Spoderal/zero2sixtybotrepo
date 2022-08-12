const db = require("quick.db");
const cars = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gp")
    .setDescription("Give premium to users (BOT SUPPORT ONLY)")
    .addStringOption((option) =>
      option
        .setName("tier")
        .setDescription("The premium tier to give")
        .setRequired(true)
        .addChoices(
          { name: "Tier 1", value: "1" },
          { name: "Tier 2", value: "2" },
          { name: "Tier 3", value: "3" },
          { name: "Starter Pack JDM", value: "spj" },
          { name: "Starter Pack American Muscle", value: "spa" },
          { name: "Starter Pack Euro", value: "spe" },
          { name: "Booster", value: "b" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give premium to")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      interaction.user.id !== "890390158241853470" &&
      interaction.user.id !== "474183542797107231" &&
      interaction.user.id !== "152079857793105920" &&
      interaction.user.id !== "699794627095429180" &&
      interaction.user.id !== "937967206652837928" &&
      interaction.user.id !== "670895157016657920"
    )
      return await interaction.reply({
        content: "You don't have permission to run this command.",
        ephemeral: true,
      });

    let user = interaction.options.getUser("user");
    if (!user) return await interaction.reply("Specify a user!");
    let tier = interaction.options.getString("tier");
    let tierlist = ["1", "2", "3", "b", "u", "spj", "spa", "spe"];

    if (!tierlist.includes(tier)) return await interaction.reply("Thats not a tier!");
    if (tier == 1) {
      db.add(`garagelimit_${user.id}`, 5);
      db.set(`timeout_${user.id}`, 30000);
    }
    if (tier == 2 || tier == 3) {
      db.add(`garagelimit_${user.id}`, 10);
      db.push(`pfps_${user.id}`, "cobalt helmet");
    }
    if (tier == 2) {
      db.set(`timeout_${user.id}`, 15000);
    }
    if (tier == 3) {
      db.set(`timeout_${user.id}`, 5000);
    }
    if (tier == "b") {
      db.add(`rarekeys_${user.id}`, 20);
    }
    if (tier == "spj") {
      db.add(`goldbal_${user.id}`, 120);
      db.push(`cars_${user.id}`, "1989 nissan skyline r32");
      db.set(
        `1989 Nissan Skyline R32speed_${user.id}`,
        cars.Cars["1989 nissan skyline r32"].Speed
      );
      db.set(
        `1989 Nissan Skyline R32handling_${user.id}`,
        cars.Cars["1989 nissan skyline r32"].Handling
      );
      db.set(
        `1989 Nissan Skyline R32060_${user.id}`,
        cars.Cars["1989 nissan skyline r32"]["0-60"]
      );
      db.add(`cash_${user.id}`, 25000);
      await interaction.reply(`Gave ${user} the Beginner JDM Pack!`);

      return;
    }
    if (tier == "spa") {
      db.add(`goldbal_${user.id}`, 120);
      db.push(`cars_${user.id}`, "2010 ford mustang");
      db.set(
        `2010 Ford Mustangspeed_${user.id}`,
        cars.Cars["2010 ford mustang"].Speed
      );
      db.set(
        `2010 Ford Mustanghandling_${user.id}`,
        cars.Cars["2010 ford mustang"].Handling
      );
      db.set(
        `2010 Ford Mustang060_${user.id}`,
        cars.Cars["2010 ford mustang"]["0-60"]
      );
      db.add(`cash_${user.id}`, 25000);
      await interaction.reply(`Gave ${user} the Beginner American Muscle Pack!`);

      return;
    }
    if (tier == "spe") {
      db.add(`goldbal_${user.id}`, 120);
      db.push(`cars_${user.id}`, "2002 bmw m3 gtr");
      db.set(
        `2002 BMW M3 GTRspeed_${user.id}`,
        cars.Cars["2002 bmw m3 gtr"].Speed
      );
      db.set(
        `2002 BMW M3 GTRhandling_${user.id}`,
        cars.Cars["2002 bmw m3 gtr"].Handling
      );
      db.set(
        `2002 BMW M3 GTR060_${user.id}`,
        cars.Cars["2002 bmw m3 gtr"]["0-60"]
      );
      db.add(`cash_${user.id}`, 25000);
      await interaction.reply(`Gave ${user} the Beginner Euro Pack!`);

      return;
    }

    db.set(`patreon_tier_${tier}_${user.id}`, true);

    await interaction.reply(`Gave ${user} tier ${tier} on the patreon.`);
  },
};
