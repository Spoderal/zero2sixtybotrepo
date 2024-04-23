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
  cars:{
    type: Array,
    required: false,
    default: [],
  },
  pvp:{
    type: Array,
    required: false,
    default: [],
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

  umarket: {
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
  stats: {
    type: Object,
    required: false,
    default: {},
  },
  events: {},
  stock: {
    type: Array,
    required: false,
    default: [
      {
        alias: "1987 f40",
        Name: "1987 Ferrari F40",
        Emote: "<:ferrari:931011838374727730>",
        Speed: 478,
        Price: 5000000,
        sellprice: 2500000,
        Engine: "V8",
        Image: "https://hips.hearstapps.com/roa.h-cdn.co/assets/15/17/980x490/landscape-1429712553-img046.jpg?resize=1200:*",
        "0-60": 4.3,
        Drift: 0,
        Handling: 525,
        Drivetrain: "RWD",
        Obtained: "Event",
        Class: "A",
        Stock: 25,
        Bought:[],
        Weight: 2700
      },
    ],
  },
  liveries: {
    type: Array,
    required: false,
    default: [],
  },
  referrals: {
    type: Array,
    required: false,
    default: [],
  },
  drops: {
    type: Array,
    required: false,
    default: [],
  },
  usedcars: {
    type: Array,
    required: false,
    default: [],
  },
  usedcooldown: {
    type: Number,
    required: false,
    default: 0,
  },
  shopitems: {
    type: Array,
    required: false,
    default: [],
  },
  clearbounty: {
    type: Number,
    required: false,
    default: 0,
  },
  legacy: {
    type: Array,
    required: false,
    default: [],
  },
  gas: {
    type: Number,
    required: false,
    default: 0,
  },
  leteams: {
    type: Array,
    required: false,
    default: [
      { name: "Audi", wins: 0, members: [] },
      { name: "Ferrari", wins: 0, members: [] },
      { name: "Porsche", wins: 0, members: [] },
      { name: "Toyota", wins: 0, members: [] },
    ],
  },
});

module.exports = mongoose.model("global", Global);
