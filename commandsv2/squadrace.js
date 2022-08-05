const discord = require("discord.js");
const squads = require("../data/squads.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("squadrace")
    .setDescription("Race a squad")
    .addStringOption((option) =>
      option.setName("id").setDescription("The car id to use").setRequired(true)
    ),
  async execute(interaction) {
    const cars = require("../data/cardb.json");

    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    let idtoselect = interaction.options.getString("id");
    let tier = userdata.tier || 1;
    let stage = userdata.stage || 0;

    let squad;
    let botcar;

    switch (tier) {
      case 1:
        squad = "flame house";
        botcar = squads.Squads["flame house"].Cars[stage];
        console.log(botcar);

        break;
    }
    let semote = "<:speedometer3:1002856993075249162>";
    let hemote = "<:handling:983963211403505724>";
    let aemote = "<:zerosixtyemote:983963210304614410>";

    let filteredcar = userdata.cars.filter((car) => car.ID == idtoselect);
    console.log(filteredcar);
    let selected = filteredcar[0] || "No ID";
    if (selected == "No ID") {
      let errembed = new discord.MessageEmbed()
        .setTitle("Error!")
        .setColor("DARK_RED")
        .setDescription(
          `That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`
        );
      return interaction.reply({ embeds: [errembed] });
    }

    let squadcar = cars.Cars[botcar.toLowerCase()];
    let u1speed = Number(selected.Speed);
    let u1acc = Number(selected.Acceleration);
    let u1handling = Number(selected.Handling);
    let sqspeed = Number(squadcar.Speed);
    let sqacc = Number(squadcar["0-60"]);
    let sqhandling = Number(squadcar.Handling);

    let embed = new discord.MessageEmbed()
      .setTitle(`Squad race in progress...`)
      .setThumbnail(squads.Squads[squad].Icon)
      .setColor("#60b0f4")
      .addField(
        `${selected.Emote} ${selected.Name}`,
        `
    ${semote} Speed: ${u1speed} MPH\n
    ${aemote} 0-60: ${u1acc}s\n
    ${hemote} Handling: ${u1handling}\n

    
    `,
        true
      )
      .addField(
        `${squadcar.Emote} ${squadcar.Name}`,
        `
    ${semote} Speed: ${sqspeed} MPH\n
    ${aemote} 0-60: ${sqacc}s\n
    ${hemote} Handling: ${sqhandling}\n

    
    `,
        true
      );

    interaction.reply({ embeds: [embed] });

    let formula1 = u1speed / 1.5;

    formula1 += u1handling / u1acc;

    let formula2 = sqspeed / 1.5;

    formula2 += sqhandling / u1acc;

    let track1 = 0;
    let track2 = 0;

    let x = setInterval(() => {
      track1 += formula1;
      track2 += formula2;
      console.log(`1: ${track1}`);
      console.log(`2: ${track2}`);
    }, 1000);

    setTimeout(() => {
      if (track1 >= track2) {
        embed.setTitle(`Squad race won!`);
        userdata.stage += 1;
        userdata.update();
        let newstage = userdata.stage;
        if (newstage >= 5) {
          userdata.tier += 1;
          userdata.stage = 0;
          interaction.channel.send(`Advanced a tier!`);
        }

        userdata.save();

        interaction.editReply({ embeds: [embed] });
        clearInterval(x);
        return;
      }
      return;
    }, 5000);
  },
};
