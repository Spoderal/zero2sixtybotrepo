const User = require("../schema/profile-schema");

function getUserFromInteraction(interaction) {
  return interaction?.options?.getUser("user") || interaction?.user;
}

async function findOrCreateUserInDB(user) {
  const userFromDB = await User.findOne({ id: user.id });

  if (userFromDB) return userFromDB;
  else return new User({ id: user.id });
}

module.exports = {
  getUserFromInteraction,
  findOrCreateUserInDB,
};
