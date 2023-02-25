const User = require("../schema/profile-schema");

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

module.exports = {
  userGetPatreonTimeout,
  userGetFromInteraction,
  userFindOrCreateInDB,
};
