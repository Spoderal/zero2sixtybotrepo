

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const globalSchema = require("../schema/global-schema");
const emotes = require("../common/emotes").emotes;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your ranks"),
  async execute(interaction) {
    let user = interaction.user;
    let userdata = await User.findOne({ id: user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let prestigerank = userdata.prestige;
    let skill = userdata.skill;
    let xp = userdata.xp;
    let rpbonus = 0;
    let globals = await globalSchema.findOne();
    let crews = globals.crews;

    let usercrew = userdata.crew;

    if (usercrew) {
      let crew = crews.filter((cre) => cre.name == usercrew.name);

      let timeout = 14400000;
      let timeout2 = 7200000;
      let timeout3 = 3600000;

      if (
        crew[0] && crew[0].Cards && crew[0].Cards[0].time !== null &&
        timeout - (Date.now() - crew[0].Cards[0].time) < 0
      ) {
        console.log("no card");
      } else {
        rpbonus + 0.2;
      }

      if (
        crew[0] && crew[0].Cards && crew[0].Cards[1].time !== null &&
        timeout2 - (Date.now() - crew[0].Cards[1].time) < 0
      ) {
        console.log("no card");
      } else {
        rpbonus + 0.5;
      }

      if (
        crew[0] && crew[0].Cards && crew[0].Cards[2].time !== null &&
        timeout3 - (Date.now() - crew[0].Cards[2].time) < 0
      ) {
        console.log("no card");
      } else {
        rpbonus + 1.2;
      }
    }

    if (userdata.using.includes("radio")) {
      rpbonus + 0.5;
    }

    if (userdata.using.includes("energy drink")) {
      rpbonus + 0.1;
    }

    if (userdata.using.includes("energy drink")) {
      rpbonus + 0.1;
    }

    console.log(rpbonus);

    rpbonus += prestigerank / 100;
    console.log(rpbonus);
    let rounded = Math.round(rpbonus * 100);


    let required2 = skill * 100

    let xpbarstart = "<:xpbar_start:1207122645208932382>"
    let xpbarmiddle = "<:xpbar_middle:1207122643170623540>"
    let xpbarend = "<:xpbar_end_empty:1207134135551008848>"

    let xpbarstart_empty = "<:xpbar_start_empty:1207134134338588752>"
    let xpbarmiddle_empty = "<:xpbar_middle_empty:1207134132874776596>"


    const totalBars = 10;
    const filledBars = Math.round((xp / required2) * totalBars);
    const emptyBars = totalBars - filledBars;
    let filledstart = `${xpbarstart_empty}`
    if(filledBars > 1){
      filledstart = `${xpbarstart}`
    }
    const xpBar = `${filledstart}` + `${xpbarmiddle}`.repeat(filledBars) + `${xpbarmiddle_empty}`.repeat(emptyBars) + xpbarend;

    let ranks = `${emotes.prestige} **Prestige**: ${prestigerank}\n` + `${emotes.rank} Skill Rank: ${skill}\n` + `${emotes.rp} RP Bonus: ${rounded}%\n` + `${xpBar} ${xp}/${required2}`
    let embed = new Discord.EmbedBuilder()
      .setTitle(`${user.username}'s ranks`)
      .setDescription(
        `
        ${ranks}
        `
      )

      .setColor(colors.blue);

    await interaction.reply({ embeds: [embed] });
  },
};
