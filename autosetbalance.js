let db = require("quick.db");
module.exports = async (client) => {
  const User = require("./schema/profile-schema");

  let cash = db.all().filter((data) => data.ID.startsWith(`cash_`));
  let gold = db.all().filter((data) => data.ID.startsWith(`goldbal_`));
  let bank = db.all().filter((data) => data.ID.startsWith(`bank_`));
  let rp = db.all().filter((data) => data.ID.startsWith(`rp_`));
  let wheelspins = db.all().filter((data) => data.ID.startsWith(`wheelspins_`));
  let swheelspins = db
    .all()
    .filter((data) => data.ID.startsWith(`swheelspins_`));

  for (b in cash) {
    let user = cash[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          cash: cash2,
        },
      }
    );
    userdata.save();
  }

  for (b in gold) {
    let user = gold[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          gold: cash2,
        },
      }
    );
    userdata.save();
  }
  for (b in bank) {
    let user = bank[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          bank: cash2,
        },
      }
    );
    userdata.save();
  }
  for (b in rp) {
    let user = rp[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          rp: cash2,
        },
      }
    );
    userdata.save();
  }
  for (b in wheelspins) {
    let user = wheelspins[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          wheelspins: cash2,
        },
      }
    );
    userdata.save();
  }
  for (b in swheelspins) {
    let user = swheelspins[b];

    let id = user.ID.split("_")[1];
    let cash2 = user.data;
    let userdata = (await User.findOne({ id: id })) || new User({ id: id });

    console.log(id);

    await User.findOneAndUpdate(
      {
        id: id,
      },
      {
        $set: {
          swheelspins: cash2,
        },
      }
    );
    userdata.save();
  }

  console.log(cash);
};
