const cars = require("../data/cardb.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Car = require("../schema/car");
const Global = require("../schema/global-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("livery")
    .setDescription("View, install, or submit a livery for your car")
    .addSubcommand((cmd) =>
      cmd
        .setName("submit")
        .setDescription("Submit a livery")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car you want to submit a livery for")
            .setRequired(true)
        )

        .addStringOption((option) =>
          option
            .setName("liverylink")
            .setDescription(
              "The link to the image for the livery you want to submit"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("view")
        .setDescription("View a livery")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car you want to view a livery for")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the livery you want to view")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("install")
        .setDescription("Install a livery")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car you want to install a livery for")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the livery you want to install")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("approve")
        .setDescription("Approve a livery (BOT SUPPORT ONLY)")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car you want to approve a livery for")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the livery you want to approve")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("list")
        .setDescription("List the available liveries for a car")
        .addStringOption((option) =>
          option
            .setName("car")
            .setDescription("The car you want to view liveries for")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let uid = interaction.user.id;
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let subcommand = interaction.options.getSubcommand();
    if (subcommand == "install") {
      let idtoselect = interaction.options.getString("car");
      let filteredcar = userdata.cars.filter(
        (car) => car.ID == idtoselect.toLowerCase()
      );
      let selected = filteredcar[0] || "No ID";
      if (selected == "No ID") {
        let errembed = new Discord.EmbedBuilder()
          .setTitle("Error!")
          .setColor(colors.discordTheme.red)
          .setDescription(
            `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
          );
        return await interaction.reply({ embeds: [errembed] });
      }
      let livid = interaction.options.getString("id");
      let global = await Global.findOne({});
      let liverieslist = global.liveries;
      let carindb = selected;
      let cardata = liverieslist.filter(
        (car) => car.Name.toLowerCase() == carindb.Name.toLowerCase()
      );
      console.log(cardata);
      if (!livid) return await interaction.reply("Specify an id!");
      let list = cars.Cars;
      if (!list[selected.Name.toLowerCase()])
        return await interaction.reply("That isnt an available car!");

      if (!liverieslist[0])
        return await interaction.reply("This car doesn't have any livery id's");

      let filtered = cardata.filter((e) => e.id == livid && e.approved == true);
      console.log(filtered);
      if (!filtered[0]) return await interaction.reply("Thats not a valid ID!");
      await User.findOneAndUpdate(
        {
          id: uid,
        },
        {
          $set: {
            "cars.$[car].Livery": filtered[0].image,
          },
        },

        {
          arrayFilters: [
            {
              "car.Name": selected.Name,
            },
          ],
        }
      );
      let embedapprove = new Discord.EmbedBuilder()
        .setTitle(`Installed ${livid}`)
        .setImage(filtered[0].image)
        .setColor(colors.blue);

      await interaction.reply({ embeds: [embedapprove] });
    } else if (subcommand == "view") {
      let car = interaction.options.getString("car").toLowerCase();
      let livid = interaction.options.getString("id");
      let global = await Global.findOne();
      let liverieslist = global.liveries;
      if (!car) return await interaction.reply("Specify a car!");
      if (!livid) return await interaction.reply("Specify an id!");
      let list = cars.Cars;
      if (!list[car.toLowerCase()])
        return await interaction.reply("That isnt an available car!");
      let cardata = liverieslist.filter((car) => car.Name.toLowerCase() == car);

      if (!cardata[0])
        return await interaction.reply("This car doesn't have any livery id's");

      let filtered = cardata.filter((e) => e.id == livid);

      if (
        filtered == [] ||
        filtered.length == 0 ||
        !filtered ||
        filtered == null
      )
        return await interaction.reply("Thats not a valid ID!");
      let embedapprove = new Discord.EmbedBuilder()
        .setTitle(`Livery ${livid} for ${cars.Cars[car].Name}`)
        .setImage(filtered[0].image)
        .setColor(colors.blue);

      await interaction.reply({ embeds: [embedapprove] });
    } else if (subcommand == "submit") {
      let global = await Global.findOne();
      let liverieslist = global.liveries;
      let cartosubmit = interaction.options.getString("car");
      let liverylink = interaction.options.getString("liverylink");
      if (!cartosubmit)
        return await interaction.reply("Usage: /livery submit (car)");
      let list = cars.Cars;

      if (!list[cartosubmit.toLowerCase()])
        return await interaction.reply("That isnt an available car yet!");
      let cardata =
        liverieslist.filter(
          (car) => car.Name.toLowerCase() == cartosubmit.toLowerCase()
        ) || [];

      console.log(cardata);

      let livobj = {
        image: liverylink,
        id: (cardata.length += 1),
        user: interaction.user.id,
        approved: false,
        Name: cartosubmit,
      };

      liverieslist.push(livobj);

      global.save();

      let embed = new Discord.EmbedBuilder()
        .setImage(liverylink)
        .setDescription("Submitted for review!")
        .addFields([
          { name: "Car", value: cars.Cars[cartosubmit.toLowerCase()].Name },
          { name: "ID", value: `${livobj.id}` },
        ])
        .setColor(colors.blue);
      interaction.reply({ embeds: [embed] });
      interaction.channel.send("https://youtu.be/FkT-qlOoJeM");
      let submitchannel =
        interaction.client.channels.cache.get("931078225021521920");

      submitchannel.send({ embeds: [embed] });
    } else if (subcommand == "approve") {
      let whitelist = [
        "275419902381260802",
        "890390158241853470",
        "699794627095429180",
        "670895157016657920",
        "576362830572421130",
        "937967206652837928",
        "311554075298889729",
        "474183542797107231",
        "678558875846443034",
        "211866621684219904",
      ];

      if (!whitelist.includes(interaction.user.id))
        return await interaction.reply({
          content: `You don't have permission to use this command!`,
          ephemeral: true,
        });
      let global = await Global.findOne();
      let liverieslist = global.liveries;
      let idtoapprove = interaction.options.getString("id");
      let cartoapprove = interaction.options.getString("car");
      if (!idtoapprove) return await interaction.reply("Specify an id!");
      if (!cartoapprove) return await interaction.reply("Specify a car!");
      let list = cars.Cars;
      if (!list[cartoapprove.toLowerCase()])
        return await interaction.reply("That isnt an available car!");
      let cardata = liverieslist.filter(
        (car) => car.Name.toLowerCase() == cartoapprove.toLowerCase()
      );
      console.log(cardata);
      let idfiltered = cardata.filter((id) => id.id == idtoapprove);

      if (idfiltered && idfiltered.approved == true)
        return await interaction.reply(
          "This car livery is already approved or this ID doesn't exist"
        );

      console.log(idfiltered);

      if (idfiltered.length == 0)
        return await interaction.reply("Thats not a valid ID!");
      let livobj2 = {
        image: idfiltered[0].image,
        id: idfiltered[0].id,
        user: idfiltered[0].user,
        approved: true,
        Name: idfiltered[0].Name,
      };

      global.liveries.pull(idfiltered[0]);
      global.liveries.push(livobj2);
      global.save();
      global.markModified("liveries");
      let embedapprove = new Discord.EmbedBuilder()
        .setTitle(`Approved ${idtoapprove}`)
        .setImage(idfiltered[0].image)
        .setColor(colors.blue);
      let usertodm = await interaction.client.users.fetch(idfiltered[0].user);

      await interaction.reply({ embeds: [embedapprove] });
      usertodm.send(
        `Your recent livery for the ${
          cars.Cars[cartoapprove.toLowerCase()].Name
        } was approved! Use /livery Install [car] [id] to use it. The id is ${
          livobj2.id
        } ${idfiltered[0].image}`
      );
    } else if (subcommand == "list") {
      let lglobal = await Global.findOne({});
      var car = interaction.options.getString("car").toLowerCase();
      if (!car)
        return await interaction.reply(
          "Specify if you'd like to see the list of liveries (list), install a livery (install [id] [car]), uninstall your current livery (uninstall [car]), view a livery (view [id] [car]), or submit one for review (submit [car])."
        );
      if (!cars.Cars[car]) return await interaction.reply("Thats not a car!");
      let list = cars.Cars;
      if (!list[car])
        return await interaction.reply(
          "That isnt an available car yet! If you'd like to suggest it, use /suggest."
        );
      console.log(lglobal.liveries);
      let cardata = lglobal.liveries.filter(
        (livery) => livery.Name.toLowerCase() == car.toLowerCase()
      );

      let liveriesforcar = cardata;
      if (!liveriesforcar)
        return await interaction.reply(
          "This car doesn't have liveries yet, if you'd like to submit one, use /livery submit"
        );
      let liverylist = [];
      for (var i = 0; i < liveriesforcar.length; i++) {
        let actliv = liveriesforcar[i];
        liverylist.push(`${actliv.id}`);
        //Do something
      }
      let shopItems = cardata;
      if (!shopItems || !shopItems.length)
        return await interaction.reply(`This car doesn't have any liveries!`);
      shopItems = lodash.chunk(
        shopItems.map(() => `**${liverylist.join("\n")}**`)
      );

      const embed = new Discord.EmbedBuilder()
        .setTitle(`Liveries for ${cars.Cars[car].Name}`)
        .setDescription(
          `View using \`/liveryview [id] [car]\`\nSet using \`/liveryinstall [id] [car]\`\n${shopItems[0].join(
            "\n"
          )}`
        )
        .setFooter({ text: `Pages 1/${shopItems.length}` })
        .setThumbnail("https://i.ibb.co/Hq4p8bx/usedicon.png")
        .setColor(colors.blue)
        .setTimestamp();

      await interaction
        .reply({ embeds: [embed], fetchReply: true })
        .then(async (emb) => {
          ["⏮️", "◀️", "▶️", "⏭️", "⏹️"].forEach(
            async (m) => await emb.react(m)
          );

          const filter = (_, u) => u.id === interaction.user.id;
          const collector = emb.createReactionCollector({
            filter,
            time: 300000,
          });
          let page = 1;
          collector.on("collect", async (r, user) => {
            let current = page;
            emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
            if (r.emoji.name === "◀️" && page !== 1) page--;
            else if (r.emoji.name === "▶️" && page !== shopItems.length) page++;
            else if (r.emoji.name === "⏮️") page = 1;
            else if (r.emoji.name === "⏭️") page = shopItems.length;
            else if (r.emoji.name === "⏹️") return collector.stop();

            embed.setDescription(
              `View using \`/livery view [car] [livery id]\nSet using /livery install [car id] [livery id]\`\n${shopItems[
                page - 1
              ].join("\n")}`
            );

            if (current !== page) {
              embed.setFooter({ text: `Pages ${page}/${shopItems.length}` });
              interaction.editReply({ embeds: [embed] });
            }
          });
        });
    }
  },
};
