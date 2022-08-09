const { sample } = require("lodash");

module.exports = {
  getRandomTip: () => {
    let tips = [
      "Try buying gold to support us! Starting at $0.99 for 20, and you can do so much with it!",
      "You can upgrade cars with /upgrade",
      "Create a crew and get benefits such as cash bonuses!",
      "Use /weekly, /daily, and /vote to get a small cash boost!",
      "Notoriety is used for seasons, check the current season with /season",
      "Use keys to purchase import crates with exclusive cars",
      "View events with /event",
    ];
    return sample(tips);
  },
};
