function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toCurrency(n) {
  const num = parseInt(n);
  if (num < 0) console.warn("toCurrency: `num` is < 0");

  return `$${numberWithCommas(num)}`;
}

module.exports = {
  numberWithCommas,
  toCurrency,
};
