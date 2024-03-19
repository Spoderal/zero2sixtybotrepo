

const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");
const cardb = require("../data/cardb.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prestige")
    .setDescription("Prestige your rank, this will reset your cash.")
    .addSubcommand((subcommand) => subcommand
    .setName("car")
    .setDescription("Prestige your car to X Class")
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car to prestige")
    .setRequired(true)
    )
    )
    .addSubcommand((subcommand) => subcommand
    .setName("rank")
    .setDescription("Prestige your rank, this will reset your cash.")
    ),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let subcommand = interaction.options.getSubcommand();

    if(subcommand == "rank"){

    

    let skillrank = userdata.skill;
    let prestigerank = userdata.prestige;


    let oldrank = userdata.prestige;
    let newprestige2 = (prestigerank += 1);
    let prestigereq = newprestige2 * 100
    if (skillrank < prestigereq)
      return await interaction.reply(
        `Your skill rank needs to be ${prestigereq}!`
      );
    let row = new ActionRowBuilder().setComponents(
      new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle("Success")
    );

    let msg = await interaction.reply({
      content: `Are you sure? Your skill rank will be set to 0`,
      fetchReply: true,
      components: [row],
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "yes") {
        let prestigetoadd = 1
        if(userdata.items.includes("cheese")){
          prestigetoadd = 2
          let items = userdata.items
          for (var i7 = 0; i7 < 1; i7++) {items.splice(items.indexOf("cheese"), 1)}
          userdata.items = items;
        }
        userdata.prestige += prestigetoadd;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              skill: 0,
            },
          }
        );
   
        


        userdata.swheelspins += 1;

        userdata.items.push("prestige crate");
      

        userdata.save();
        
        let newrank = oldrank + prestigetoadd;
        let embed = new EmbedBuilder()
          .setTitle("Prestiged")
          .setDescription(
            `+1 <:supplydropprestige:1044404462581719041> Prestige Crate\n
            +1 ${emotes.superWheel} Super Wheel Spin\n`
          )
          .addFields(
            {
              name: `${emotes.prestige} Old Rank`,
              value: `${oldrank}`,
            },
            {
              name: `${emotes.prestige} New Rank`,
              value: `${newrank}`,
            }
          )
          .setColor(colors.blue);

        await interaction.editReply({
          embeds: [embed],
          fetchReply: true,
          components: [],
          content: "",
        });
      }
    });
  }
  else if(subcommand == "car"){
    let prestige = userdata.prestige;
    if(prestige < 2) return await interaction.reply("You need prestige 2 to prestige a car to X Class!");
    let car = interaction.options.getString("car");
    let carindb = await userdata.cars.find((car2) => car2.ID.toLowerCase() == car.toLowerCase());
    if (!carindb) return await interaction.reply("You don't have this car!");
    let carobj = carindb;
    
    let xessence = carindb.Xessence || 0

    let classxessencerequired = {
      "D": 1000,
      "C": 2000,
      "B": 3000,
      "A": 4000,
      "S": 5000
    }
    let carclass = cardb.Cars[carobj.Name.toLowerCase()].Class;

    let xessenceneeded = classxessencerequired[carclass]

    if(xessence < xessenceneeded){
      return await interaction.reply(`You need ${xessenceneeded} Xessence to prestige this car to X Class!`);
    }

    if(carobj.Class == "X") return await interaction.reply("This car is already X Class!");

    let oldspeed = carobj.Speed;
    let oldacc = carobj.Acceleration;
    let oldhandling = carobj.Handling;

    carobj.Class = "X";
    carobj.Speed = oldspeed + (oldspeed * 0.25);
    if(carobj.Acceleration > 1.5){
      carobj.Acceleration =  oldacc - 0.5

    }
    carobj.Handling = oldhandling + (oldhandling * 0.25);

    await User.findOneAndUpdate(
      {
        id: interaction.user.id,
      },
      {
        $set: {
          "cars.$[car]": carobj,
        },
      },

      {
        arrayFilters: [
          {
            "car.Name": carobj.Name,
          },
        ],
      }
    );

    userdata.xess -= xessenceneeded;

    userdata.save();

    await interaction.reply(`Prestiged ${cardb.Cars[carobj.Name.toLowerCase()].Emote} ${carobj.Name} to X Class!`);

  }
  },
};
