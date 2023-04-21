const Stats = require(`../schema/stats`);
async function stats(client) {
  let global = await Stats.findOne({});
  let users = client.guilds.cache.size;

  setInterval(() => {
    global.users = users;
    global.update();
    global.save();
    console.log("done");
  }, 60000);
}

module.exports = {
  stats,
};
