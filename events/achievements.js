const User = require(`../schema/profile-schema`);
const achievementdb = require("../data/achievements.json")

async function achievements(interaction) {
  let userdata = await User.findOne({ id: interaction.user.id });
  let achievementsearned = []
  let gotachievement = false
  let ach1 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["rich"].Name)
  if (userdata.cash >= 100000 && ach1.length <= 0) {
    achievementsearned.push(`You just earned the ${achievementdb.Achievements.rich.Emote} Rich achievement!`)
    gotachievement = true
    userdata.achievements.push({
      name: achievementdb.Achievements["rich"].Name,
      id: achievementdb.Achievements["rich"].Name.toLowerCase(),
      completed: true,
    });
  }
  let ach2 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["richer"].Name)
  if (userdata.cash >= 1000000 && ach2.length <= 0) {
    achievementsearned.push(`You just earned the ${achievementdb.Achievements.richer.Emote} Richer achievement!`)
    gotachievement = true
    userdata.achievements.push({
      name: achievementdb.Achievements["richer"].Name,
      id: achievementdb.Achievements["richer"].Name.toLowerCase(),
      completed: true,
    });
  }
  let ach3 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["richest"].Name)
  if (userdata.cash >= 1000000000 && ach3.length <= 0) {
    achievementsearned.push(`You just earned the ${achievementdb.Achievements.richest.Emote} Richest achievement!`)
    gotachievement = true
    userdata.achievements.push({
      name: achievementdb.Achievements["richest"].Name,
      id: achievementdb.Achievements["richest"].Name.toLowerCase(),
      completed: true,
    });
}
let cars = userdata.cars.length += userdata.vault.length
let ach4 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["basic collector"].Name)
if (cars >= 50 && ach4.length <= 0) {
  achievementsearned.push(`You just earned the ${achievementdb.Achievements["basic collector"].Emote} Basic Collector achievement!`)
  gotachievement = true
  userdata.achievements.push({
    name: achievementdb.Achievements["basic collector"].Name,
    id: achievementdb.Achievements["basic collector"].Name.toLowerCase(),
    completed: true,
  });
}
let ach5 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["advanced collector"].Name)
if (cars >= 100 && ach5.length <= 0) {
  achievementsearned.push(`You just earned the ${achievementdb.Achievements["advanced collector"].Emote} Advanced Collector achievement!`)
  gotachievement = true
  userdata.achievements.push({
    name: achievementdb.Achievements["advanced collector"].Name,
    id: achievementdb.Achievements["advanced collector"].Name.toLowerCase(),
    completed: true,
  });
}
let ach6 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["master collector"].Name)
if (cars >= 200 && ach6.length <= 0) {
  achievementsearned.push(`You just earned the ${achievementdb.Achievements["master collector"].Emote} Master Collector achievement!`)
  gotachievement = true
  userdata.achievements.push({
    name: achievementdb.Achievements["master collector"].Name,
    id: achievementdb.Achievements["master collector"].Name.toLowerCase(),
    completed: true,
  });
}
let ach7 = userdata.achievements.filter((ach) => ach.name == achievementdb.Achievements["grand master collector"].Name)
if (cars >= 500 && ach7.length <= 0) {
  achievementsearned.push(`You just earned the ${achievementdb.Achievements["grand master collector"].Emote} Grand Master Collector achievement!`)
  gotachievement = true
  userdata.achievements.push({
    name: achievementdb.Achievements["grand master collector"].Name,
    id: achievementdb.Achievements["grand master collector"].Name.toLowerCase(),
    completed: true,
  });
}

console.log(gotachievement)
if(gotachievement == true){
    await interaction.channel.send({ content: achievementsearned.join("\n") });
    await userdata.save()
  return
}
}

module.exports = {
  achievements,
};
