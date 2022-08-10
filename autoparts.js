let db = require('quick.db')
let cardb = require('./cardb.json')
let partdb = require('./items.json')
module.exports = async (client) => {
const User = require('./schema/profile-schema')

let carsall = db.all().filter(data => data.ID.startsWith(`parts_`))
let cars
let id
for(c in carsall){
    cardata = carsall[c]

    id = cardata.ID.split("_")[1]
    cars = db.fetch(`parts_${id}`)
    if(cars.length > 0){
        console.log(id)

    
    for (b in cars) {
    let car = cars[b]
    
    console.log(car)
    
    let carindb = car
    
    
    try{


       let part = carindb
        
        let userdata =  await User.findOne({id: id}) || new User({id: id})
        
        if(!userdata){
           userdata = new User({id: id})
        }
        console.log(id)
        
        await User.findOneAndUpdate({
            id: id
        }, {
            $push: {
                parts: part
            }
        })
        await userdata.save()
    }
    catch(err){
        console.log(err)
    }
    }
}
}






}