const items = require("./data/items.json");
const policeitems = items.Police;
const otheritems = items.Other;

const lodash = require("lodash");
const db = require("quick.db");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    let energytimer = db.fetch(`energytimer_${message.author.id}`);
    if (energytimer) {
      let timeout = 600000;
      if (timeout - (Date.now() - energytimer) > 0) {
        return;
      } else {
        db.set(`energytimer_${message.author.id}`, false);
      }
    }
    let sponsor = db.fetch(`sponsor_${message.author.id}`);
    let sponsortimer = db.fetch(`sponsortimer_${message.author.id}`);
    if (sponsor) {
      let timeout = 600000;
      if (timeout - (Date.now() - sponsortimer) > 0) {
        console.log("no energy");
      } else {
        db.set(`sponsor_${message.author}`, false);
      }
    }

    let itemshop = db.fetch(`itemshop`);
    if (!itemshop) {
      let randompolice = lodash.sample(policeitems);
      let randomother1 = lodash.sample(otheritems);
      let randomother2 = lodash.sample(otheritems);
      let randomother3 = lodash.sample(otheritems);

      if (randomother1 == randomother2) {
        randomother2 = lodash.sample(otheritems);
      }
      if (randomother2 == randomother3) {
        randomother3 = lodash.sample(otheritems);
      }
      db.set(`itemcooldown`, Date.now());

      db.set(`itemshop`, {
        Police: randompolice,
        Other: randomother1,
        Other2: randomother2,
        Other3: randomother3,
      });
    } else {
      let cooldown = db.fetch("itemcooldown");
      let timeout = 86400000;
      if (timeout - (Date.now() - cooldown) > 0) {
        return;
      } else {
        let randompolice = lodash.sample(policeitems);
        let randomother1 = lodash.sample(otheritems);
        let randomother2 = lodash.sample(otheritems);
        let randomother3 = lodash.sample(otheritems);

        if (randomother1 == randomother2) {
          randomother2 = lodash.sample(otheritems);
        }
        if (randomother2 == randomother3) {
          randomother3 = lodash.sample(otheritems);
        }
        db.set(`itemcooldown`, Date.now());
        db.set(`itemshop`, {
          Police: randompolice,
          Other: randomother1,
          Other2: randomother2,
          Other3: randomother3,
        });
        db.set(`bought_bank increase_${message.author.id}`, 0);
      }
    }
  });
};
