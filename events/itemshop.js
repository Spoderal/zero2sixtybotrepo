const Global = require(`../schema/global-schema`);
const lodash = require("lodash");
let schedule = require("node-schedule")
async function updateItemShop() {
  


schedule.scheduleJob({hour: 0, minute: 0}, function(){
  increaseGas()
});




      
      
     async function increaseGas()  {
      let global = await Global.findOne();  
      global = await Global.findOne();
      let gas = global.gas

      let randomAmounts = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

      let randomAmount = lodash.sample(randomAmounts)

      let increaseOrDecrease = Math.floor(Math.random() * 1);

      switch(increaseOrDecrease){
        case 0:
          gas = gas += randomAmount

          break;

          case 1:
            gas = gas -= randomAmount

            break;
      }

      global.gas = gas

      global.save()


    }


   
}

module.exports = {
  updateItemShop,
};
