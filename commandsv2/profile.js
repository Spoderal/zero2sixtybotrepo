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
    let title = userdata.title;
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
    let pvprank = userdata.pvprank;
    let pvpname = pvprank.Rank || "Silver";

    let pvpindb = pvpranks[pvpname.toLowerCase()];

    let cash = userdata.cash;
    finalprice += cash;
    let profileimage =
      userdata.pbackground || "https://i.ibb.co/HxX0Q2z/profilepage.png";
    let acthelmet = profilepics.Pfps[helmet.toLowerCase()].Image;
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext("2d");
    const bg = await loadImage(profileimage);
    const helmetimg = await loadImage(acthelmet);
    const pvpimg = await loadImage(pvpindb.icon);
    let showcased = userdata.showcase;

    let achievements = userdata.achievements;

    await interaction.reply({ content: "Please wait...", fetchReply: true });

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    if (showcased) {
      let showcaseimg = await loadImage(showcased);

      ctx.drawImage(showcaseimg, 825, 440, 370, 180);
    }
    let filteredachrich = achievements.filter(
      (ach) => ach.name == "Rich" || ach.Name == "Rich"
    );
    let filteredachricher = achievements.filter(
      (ach) => ach.name == "Richer" || ach.Name == "Richer"
    );
    let filteredachrichest = achievements.filter(
      (ach) => ach.name == "Richest" || ach.Name == "Richest"
    );
    let filteredachbug = achievements.filter(
      (ach) => ach.name == "Bug Smasher" || ach.Name == "Bug Smasher"
    );
    let filteredachtime = achievements.filter(
      (ach) => ach.name == "Time Master" || ach.Name == "Time Master"
    );
    let filteredachspring = achievements.filter(
      (ach) => ach.name == "Spring S1" || ach.Name == "Spring S1"
    );
    let filteredachfuse = achievements.filter(
      (ach) => ach.name == "Fusion Master" || ach.Name == "Fusion Master"
    );
    let filteredachdrift = achievements.filter(
      (ach) => ach.name == "Drift King" || ach.Name == "Drift King"
    );

    if (filteredachrich[0]) {
      let achievement = filteredachrich[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 35, 400, 60, 60);
    }
    if (filteredachricher[0]) {
      let achievement = filteredachricher[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 100, 400, 60, 60);
    }
    if (filteredachrichest[0]) {
      let achievement = filteredachrichest[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 165, 400, 60, 60);
    }
    if (filteredachbug[0]) {
      let achievement = filteredachbug[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 230, 400, 60, 60);
    }
    if (filteredachtime[0]) {
      let achievement = filteredachtime[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 295, 400, 60, 60);
    }

    if (filteredachfuse[0]) {
      let achievement = filteredachfuse[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 355, 400, 60, 60);
    }
    if (filteredachdrift[0]) {
      let achievement = filteredachdrift[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 420, 400, 60, 60);
    }
    if (filteredachspring[0]) {
      let achievement = filteredachspring[0];
      console.log(achievement);
      let achimg = await loadImage(
        achievementsdb.Achievements[achievement.name.toLowerCase()].Image
      );

      ctx.drawImage(achimg, 35, 625, 60, 60);
    }
    ctx.drawImage(helmetimg, 35, 35, 250, 250);
    ctx.drawImage(pvpimg, 355, 185, 60, 60);
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(title, 470, 50);
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(user.username, 355, 135);

    ctx.font = "bold 28px sans-serif";
    ctx.fillText(driftrank, 940, 160);
    ctx.fillText(racerank, 940, 215);
    ctx.fillText(prestige, 915, 270);
    ctx.fillText(tier, 855, 328);

    ctx.font = "bold 25px sans-serif";

    ctx.fillText(toCurrency(finalprice), 900, 680);
    ctx.font = "bold 35px sans-serif";

    ctx.fillText(pvprank.Wins, 430, 227);
    let attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), {
      name: "profile-image.png",
    });

    await interaction.editReply({
      content: "",
      fetchReply: true,
      files: [attachment],
    });
  },
};
function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
