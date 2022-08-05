const db = require("quick.db");
const { DateTime } = require("luxon");

module.exports = (client) => {
  client.on("messageCreate", async () => {
    var myDate = DateTime.now();

    let day = myDate.weekday;

    if (day == 6 || day == 7) {
      db.set(`doublecash`, true);
    } else {
      db.set(`doublecash`, false);
    }
  });
};
