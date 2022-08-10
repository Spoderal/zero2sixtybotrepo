const db = require("quick.db");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const cardb = require("../data/cardb.json");
const { toCurrency } = require("../common/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usedcars")
    .setDescription("Check the leaderboard")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a used car dealership")
        .addStringOption((option) =>
          option
            .setName("name")
            .setRequired(true)
            .setDescription("The name of your dealership")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a used car dealership")
        .addUserOption((option) =>
          option
            .setName("user")
            .setRequired(false)
            .setDescription("The id of the dealership you want to see")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Create a used car listing in your dealership")
        .addStringOption((option) =>
          option
            .setName("name")
            .setRequired(true)
            .setDescription("The name of the car")
        )
        .addNumberOption((option) =>
          option
            .setName("price")
            .setRequired(true)
            .setDescription("The price of the car")
        )
    ),
  async execute(interaction) {
    let user = interaction.user;

    let subcommand = interaction.options.getSubcommand();

    if (subcommand == "create") {
      let name = interaction.options.getString("name");
      let storeid = db.fetch(`numused`) || 1;
      let newid = storeid + 1;
      db.set(`usedcarshop_${user.id}`, {
        Name: name,
        Sales: 0,
        Listed: 0,
        Profit: 0,
        Owner: user.tag,
        ID: newid,
        Current: [],
      });
      db.add(`numused`, 1);

      let newshop = db.fetch(`usedcarshop_${user.id}`);
      let embed = new Discord.EmbedBuilder().setTitle("Created!").addFields([
        { name: "Name", value: `${name}`, inline: true },
        { name: "Sales", value: `${newshop.Sales}`, inline: true },
        { name: "Cars listed", value: `${newshop.Listed}`, inline: true },
        { name: "Money earned", value: `$${newshop.Profit}`, inline: true },
        { name: "Owner", value: `${user.username}`, inline: true },
        { name: "Store ID", value: `${newshop.ID}`, inline: true },
      ]);

      interaction.reply({ embeds: [embed] });
    } else if (subcommand == "list") {
      let usedshop = db.fetch(`usedcarshop_${user.id}`);
      let usercars = db.fetch(`cars_${user.id}`);

      if (!usedshop)
        return interaction.reply(`You don't have a dealership open!`);

      let carname = interaction.options.getString("name");
      let carprice = interaction.options.getNumber("price");

      if (!cardb.Cars[carname.toLowerCase()])
        return interaction.reply(`Thats not a car!`);

      if (!usercars.includes(carname.toLowerCase()))
        return interaction.reply(`You don't have that car!`);

      let carindb = cardb.Cars[carname.toLowerCase()];

      let carspeed = db.fetch(`${carindb.Name}speed_${user.id}`);
      let caracc = db.fetch(`${carindb.Name}060_${user.id}`);
      let carhand =
        db.fetch(`${carindb.Name}handling_${user.id}`) || carindb.Handling;
      let carexhaust = db.fetch(`${carindb.Name}exhaust_${user.id}`);
      let carintake = db.fetch(`${carindb.Name}intake_${user.id}`);
      let cartires = db.fetch(`${carindb.Name}tires_${user.id}`);
      let carturbo = db.fetch(`${carindb.Name}turbo_${user.id}`);
      let carbody = db.fetch(`${carindb.Name}body_${user.id}`);
      let carspoiler = db.fetch(`${carindb.Name}spoiler_${user.id}`);
      let cargearbox = db.fetch(`${carindb.Name}gearbox_${user.id}`);
      let carsusp = db.fetch(`${carindb.Name}suspension_${user.id}`);
      let carecu = db.fetch(`${carindb.Name}ecu_${user.id}`);
      let carclutch = db.fetch(`${carindb.Name}clutch_${user.id}`);
      let carlivery =
        db.fetch(`${carindb.Name}livery_${user.id}`) || carindb.Image;

      db.push(`usedcarshop_${user.id}.Current`, {
        Car: carname,
        Price: carprice,
        Speed: carspeed,
        Acc: caracc,
        Handling: carhand,
        Exhaust: carexhaust,
        Intake: carintake,
        Tires: cartires,
        Turbo: carturbo,
        Bodykit: carbody,
        Spoiler: carspoiler,
        Gearbox: cargearbox,
        ECU: carecu,
        Clutch: carclutch,
        Livery: carlivery,
        Suspension: carsusp,
      });

      db.add(`usedcarshop_${user.id}.Listed`, 1);

      let embed = new Discord.EmbedBuilder()
        .setTitle(`✅ Listed ${carindb.Name}`)
        .setImage(carlivery)
        .addFields([
          { name: `Price`, value: `${toCurrency(carprice)}` },
          {
            name: `Stats`,
            value: `${carspeed} MPH\n${caracc}s 0-60\n${carhand} Handling`,
          },
        ]);

      interaction.reply({ embeds: [embed] });
    } else if (subcommand == "delist") {
      // skipped
    } else if (subcommand == "view") {
      let shopid = interaction.options.getUser("user").id || user.id;

      let newshop = db.fetch(`usedcarshop_${shopid}`);
      let usedlisted = newshop.Current;
      let used = [];
      for (const i in usedlisted) {
        let uc = usedlisted[i];

        used.push(
          `${cardb.Cars[uc.Car.toLowerCase()].Emote} ${uc.Car} : ${toCurrency(
            uc.Price
          )}`
        );
      }

      let embed = new Discord.EmbedBuilder()
        .setTitle(`${newshop.Name}`)
        .addFields([
          { name: "Sales", value: `${newshop.Sales}`, inline: true },
          { name: "Cars listed", value: `${newshop.Listed}`, inline: true },
          { name: "Money earned", value: `$${newshop.Profit}`, inline: true },
          { name: "Owner", value: `${user.username}`, inline: true },
          { name: "Store ID", value: `${newshop.ID}`, inline: true },
          { name: `Current Cars`, value: `${used.join(`\n`)}` },
        ]);

      interaction.reply({ embeds: [embed] });
    }
  },
};
