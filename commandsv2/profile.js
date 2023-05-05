const Discord = require("discord.js");
const profilepics = require("../data/pfpsdb.json");
const cardb = require("../data/cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const achievementsdb = require("../data/achievements.json");
const pvpranks = require("../data/ranks.json");
const titledb = require("../data/titles.json");
const emotes = require("../common/emotes").emotes
const jobdb = require("../data/jobs.json")

const { createCanvas, loadImage } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("View the profile of another user")
        .setRequired(false)
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let helmet = userdata.helmet || "default";
    let title = userdata.title || "noob racer";
    if (!title || title == null || title == undefined) {
      title = "noob racer";
    }
    console.log(title);
    let driftrank = userdata.driftrank;
    let racerank = userdata.racerank;
    let prestige = userdata.prestige;
    let tier = userdata.tier;
    let cars = userdata.cars;
    let finalprice = 0;

    for (let car in cars) {
      let car2 = cars[car];
      let price = cardb.Cars[car2.Name.toLowerCase()]?.Price;
      if (price) finalprice += Number(price);

    }

    let carsort = cars.sort(function(a, b){return b.Speed-a.Speed});
    let fastcar = carsort[0]


    let pvprank = userdata.pvprank 
    let pvpname = pvprank.Rank || "Silver";

    if(pvpname == undefined){
      pvpname = "Silver"
    }
    let jobemote = ""
    

    let pvpindb = pvpranks[pvpname.toLowerCase()];
    let achievements = userdata.achievements
    let userjob = userdata.work || {name: 'No Job', position: 'No Position'}

    if(userjob.name !== 'No Job'){
      let userjobfilter = jobdb[userjob.name.toLowerCase()]
      let positionfilter = userjobfilter.Positions.filter(
        (pos) => pos.name.toLowerCase() == userjob.position.toLowerCase()
      );
      jobemote = positionfilter[0].emote
    }
    let achivarr = []
    for(let ach in achievements){
      let achiev = achievements[ach]
      let achindb = achievementsdb.Achievements[achiev.name.toLowerCase()]
      achivarr.push(`${achindb.Emote}`)
    }
    let cash = userdata.cash;
    finalprice += cash;

    let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image;
    let showcase = userdata.showcase 

    let embed = new Discord.EmbedBuilder()
    .setTitle(title)
    .setAuthor({name: user.username, iconURL: acthelmet})
    .setDescription(
      `
      <:rank_race:1103913420320944198> Race Rank: ${racerank}\n
      <:rank_drift:1103913418567712818> Drift Rank: ${driftrank}\n
      <:rank_prestige:1103914107461181530> Prestige: ${prestige}\n
      ${pvpindb.emote} PVP Rank: ${pvpname} ${pvprank.Wins}\n
      **Tier**: ${tier}
      `
    )
    .addFields(
      {
        name: "Achievements",
        value: `${achivarr.join(" ")}`,
        inline: true
      },
      {
        name: "Job",
        value: `
       ${jobemote} __${userjob.name}__
        ${userjob.position}
        `,
        inline: true
      },
      {
        name: "Best Car",
        value:`
        **${fastcar.Emote} ${fastcar.Name}**
        ${emotes.speed} ${fastcar.Speed}
        ${emotes.zero2sixty} ${fastcar.Acceleration}s
        ${emotes.handling} ${fastcar.Handling}
        ${emotes.weight} ${fastcar.WeightStat}
        `,
        inline: true
      },
      {
        name: "Networth",
        value: `
       ${toCurrency(finalprice)}
        `
      },
      
    )
    .setColor(`${colors.blue}`)
    .setThumbnail(showcase)
    
    await interaction.reply({embeds: [embed]})
  },
};
