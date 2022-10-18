const wait = require("node:timers/promises").setTimeout;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toCurrency(n) {
  const num = parseInt(n);
  if (num < 0) console.warn("toCurrency: `num` is < 0");

  return `$${numberWithCommas(num)}`;
}

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

const invisibleSpace = "\u200b";
const blankField = { name: invisibleSpace, value: invisibleSpace };
const blankInlineField = {
  name: invisibleSpace,
  value: invisibleSpace,
  inline: true,
};

const doubleCashWeekendField = {
  name: "Double Cash Weekend!",
  value: invisibleSpace,
};
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
const formatDate = function(date) {
  return (
    [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('/') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

function convertMPHtoKPH(mph) {
  return mph * 1.60934;
}

module.exports = {
  numberWithCommas,
  toCurrency,
  randomRange,
  invisibleSpace,
  blankField,
  blankInlineField,
  doubleCashWeekendField,
  wait,
  formatDate,
  convertMPHtoKPH
};
