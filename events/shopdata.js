const cardb = require("../data/cardb.json");
const itemdb = require("../data/items.json");
const partdb = require("../data/partsdb.json").Parts;
const Global = require("../schema/global-schema");
let array = [];
let array2 = [];

async function cardata() {
  let global = await Global.findOne({});

  for (let car in cardb.Cars) {
    let carindb = cardb.Cars[car];
    if (carindb.Price > 0) {
      if (!global.shopitems.includes(carindb.Name)) {
        global.shopitems.push(carindb.Name);
      }
    }
  }

  for (let part in partdb) {
    let partindb = partdb[part];

    if (partindb.Price > 0) {
      if (!global.shopitems.includes(partindb.Name)) {
        global.shopitems.push(partindb.Name);
      }
    }
  }

  for (let item in itemdb) {
    let itemindb = itemdb[item];

    if (itemindb.Shop == true) {
      if (!global.shopitems.includes(itemindb.Name)) {
        global.shopitems.push(itemindb.Name);
      }
    }
  }

  try {
    global.save();

  } catch (err){
    console.log(err)
  }
}

cardata();

exports.shopitems = array2;
exports.cars = array;
