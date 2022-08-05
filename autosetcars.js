let db = require("quick.db");
let cardb = require("./cardb.json");

module.exports = async () => {
  const User = require("./schema/profile-schema");

  let carsall = db.all().filter((data) => data.ID.startsWith(`cars_`));
  let cars;
  let id;
  for (let c in carsall) {
    let cardata = carsall[c];

    cars = cardata.data;
    id = cardata.ID.split("_")[1];
    if (cars.length > 0) {
      console.log(id);

      for (let b in cars) {
        console.log(cars);
        let car = cars[b];

        console.log(car);

        let carindb = cardb.Cars[car.toLowerCase()];

        console.log(carindb);

        let handling =
          db.fetch(`${cardb.Cars[car.toLowerCase()].Name}handling_${id}`) ||
          carindb.Handling;
        let exhaust = db.fetch(`${cardb.Cars[car].Name}exhaust_${id}`) || null;
        let gearbox = db.fetch(`${cardb.Cars[car].Name}gearbox_${id}`) || null;
        let tires = db.fetch(`${cardb.Cars[car].Name}tires_${id}`) || null;
        let turbo = db.fetch(`${cardb.Cars[car].Name}turbo_${id}`) || null;
        let intake = db.fetch(`${cardb.Cars[car].Name}intake_${id}`) || null;
        let clutch = db.fetch(`${cardb.Cars[car].Name}clutch_${id}`) || null;
        let ecu = db.fetch(`${cardb.Cars[car].Name}ecu_${id}`) || null;
        let suspension =
          db.fetch(`${cardb.Cars[car].Name}suspension_${id}`) || null;

        let weight = db.fetch(`${cardb.Cars[car].Name}weight_${id}`) || null;
        let drift =
          db.fetch(`${cardb.Cars[car].Name}drift_${id}`) || carindb.Drift || 0;
        let speed =
          db.fetch(`${cardb.Cars[car].Name}speed_${id}`) || carindb.Speed;
        let zerosixty =
          db.fetch(`${cardb.Cars[car].Name}060_${id}`) || carindb["0-60"];

        let nitro = db.fetch(`${cardb.Cars[car].Name}nitro_${id}`) || null;

        let resale =
          db.fetch(`${cardb.Cars[car].Name}resale_${id}`) ||
          cardb.Cars[car].Price * 0.65 ||
          0;
        let range = db.fetch(`${cardb.Cars[car].Name}range_${id}`);

        let engine = db.fetch(`${cardb.Cars[car].Name}engine_${id}`);

        let carimage =
          db.fetch(`${cardb.Cars[car].Name}livery_${id}`) ||
          cardb.Cars[car].Image;

        let carobj = {
          ID: carindb.alias,
          Name: carindb.Name,
          Speed: speed,
          Offroad: 0,
          Acceleration: zerosixty,
          Handling: handling,
          Exhaust: exhaust,
          Intake: intake,
          Engine: engine,
          Suspension: suspension,
          WeightKit: weight,
          ECU: ecu,
          Clutch: clutch,
          Tires: tires,
          Gearbox: gearbox,
          Emote: carindb.Emote,
          Livery: carimage,
          Resale: resale,
          Nitro: nitro,
          Turbo: turbo,
          Miles: 0,
          Range: range,
          Drift: drift,
        };

        let userdata = (await User.findOne({ id: id })) || new User({ id: id });

        if (!userdata) {
          userdata = new User({ id: id });
        }
        console.log(id);

        await User.findOneAndUpdate(
          {
            id: id,
          },
          {
            $push: {
              cars: carobj,
            },
          }
        );
        await userdata.save();
      }
    }
  }
};
