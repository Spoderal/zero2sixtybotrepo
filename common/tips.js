const { sample } = require("lodash");

function tipGetRandom() {
  return sample([
    "Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it! **Turn off tips in /settings**",
    "You can upgrade cars with /upgrade **Turn off tips in /settings**",
    "Create a crew and get benefits such as cash bonuses! **Turn off tips in /settings**",
    "Use /weekly, /daily, and /vote to get a small cash boost! **Turn off tips in /settings**",
    "Notoriety is used for seasons, check the current season with /season **Turn off tips in /settings**",
    "Use keys to purchase import crates with exclusive cars **Turn off tips in /settings**",
    "View events with /events **Turn off tips in /settings**",
    "Find character outfits in wheelspin! **Turn off tips in /settings**",
    "Check out gold with /gold to support us! **Turn off tips in /settings**",
    "Check out your profile and progress with /profile **Turn off tips in /settings**",
    "Restore old cars with /restore, find old cars with /barn when you receive maps! **Turn off tips in /settings**",
    "Voting helps us a lot! Use /vote to vote for us to get a vote crate AND refill all of your cars! **Turn off tips in /settings**",
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
  text: 'Tip: Purchase a car with /buy [full car name or id]"',
};

module.exports = {
  tipGetRandom,
  tipFooterRandom,
  tipFooterPurchasePart,
  tipFooterSeasonPages,
  tipFooterPurchaseCar,
};
