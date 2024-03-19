const cardb = require("../data/cardb.json");
const editJsonFile = require("edit-json-file");

async function carnew() {
    console.log(__dirname)
    let file = editJsonFile(`${__dirname}/cardb.json`)
    

   
    for (let c in cardb.Cars) {
        let car = cardb.Cars[c];
        if (car) {
            let handling = car.Handling * 10
            car.Handling = handling
            file.set(`Cars.${c}`, car)
            
        }
    }
    console.log(file.get());
    file.save()

    console.log("done")
}

module.exports = {
    carnew,
};