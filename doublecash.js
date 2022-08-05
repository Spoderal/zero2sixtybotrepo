const db = require("quick.db");
const discord = require("discord.js");
const lodash = require("lodash");
const { DateTime } = require("luxon");
module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    var myDate = DateTime.now();

    let day = myDate.weekday;

    if (day == 6 || day == 7) {
      db.set(`doublecash`, true);
    } else {
      db.set(`doublecash`, false);
    }
  });
};
