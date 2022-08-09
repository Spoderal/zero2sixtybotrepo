const User = require("../schema/profile-schema");

function getUserFromInteraction(interaction) {
  return interaction?.options?.getUser("user") || interaction?.user;
}

async function findOrCreateUserInDB(user) {
  const userFromDB = await User.findOne({ id: user.id });

  // User was found, return
  if (userFromDB) {
    console.log("Found user in db: ", { userFromDB });
    return userFromDB;
  }
  // No user found, create a new one
  else {
    console.log("No user in db: ", { user });
    return new User({ id: user.id });
  }
}

module.exports = {
  getUserFromInteraction,
  findOrCreateUserInDB,
};
