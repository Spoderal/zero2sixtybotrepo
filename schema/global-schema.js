const mongoose = require("mongoose");

const Global = new mongoose.Schema({
  crews: {
    type: Array,
    required: false,
    default: [],
  },
  itemshop: {
    type: Array,
    required: false,
    default: [],
  },
  double: {
    type: Boolean,
    required: false,
    default: false,
  },
  itemshopcooldown: {
    type: Number,
    required: false,
    default: 0,
  },
  botcolor: {
    type: String,
    required: false,
    default: "#60b0f4",
  },
  zeroplus: {
    type: Array,
    required: false,
    default: [],
  },
  trialtimes: {
    type: Array,
    required: false,
    default: [],
  },
  market: {
    type: Array,
    required: false,
    default: [],
  },
  newmarket: {
    type: Array,
    required: false,
    default: [],
  },
  marketId: {
    type: Number,
    required: false,
    default: 0,
  },
  pvpqueue: {
    type: Array,
    required: false,
    default: [],
  },
  stock:{
    type: Object,
    required: false,
    default: {
      "2019 apollo ie": {
        "alias": "2019 ie",
        "Name": "2019 Apollo IE",
        "Emote": "<:apollo:1066081882896351332>",
        "Speed": 232,
        "Price": 20000000,
        "sellprice": 0,
        "Engine": "2.9 L twin-turbocharged V8",
        "Image": "https://www.miamilusso.com/wp-content/uploads/2018/12/apollo-2-1024x576.jpg",
        "0-60": 3,
        "Drift": 0,
        "Handling": 700,
        "Class": "S",
        "Weight": 2700,
        "Stock": 10
      },
      "2021 bentley continental gt": {
        "alias": "2021 continental gt",
        "Name": "2021 Bentley Continental GT",
        "Emote": "<:bently:979618638539669505>",
        "Speed": 202,
        "Price": 0,
        "sellprice": 32625,
        "Engine": " 6.0 L V12",
        "Image": "https://vossenwheels.com/wp-content/uploads/2021/03/Bentley-Continental-GT-Urban-Automotive-x-Vossen-UV-1-%C2%A9-Vossen-Wheels-2021-208.jpg",
        "0-60": 7.9,
        "Drift": 1,
        "Handling": 700,
        "Class": "A",
        "Weight": 4700,
        "Stock": 50
      },
      "2023 honda civic type r": {
        "alias": "2023 civic type r",
        "Name": "2023 Honda Civic Type R",
        "Emote": "<:honda:931011549705957397>",
        "Speed": 165,
        "Price": 0,
        "sellprice": 14625,
        "Engine": "2.0 L 4-cylinder",
        "Image": "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/img-7295-10-1666813703.jpg",
        "0-60": 11.5,
        "Drift": 2,
        "Handling": 600,
        "Weight": 3100,
        "Stock": 100,
        "Class": "C"
      },
      "1990 mercedes 190e": {
        "alias": "1990 190e",
        "Name": "1990 Mercedes 190E",
        "Emote": "<:mercedes_z:973000364410404924>",
        "Speed": 155,
        "Price": 0,
        "sellprice": 14625,
        "Engine": "2.0 L 4-cylinder",
        "Image": "https://www.motortrend.com/uploads/sites/11/2020/02/1990-Mercedes-Benz-190E-2.5-16-Evolution-II-Exterior-Front-3-4-1.jpg",
        "0-60": 10.9,
        "Drift": 0,
        "Handling": 600,
        "Weight": 3100,
        "Stock": 25,
        "Class": "D"
      },
      "1987 ferrari f40 competizione": {
        "alias": "1987 f40 c",
        "Name": "1987 Ferrari F40 Competizione",
        "Emote": "<:ferrari:931011838374727730>",
        "Speed": 215,
        "Price": 2000000,
        "sellprice": 0,
        "Engine": "2.9 L twin-turbocharged V8",
        "Image": "https://www.topgear.com/sites/default/files/2022/08/1989-Ferrari-F40--Competizione-1282781_.jpg",
        "0-60": 6.3,
        "Drift": 0,
        "Handling": 700,
        "Class": "A",
        "Weight": 2700,
        "Stock": 10
      }
    }
  }
});

module.exports = mongoose.model("global", Global);
