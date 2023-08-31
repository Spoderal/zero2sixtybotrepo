const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unqiue: true,
  },
  cash: {
    type: Number,
    required: false,
    default: 0,
  },
  garageLimit: {
    type: Number,
    required: false,
    default: 10,
  },
  hasvoted: {
    type: Boolean,
    required: false,
    default: false,
  },
  started: {
    type: Boolean,
    required: false,
    default: false,
  },
  gold: {
    type: Number,
    required: false,
    default: 0,
  },
  votetimer: {
    type: Number,
    required: false,
    default: 0,
  },
  pvprank: {
    type: Object,
    required: false,
    default: {
      Wins: 0,
      Rank: "Silver",
      Losses: 0,
      Rewards: 0,
    },
  },
  wheelspins: {
    type: Number,
    required: false,
    default: 0,
  },
  swheelspins: {
    type: Number,
    required: false,
    default: 0,
  },
  rkeys: {
    type: Number,
    required: false,
    default: 0,
  },
  ckeys: {
    type: Number,
    required: false,
    default: 0,
  },
  ekeys: {
    type: Number,
    required: false,
    default: 0,
  },

  cars: {
    type: Array,
    required: false,
    default: [],
  },
  houses: {
    type: Array,
    required: false,
    default: [],
  },
  parts: {
    type: Array,
    required: false,
    default: [],
  },
  rp3: {
    type: Number,
    required: false,
    default: 0,
  },
  candy: {
    type: Number,
    required: false,
    default: 0,
  },
  blueprints: {
    type: Number,
    required: false,
    default: 0,
  },
  squads: {
    type: Array,
    required: false,
    default: [
      { name: "flame house", car: 0 },
      { name: "x squad", car: 0 },
      { name: "muscle brains", car: 0 },
      { name: "cool cobras", car: 0 },
      { name: "the ws", car: 0 },
      { name: "double 0", car: 0 },
    ],
  },
  noto5: {
    type: Number,
    required: false,
    default: 0,
  },
  noto6: {
    type: Number,
    required: false,
    default: 0,
  },
  stockpoints: {
    type: Number,
    required: false,
    default: 0,
  },

  dkeyst: {
    type: Number,
    required: false,
    default: 0,
  },
  evkeys: {
    type: Number,
    required: false,
    default: 0,
  },
  bank: {
    type: Number,
    required: false,
    default: 0,
  },
  pinkslips: {
    type: Number,
    required: false,
    default: 0,
  },
  vault: {
    type: String,
    required: false,
  },
  banklimit: {
    type: Number,
    required: false,
    default: 10000,
  },
  achievements: {
    type: Array,
    required: false,
    default: [],
  },
  items: {
    type: Array,
    required: false,
    default: [],
  },
  racerank: {
    type: Number,
    required: false,
    default: 1,
  },
  racexp: {
    type: Number,
    required: false,
    default: 0,
  },
  driftrank: {
    type: Number,
    required: false,
    default: 1,
  },
  driftxp: {
    type: Number,
    required: false,
    default: 0,
  },
  racing: {
    type: Number,
    required: false,
    default: 0,
  },
  prestige: {
    type: Number,
    required: false,
    default: 0,
  },
  using: {
    type: Array,
    required: false,
    default: [],
  },
  house: {
    type: Object,
    required: false,
  },
  pet: {
    type: Object,
    required: false,
  },
  badges: {
    type: Array,
    required: false,
    default: [],
  },
  xessence: {
    type: Number,
    required: false,
    default: 0,
  },
  helmet: {
    type: String,
    required: false,
    default: "Default",
  },
  title: {
    type: String,
    required: false,
    default: "Noob Racer",
  },
  seasonrewards: {
    type: Array,
    required: false,
    default: [],
  },
  fallrewards: {
    type: Number,
    required: false,
    default: 0,
  },
  winterrewards: {
    type: Number,
    required: false,
    default: 0,
  },
  spacerewards: {
    type: Number,
    required: false,
    default: 0,
  },
  springrewards: {
    type: Number,
    required: false,
    default: 0,
  },
  tier: {
    type: Number,
    required: false,
    default: 1,
  },
  stage: {
    type: Number,
    required: false,
    default: 0,
  },
  description: {
    type: String,
    required: false,
    default: "No Description",
  },
  pbackground: {
    type: String,
    required: false,
    default: "https://i.ibb.co/HxX0Q2z/profilepage.png",
  },
  work: {
    type: Object,
    required: false,
  },
  showcase: {
    type: String,
    required: false,
  },
  joinedcrew: {
    type: Number,
    required: false,
    default: 0,
  },
  patron: {
    type: Object,
    required: false,
    default: {},
  },
  crewseason: {
    type: Array,
    required: false,
    default: [],
  },
  crew: {
    type: Object,
    required: false,
  },
  dailytask: {
    type: Object,
    required: false,
  },
  tutorial: {
    type: Object,
    required: false,
  },
  weeklytask: {
    type: Object,
    required: false,
  },
  cashcuptier: {
    type: Number,
    required: false,
    default: 1,
  },
  codes: {
    type: Array,
    required: false,
    default: [],
  },
  pfps: {
    type: Array,
    required: false,
    default: [],
  },
  contracts: {
    type: Array,
    required: false,
    default: [],
  },
  bugattiwins: {
    type: Number,
    required: false,
    default: 0,
  },

  moontokens: {
    type: Number,
    required: false,
    default: 0,
  },
  lockpicks: {
    type: Number,
    required: false,
    default: 0,
  },
  titles: {
    type: Array,
    required: false,
    default: [],
  },
  settings: {
    type: Object,
    required: false,
    default: {
      vote: false,
      daily: false,
      tips: true,
      voteStreak: 0,
      dailyStreak: 0,
      ph: "MPH",
      autosell: false,
      trades: true,
    },
  },
  tradeid: {
    type: Number,
    required: false,
  },
  code: {
    type: Boolean,
    required: false,
    default: false,
  },
  marketlimit: {
    type: Number,
    required: false,
    default: 5,
  },
  masterwins: {
    type: Number,
    required: false,
    default: 0,
  },
  tasks: {
    type: Array,
    required: false,
    default: [],
  },
  f1blueprints: {
    type: Number,
    required: false,
    default: 0,
  },
  foolskeys: {
    type: Number,
    required: false,
    default: 0,
  },
  chosef1: {
    type: Boolean,
    required: false,
    default: false,
  },
  choseapril: {
    type: Boolean,
    required: false,
    default: false,
  },
  worldwins: {
    type: Number,
    required: false,
    default: 0,
  },
  newpet: {
    type: Object,
    required: false,
    default: {},
  },
  rocket: {
    type: Boolean,
    required: false,
    default: false,
  },
  spacetokens: {
    type: Number,
    required: false,
    default: 0,
  },
  spaceredeemed: {
    type: Number,
    required: false,
    default: 0,
  },
  canrob: {
    type: Boolean,
    required: false,
    default: true,
  },
  itemeffects: {
    type: Array,
    required: false,
    default: [],
  },
  police: {
    type: Boolean,
    required: false,
    default: false,
  },
  bounty: {
    type: Number,
    required: false,
    default: 0,
  },
  car_racing: {
    type: Object,
    required: false,
    default: {},
  },

  impounds: {
    type: Array,
    required: false,
    default: [],
  },
  impoundtimer: {
    type: Number,
    required: false,
    default: 0,
  },
  canrace: {
    type: Number,
    required: false,
    default: 0,
  },
  lemans: {
    type: Boolean,
    required: false,
    default: false,
  },
  lekeys: {
    type: Number,
    required: false,
    default: 0,
  },
  firstpolice: {
    type: Boolean,
    required: false,
    default: false,
  },
  chased: {
    type: Number,
    required: false,
    default: 0,
  },
  notoriety: {
    type: Number,
    required: false,
    default: 0,
  },
  season1claimed: {
    type: Number,
    required: false,
    default: 1,
  },
  rp4: {
    type: Number,
    required: false,
    default: 0,
  },
  crewseason3: {
    type: Number,
    required: false,
    default: 0,
  },

  perfectengineering: {
    type: Boolean,
    required: false,
    default: false,
  },
  perfectengineeringcomplete: {
    type: Boolean,
    required: false,
    default: false,
  },
  fiestafamilia: {
    type: Boolean,
    required: false,
    default: false,
  },
  fiestafamiliacomplete: {
    type: Boolean,
    required: false,
    default: false,
  },
  pressure: {
    type: Boolean,
    required: false,
    default: false,
  },
  raintrophy: {
    type: Number,
    required: false,
    default: 0,
  },
  chips: {
    type: Number,
    required: false,
    default: 0,
  },
  keepdrift: {
    type: Boolean,
    required: false,
    default: false,
  },
  keeprace: {
    type: Boolean,
    required: false,
    default: false,
  },
  pressurecomplete: {
    type: Boolean,
    required: false,
    default: false,
  },
  seriestickets: {
    type: Number,
    required: false,
    default: 10,
  },
  barnmaps: {
    type: Number,
    required: false,
    default: 0,
  },
  commonCredits: {
    type: Number,
    required: false,
    default: 0,
  },
  rareCredits: {
    type: Number,
    required: false,
    default: 0,
  },
  exoticCredits: {
    type: Number,
    required: false,
    default: 0,
  },
  business: {
    type: Object,
    required: false,
    default: {},
  },
  autogas: {
    type: Boolean,
    required: false,
    default: false,
  },
  typekeys: {
    type: Number,
    required: false,
    default: 0,
  },
  typespeed: {
    type: Number,
    required: false,
    default: 0,
  },
  path: {
    type: String,
    required: false,
    default: "none",
  },
  tparts: {
    type: Array,
    required: false,
    default: [],
  },
  crewrespect: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("profile", Profile);
