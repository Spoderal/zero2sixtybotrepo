const User = require("../schema/profile-schema");
const { EmbedBuilder } = require("discord.js");

function userGetPatreonTimeout(userdata) {
  if (userdata.patron && userdata.patron.tier == 1) return 30000;
  else if (userdata.patron && userdata.patron.tier == 2) return 15000;
  else if (userdata.patron && userdata.patron.tier == 3) return 5000;
  else if (userdata.patron && userdata.patron.tier == 4) return 5000;
  else return 45000;
}

function userGetFromInteraction(interaction) {
  return interaction?.options?.getUser("user") || interaction?.user;
}

async function userFindOrCreateInDB(user) {
  const userFromDB = await User.findOne({ id: user.id });

  if (userFromDB) return userFromDB;
  else return new User({ id: user.id });
}

async function blacklistInteractionCheck(userdata, interaction) {
  let user = await userFindOrCreateInDB(userdata);
  if (user.blacklist) {
    const blacklistEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`You have been __**blacklisted**__ from the bot.`)
      .addFields(
        { name: "Reason:", value: user.blacklist.reason },
        { name: "Staff", value: user.blacklist.blacklister },
        {
          name: "Appeal",
          value: "You can apply here: https://discord.gg/quhZW95DYx",
        }
      )
      .setTimestamp()
      .setFooter({
        text: "Zero2Sixty",
        iconURL:
          "https://cdn.discordapp.com/avatars/932455367777067079/4f3488204b720ae817770ed61ab6226a.png?size=4096",
      });

    await interaction.reply({ embeds: [blacklistEmbed], ephemeral: 1 });
    return 1;
  }
  return 0;
}

async function blacklistCheck(userdata) {
  let user = await userFindOrCreateInDB(userdata);
  if (user.blacklist) {
    return {
      blacklist: 1,
      reason: user.blacklist.reason,
      staff: user.blacklist.blacklister,
    };
  } else {
    return {
      blacklist: 0,
    };
  }
}

module.exports = {
  userGetPatreonTimeout,
  userGetFromInteraction,
  userFindOrCreateInDB,
  blacklistInteractionCheck,
  blacklistCheck,
};
