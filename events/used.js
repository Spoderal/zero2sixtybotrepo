const Global = require(`../schema/global-schema`);
const lodash = require("lodash");
const npcs = require("../data/npcs.json");
const cardb = require("../data/cardb.json");
const { randomRange } = require("../common/utils");
async function updateUsed() {
  let global = await Global.findOne();
  let itemcooldown = global.usedcooldown;
  let items = [];
  let timeout = 604800000;
  let itemshopalr = global.usedcars;
  setInterval(async () => {
    if (itemshopalr.length == 0) {
      items = [];
      let itemarr = [];
      for (let i in npcs) {
        itemarr.push(npcs[i]);
      }

      let npc1 = npcs.jerry;
      let npc2 = npcs.larry;
      let npc3 = npcs.gary;
      let npc4 = npcs.mary;

      let randnpc1 = lodash.sample(npc1.cars);
      let randnpc2 = lodash.sample(npc2.cars);
      let randnpc3 = lodash.sample(npc3.cars);
      let randnpc4 = lodash.sample(npc4.cars);

      let car1 = cardb.Cars[randnpc1.toLowerCase()];
      let car2 = cardb.Cars[randnpc2.toLowerCase()];
      let car3 = cardb.Cars[randnpc3.toLowerCase()];
      let car4 = cardb.Cars[randnpc4.toLowerCase()];

      let price1 = randomRange(car1.LowPrice, car1.HighPrice);
      let price2 = randomRange(car2.LowPrice, car2.HighPrice);
      let price3 = randomRange(car3.LowPrice, car3.HighPrice);
      let price4 = randomRange(car4.LowPrice, car4.HighPrice);

      let deal1 = lodash.sample(npc1.deals);
      let deal2 = lodash.sample(npc2.deals);
      let deal3 = lodash.sample(npc3.deals);
      let deal4 = lodash.sample(npc4.deals);

      if (deal1 == true) {
        let deal = randomRange(1, 10000);
        price1 -= deal;
      }
      if (deal2 == true) {
        let deal = randomRange(1, 10000);
        price2 -= deal;
      }
      if (deal3 == true) {
        let deal = randomRange(1, 10000);
        price3 -= deal;
      }
      if (deal4 == true) {
        let deal = randomRange(1, 10000);
        price4 -= deal;
      }

      let randomspeedp = randomRange(0, 5);
      let randomspeedp2 = randomRange(0, 5);
      let randomspeedp3 = randomRange(0, 5);
      let randomspeedp4 = randomRange(0, 5);

      let randomspeeds = randomRange(0, 5);
      let randomspeeds2 = randomRange(0, 5);
      let randomspeeds3 = randomRange(0, 5);
      let randomspeeds4 = randomRange(0, 5);

      let speed1 = car1.Speed;
      let speed2 = car2.Speed;
      let speed3 = car3.Speed;
      let speed4 = car4.Speed;

      speed1 -= randomspeedp;
      speed2 -= randomspeedp2;
      speed3 -= randomspeedp3;
      speed4 -= randomspeedp4;

      speed1 += randomspeeds;
      speed2 += randomspeeds2;
      speed3 += randomspeeds3;
      speed4 += randomspeeds4;

      let carobj1 = {
        ID: car1.alias,
        Name: car1.Name,
        Speed: speed1,
        Acceleration: car1["0-60"],
        Handling: car1.Handling,
        Parts: [],
        Emote: car1.Emote,
        Livery: car1.Image,
        Miles: 0,
        Weight: car1.Weight,
        Price: price1,
        NPC: npc1,
      };

      let carobj2 = {
        ID: car2.alias,
        Name: car2.Name,
        Speed: speed2,
        Acceleration: car2["0-60"],
        Handling: car2.Handling,
        Parts: [],
        Emote: car2.Emote,
        Livery: car2.Image,
        Miles: 0,
        Weight: car2.Weight,
        Price: price2,
        NPC: npc2,
      };

      let carobj3 = {
        ID: car3.alias,
        Name: car3.Name,
        Speed: speed3,
        Acceleration: car3["0-60"],
        Handling: car3.Handling,
        Parts: [],
        Emote: car3.Emote,
        Livery: car3.Image,
        Miles: 0,
        Weight: car3.Weight,
        Price: price3,
        NPC: npc3,
      };

      let carobj4 = {
        ID: car4.alias,
        Name: car4.Name,
        Speed: speed4,
        Acceleration: car4["0-60"],
        Handling: car4.Handling,
        Parts: [],
        Emote: car4.Emote,
        Livery: car4.Image,
        Miles: 0,
        Weight: car4.Weight,
        Price: price4,
        NPC: npc4,
      };

      items.push(carobj1);
      items.push(carobj2);
      items.push(carobj3);
      items.push(carobj4);

      global.usedcars = items;
      global.usedcooldown = Date.now();
      global.markModified("usedcars");
      global.updateOne("usedcars");
      global.save();
    } else {
      if (itemcooldown !== null && timeout - (Date.now() - itemcooldown) < 0) {
        items = [];
        let itemarr = [];
        for (let i in npcs) {
          itemarr.push(npcs[i]);
        }

        let npc1 = npcs.jerry;
        let npc2 = npcs.larry;
        let npc3 = npcs.gary;
        let npc4 = npcs.mary;

        let randnpc1 = lodash.sample(npc1.cars);
        let randnpc2 = lodash.sample(npc2.cars);
        let randnpc3 = lodash.sample(npc3.cars);
        let randnpc4 = lodash.sample(npc4.cars);

        let car1 = cardb.Cars[randnpc1.toLowerCase()];
        let car2 = cardb.Cars[randnpc2.toLowerCase()];
        let car3 = cardb.Cars[randnpc3.toLowerCase()];
        let car4 = cardb.Cars[randnpc4.toLowerCase()];

        let price1 = randomRange(car1.LowPrice, car1.HighPrice);
        let price2 = randomRange(car2.LowPrice, car2.HighPrice);
        let price3 = randomRange(car3.LowPrice, car3.HighPrice);
        let price4 = randomRange(car4.LowPrice, car4.HighPrice);

        let deal1 = lodash.sample(npc1.deals);
        let deal2 = lodash.sample(npc2.deals);
        let deal3 = lodash.sample(npc3.deals);
        let deal4 = lodash.sample(npc4.deals);

        if (deal1 == true) {
          let deal = randomRange(1, 10000);
          price1 -= deal;
        }
        if (deal2 == true) {
          let deal = randomRange(1, 10000);
          price2 -= deal;
        }
        if (deal3 == true) {
          let deal = randomRange(1, 10000);
          price3 -= deal;
        }
        if (deal4 == true) {
          let deal = randomRange(1, 10000);
          price4 -= deal;
        }

        let randomspeedp = randomRange(0, 5);
        let randomspeedp2 = randomRange(0, 5);
        let randomspeedp3 = randomRange(0, 5);
        let randomspeedp4 = randomRange(0, 5);

        let randomspeeds = randomRange(0, 5);
        let randomspeeds2 = randomRange(0, 5);
        let randomspeeds3 = randomRange(0, 5);
        let randomspeeds4 = randomRange(0, 5);

        let speed1 = car1.Speed;
        let speed2 = car2.Speed;
        let speed3 = car3.Speed;
        let speed4 = car4.Speed;

        speed1 -= randomspeedp;
        speed2 -= randomspeedp2;
        speed3 -= randomspeedp3;
        speed4 -= randomspeedp4;

        speed1 += randomspeeds;
        speed2 += randomspeeds2;
        speed3 += randomspeeds3;
        speed4 += randomspeeds4;

        let carobj1 = {
          ID: car1.alias,
          Name: car1.Name,
          Speed: speed1,
          Acceleration: car1["0-60"],
          Handling: car1.Handling,
          Parts: [],
          Emote: car1.Emote,
          Livery: car1.Image,
          Miles: 0,
          Weight: car1.Weight,
          Price: price1,
          NPC: npc1,
        };

        let carobj2 = {
          ID: car2.alias,
          Name: car2.Name,
          Speed: speed2,
          Acceleration: car2["0-60"],
          Handling: car2.Handling,
          Parts: [],
          Emote: car2.Emote,
          Livery: car2.Image,
          Miles: 0,
          Weight: car2.Weight,
          Price: price2,
          NPC: npc2,
        };

        let carobj3 = {
          ID: car3.alias,
          Name: car3.Name,
          Speed: speed3,
          Acceleration: car3["0-60"],
          Handling: car3.Handling,
          Parts: [],
          Emote: car3.Emote,
          Livery: car3.Image,
          Miles: 0,
          Weight: car3.Weight,
          Price: price3,
          NPC: npc3,
        };

        let carobj4 = {
          ID: car4.alias,
          Name: car4.Name,
          Speed: speed4,
          Acceleration: car4["0-60"],
          Handling: car4.Handling,
          Parts: [],
          Emote: car4.Emote,
          Livery: car4.Image,
          Miles: 0,
          Weight: car4.Weight,
          Price: price4,
          NPC: npc4,
        };

        items.push(carobj1);
        items.push(carobj2);
        items.push(carobj3);
        items.push(carobj4);

        global.usedcars = items;
        global.usedcooldown = Date.now();
        global.markModified("usedcars");
        global.updateOne("usedcars");
        global.save();
      }
    }
  }, 60000);
}

module.exports = {
  updateUsed,
};
