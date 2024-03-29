const mongoose = require("mongoose");

const Cooldowns = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unqiue: true,
  },
  racing: {
    type: Number,
    required: false,
    default: 0,
  },
  sqracing: {
    type: Number,
    required: false,
    default: 0,
  },
  crime: {
    type: Number,
    required: false,
    default: 0,
  },
  typecooldown:{
    type: Number,
    required: false,
    default: 0,
  },
  deodorant:{
    type: Number,
    required: false,
    default: 0,
  },
  gamble: {
    type: Number,
    required: false,
    default: 0,
  },
  racedisabled:{
    type: Number,
    required: false,
    default: 0,
  },
  upgrading:{
    type:  Number,
    required: false,
    default: 0
  },
  businessopen:{
    type:  Boolean,
    required: false,
    default: false
  },
  driven:{
    type: Number,
    required: false,
    default: 0,
  },
  energydrink: {
    type: Number,
    required: false,
    default: 0,
  },
  grapejuice: {
    type: Number,
    required: false,
    default: 0,
  },
  applejuice: {
    type: Number,
    required: false,
    default: 0,
  },
  orangejuice: {
    type: Number,
    required: false,
    default: 0,
  },
  fruitpunch: {
    type: Number,
    required: false,
    default: 0,
  },
  flattire: {
    type: Number,
    required: false,
    default: 0,
  },
  oil: {
    type: Number,
    required: false,
    default: 0,
  },
  permissionslip: {
    type: Number,
    required: false,
    default: 0,
  },
  pettreats: {
    type: Number,
    required: false,
    default: 0,
  },

  opened: {
    type: Number,
    required: false,
    default: 0,
  },
  bounty: {
    type: Number,
    required: false,
    default: 0,
  },
  epiclockpick: {
    type: Number,
    required: false,
    default: 0,
  },
  goldclear: {
    type: Number,
    required: false,
    default: 0,
  },
  daily: {
    type: Number,
    required: false,
    default: 0,
  },
  canrob: {
    type: Number,
    required: false,
    default: 0,
  },
  rob: {
    type: Number,
    required: false,
    default: 0,
  },
  weekly: {
    type: Number,
    required: false,
    default: 0,
  },
  barn: {
    type: Number,
    required: false,
    default: 0,
  },
  betracing: {
    type: Number,
    required: false,
    default: 0,
  },
  dragracing: {
    type: Number,
    required: false,
    default: 0,
  },
  trackracing: {
    type: Number,
    required: false,
    default: 0,
  },
  stockracing: {
    type: Number,
    required: false,
    default: 0,
  },
  blueprint: {
    type: Number,
    required: false,
    default: 0,
  },
  cashcup: {
    type: Number,
    required: false,
    default: 0,
  },
  voted: {
    type: Number,
    required: false,
    default: 0,
  },
  drift: {
    type: Number,
    required: false,
    default: 0,
  },
  hm: {
    type: Number,
    required: false,
    default: 0,
  },
  junk: {
    type: Number,
    required: false,
    default: 0,
  },
  sponsor: {
    type: Number,
    required: false,
    default: 0,
  },
  petracing: {
    type: Number,
    required: false,
    default: 0,
  },
  waterbottle: {
    type: Number,
    required: false,
    default: 0,
  },
  swheelspin: {
    type: Number,
    required: false,
    default: 0,
  },
  spwheelspin: {
    type: Number,
    required: false,
    default: 0,
  },
  wheelspin: {
    type: Number,
    required: false,
    default: 0,
  },
  timetrial: {
    type: Number,
    required: false,
    default: 0,
  },
  lastDaily: {
    type: Number,
    required: false,
    default: 0,
  },
  crate: {
    type: Number,
    required: false,
    default: 0,
  },
  tequilla: {
    type: Number,
    required: false,
    default: 0,
  },
  radio: {
    type: Number,
    required: false,
    default: 0,
  },
  petcollar: {
    type: Number,
    required: false,
    default: 0,
  },
  usedcar: {
    type: Number,
    required: false,
    default: 0,
  },
  is_racing: {
    type: Number,
    required: false,
    default: 0,
  },
  worked: {
    type: Number,
    required: false,
    default: 0,
  },
  business: {
    type: Number,
    required: false,
    default: 0,
  },
  trading: {
    type: Number,
    required: false,
    default: 0,
  },
  lemans: {
    type: Number,
    required: false,
    default: 0,
  },
  heist: {
    type: Number,
    required: false,
    default: 0,
  },
  chasing: {
    type: Number,
    required: false,
    default: 0,
  },
  pvp: {
    type: Number,
    required: false,
    default: 0,
  },
  gas: {
    type: Number,
    required: false,
    default: 0,
  },
  eventCooldown: {
    type: Number,
    required: false,
    default: 0,
  },
  milk: {
    type: Number,
    required: false,
    default: 0,
  },
  cookie: {
    type: Number,
    required: false,
    default: 0,
  },
  compass: {
    type: Number,
    required: false,
    default: 0,
  },
  cmilk: {
    type: Number,
    required: false,
    default: 0,
  },
  smilk: {
    type: Number,
    required: false,
    default: 0,
  },
  dirt: {
    type: Number,
    required: false,
    default: 0,
  },
  convert: {
    type: Number,
    required: false,
    default: 0,
  },
  series1: {
    type: Number,
    required: false,
    default: 0,
  },
  series1tickets: {
    type: Number,
    required: false,
    default: 0,
  },
  command_ran: {
    type: Number,
    required: false,
    default: 0,
  },
  bubbles: {
    type: Number,
    required: false,
    default: 0,
  },
  chips: {
    type: Number,
    required: false,
    default: 0,
  },
  vault: {
    type: Number,
    required: false,
    default: 0,
  },
  reverse: {
    type: Number,
    required: false,
    default: 0,
  },
  lockpicks:{
    type: Number,
    required: false,
    default: 0,
  },
  location:{
    type: Number,
    required: false,
    default: 0,
  }
});

module.exports = mongoose.model("cooldowns", Cooldowns);
