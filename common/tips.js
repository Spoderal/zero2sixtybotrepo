const { sample } = require("lodash");

function tipGetRandom() {
  return sample([
    "Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!",
    "You can upgrade cars with /upgrade",
    "Join the support server to get a boost in botrace earnings",
    "Create a crew and get benefits such as cash bonuses!",
    "Use /weekly, /daily, and /vote to get a small cash boost!",
    "Notoriety is used for seasons, check the current season with /season",
    "Use keys to purchase import crates with exclusive cars",
    "View events with /events",
  ]);
}

const tipFooterRandom = {
  text: `Tip: ${tipGetRandom()}`,
};

const tipFooterPurchasePart = {
  text: "Tip: Purchase a part with /buy [part]",
};

const tipFooterSeasonPages = {
  text: "Tip: Use /season [page #] to view page numbers",
};

const tipFooterPurchaseCar = {
  text: 'Tip: Purchase a car with /buy [full car name]"',
};

module.exports = {
  tipGetRandom,
  tipFooterRandom,
  tipFooterPurchasePart,
  tipFooterSeasonPages,
  tipFooterPurchaseCar,
};
