const db = require("quick.db");
const lodash = require("lodash");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const {
      //guild,
      member,
    } = message;

    let tasksdb = require("./data/tasks.json");
    let randomtask = lodash.sample(tasksdb.Daily);
    let randomtask2 = lodash.sample(tasksdb.Weekly);

    let timerfordaily = db.fetch(`dailytasktimer_${member.id}`);
    let timerforweekly = db.fetch(`weeklytasktimer_${member.id}`);

    let timeout = 86400000;
    let timeoutweek = 604800000;

    if (timeoutweek - (Date.now() - timerforweekly) > 0) {
      return;
    } else {
      db.set(`weeklytask_${member.id}`, {
        task: randomtask2.Task,
        user: member.id,
        completed: false,
        reward: randomtask2.Reward,
      });
      db.set(`weeklytasktimer_${member.id}`, Date.now());
    }
    if (timeout - (Date.now() - timerfordaily) > 0) {
      return;
    } else {
      db.set(`dailytask_${member.id}`, {
        task: randomtask.Task,
        user: member.id,
        completed: false,
        reward: randomtask.Reward,
      });
      db.set(`dailytasktimer_${member.id}`, Date.now());
    }
  });
};
