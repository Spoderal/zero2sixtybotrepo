const { SlashCommandBuilder } = require("@discordjs/builders");
const items = require('../items.json')
const User = require('../schema/profile-schema')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy a car or part")
   
    .addStringOption((option) => option
    .setName("item")
    .setDescription("The car or part to buy")
    .setRequired(true)
    )
    .addNumberOption((option) => option
    .setName("amount")
    .setDescription("The amount to buy")
    .setRequired(false)
    ),
    async execute(interaction) {

        let db = require('quick.db')
        let userdata =  await User.findOne({id: interaction.user.id})

        let amount = interaction.options.getNumber("amount")
        let amount2 = amount || 1
        let warehousedb = require("../warehouses.json")
        let cars = require('../cardb.json')
        let houses = require('../houses.json')
        let created = db.fetch(`created_${interaction.user.id}`)
        const {MessageEmbed} = require('discord.js')
        if(!created) return interaction.reply(`Use \`/start\` to begin!`)
        let parts = require('../partsdb.json')
        let list = cars.Cars
        let list2 = parts.Parts
        let list3 = items
        let cashemote = "<:zecash:983966383408832533>"
        let patreon2 = db.fetch(`patreon_tier_2_${interaction.user.id}`)
        let patreon3 = db.fetch(`patreon_tier_3_${interaction.user.id}`)
        let bought = interaction.options.getString("item").toLowerCase()
        let cash = db.fetch(`cash_${interaction.user.id}`) || 0
        let gold = db.fetch(`goldbal_${interaction.user.id}`) || 0
        let usercars = userdata.cars
        let userparts = db.fetch(`parts_${interaction.user.id}`) || []
        let garagelimit = db.fetch(`garagelimit_${interaction.user.id}`) || 10
        let pets = require('../pets.json')
        let list5 = pets.Pets
       

    
            
            if(!list[bought] && !list2[bought] && !bought.toLowerCase() == "1 garage space") return interaction.reply("That car or part isn't available yet, suggest it in the support server! In the meantime, check how to use the command by running /buy.")
            if(!bought) return interaction.reply("To use this command, specify the car or part you want to buy. Example: /buy 1995 Mazda Miata")
        if (list[bought]) {
            if(usercars.length >= garagelimit) return interaction.reply("Your spaces are already filled. Sell a car or get more garage space!")
            
            if(cars.Cars[bought].Price == 0) return interaction.reply("This car is not purchasable.")
            if(usercars.includes(cars.Cars[bought].Name.toLowerCase())) return interaction.reply("You already own this car!")
            let carprice = cars.Cars[bought].Price
        
            if(cars.Cars[bought].Blackmarket){
                if (gold < carprice ) return interaction.reply("You don't have enough gold!")
                let idtoset = cars.Cars[bought.toLowerCase()].alias

                db.subtract(`goldbal_${interaction.user.id}`, carprice)   
                db.push(`cars_${interaction.user.id}`, cars.Cars[bought].Name.toLowerCase())
                db.set(`${cars.Cars[bought].Name}speed_${interaction.user.id}`, cars.Cars[bought].Speed)
                db.set(`${cars.Cars[bought].Name}resale_${interaction.user.id}`, cars.Cars[bought].sellprice)
                db.set(`${cars.Cars[bought].Name}060_${interaction.user.id}`, `${cars.Cars[bought]["0-60"]}`) 
                db.set(`${cars.Cars[bought].Name}drift_${interaction.user.id}`, parseInt(cars.Cars[bought].Drift))
                db.set(`${cars.Cars[bought].Name}handling_${interaction.user.id}`, parseInt(cars.Cars[bought].Handling))
                db.set(`selected_${idtoset}_${interaction.user.id}`, bought.toLowerCase())
                db.push(`selectedids_${interaction.user.id}`, `${idtoset} : ${cars.Cars[bought.toLowerCase()].Name}`)
                db.set(`isselected_${cars.Cars[bought.toLowerCase()].Name}_${interaction.user.id}`, idtoset)

                if(cars.Cars[bought].Exhaust){
                    db.set(`${cars.Cars[bought].Name}exhaust_${interaction.user.id}`, cars.Cars[bought].Exhaust)

                }
                if(cars.Cars[bought].Intake){
                    db.set(`${cars.Cars[bought].Name}intake_${interaction.user.id}`, cars.Cars[bought].Intake)

                }
                if(cars.Cars[bought].Turbo){
                    db.set(`${cars.Cars[bought].Name}turbo_${interaction.user.id}`, cars.Cars[bought].Turbo)

                }
                if(cars.Cars[bought].Tires){
                    db.set(`${cars.Cars[bought].Name}tires_${interaction.user.id}`, cars.Cars[bought].Tires)

                }
                db.add(`carsbought`, 1)

                let embed = new MessageEmbed()
                .setTitle(`Bought ${cars.Cars[bought].Name}`)
                .addField("Price", `${(carprice)} <:z_gold:933929482518167552>`)
                .addField(`ID`, `${idtoset}`)
                .addField("New gold balance", `${(db.fetch(`goldbal_${interaction.user.id}`))} <:z_gold:933929482518167552>`)
     .setColor("#60b0f4")                .setThumbnail(`${cars.Cars[bought].Image}`)
                interaction.reply({embeds: [embed]});
                return;
            }
            else {
                if (cash < carprice ) return interaction.reply("You don't have enough cash!")
              
            
                if(cars.Cars[bought].Police){
                    let sellprice = cars.Cars[bought].Price * 0.65
                    if (cash < cars.Cars[bought].Price) return interaction.reply("You don't have enough cash!")

                    let job = db.fetch(`job_${interaction.user.id}`) 
                    if(!job) return interaction.reply("You don't have a job!")
                    if(job.Job !== "police") return interaction.reply("You don't work as a cop! Use \`/work hire\` to get a job!")
                    
                    let jobrank = job.Rank
                    let num = job.Number 
                    let salary = job.Salary
                    let exp = job.EXP
                    let timeout = job.Timeout
                    let actjob = job.Job
       

                    if(num < cars.Cars[bought].Police) return interaction.reply(`You need the rank "${cars.Cars[bought].Rank} to buy this car!`)
                    db.subtract(`cash_${interaction.user.id}`, cars.Cars[bought].Price);
                    db.push(`cars_${interaction.user.id}`, cars.Cars[bought].Name.toLowerCase())
                    db.set(`${cars.Cars[bought].Name}speed_${interaction.user.id}`, parseInt(cars.Cars[bought].Speed))
                    db.set(`${cars.Cars[bought].Name}resale_${interaction.user.id}`, sellprice)
                    db.set(`${cars.Cars[bought].Name}060_${interaction.user.id}`, `${cars.Cars[bought]["0-60"]}`)
                    db.set(`${cars.Cars[bought].Name}handling_${interaction.user.id}`, Number(cars.Cars[bought].Handling))
                    db.set(`${cars.Cars[bought].Name}drift_${interaction.user.id}`, parseInt(cars.Cars[bought].Drift))
                    let idtoset = cars.Cars[bought.toLowerCase()].alias
                    db.set(`selected_${idtoset}_${interaction.user.id}`, bought.toLowerCase())
                    db.push(`selectedids_${interaction.user.id}`, `${idtoset} : ${cars.Cars[bought.toLowerCase()].Name}`)
                    db.set(`isselected_${cars.Cars[bought.toLowerCase()].Name}_${interaction.user.id}`, idtoset)
                    db.add(`carsbought`, 1)
                    if(cars.Cars[bought.toLowerCase()].Range){
                        db.set(`${cars.Cars[bought].Name}range_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
                        db.set(`${cars.Cars[bought].Name}maxrange_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
    
                    }
                    let embed = new MessageEmbed()
                    .setTitle(`Bought ${cars.Cars[bought].Name}`)
                    .addField("Price", `$${numberWithCommas(cars.Cars[bought].Price)}`)
                    .addField(`ID`, `${idtoset}`)
                    .addField("New cash balance", `$${numberWithCommas(db.fetch(`cash_${interaction.user.id}`))}`)
         .setColor("#60b0f4")                    .setThumbnail(`${cars.Cars[bought].Image}`)
                    return interaction.reply({embeds: [embed]});
                    
                }
                let sellprice = cars.Cars[bought].Price * 0.65
                console.log(sellprice)
                let discountcar = "0"
                if(discountcar !== "0"){
                    
                    let disccarprice = cars.Cars[bought].Price - (cars.Cars[bought].Price * parseFloat(discountcar))
                    console.log(disccarprice)
                    if(cars.Cars[bought].Price == 0) return interaction.reply("This car is not purchasable.")
                    if (cash < disccarprice) return interaction.reply("You don't have enough cash!")
                    let idtoset = cars.Cars[bought.toLowerCase()].alias

                    db.subtract(`cash_${interaction.user.id}`, disccarprice);
                    db.push(`cars_${interaction.user.id}`, cars.Cars[bought].Name.toLowerCase())
                    db.set(`${cars.Cars[bought].Name}speed_${interaction.user.id}`, parseInt(cars.Cars[bought].Speed))
                    db.set(`${cars.Cars[bought].Name}resale_${interaction.user.id}`, sellprice)
                    db.set(`${cars.Cars[bought].Name}060_${interaction.user.id}`, `${cars.Cars[bought]["0-60"]}`)
                    db.set(`${cars.Cars[bought].Name}handling_${interaction.user.id}`, Number(cars.Cars[bought].Handling))
                    db.set(`${cars.Cars[bought].Name}drift_${interaction.user.id}`, parseInt(cars.Cars[bought].Drift))
                    db.set(`selected_${idtoset}_${interaction.user.id}`, bought.toLowerCase())
                    db.push(`selectedids_${interaction.user.id}`, `${idtoset} : ${cars.Cars[bought.toLowerCase()].Name}`)
                    db.set(`isselected_${cars.Cars[bought.toLowerCase()].Name}_${interaction.user.id}`, cars.Cars[bought.toLowerCase()].alias)
                    db.add(`carsbought`, 1)
                    if(cars.Cars[bought.toLowerCase()].Range){
                        db.set(`${cars.Cars[bought].Name}range_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
                        db.set(`${cars.Cars[bought].Name}maxrange_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
    
                    }
                    let embed = new MessageEmbed()
                    .setTitle(`Bought ${cars.Cars[bought].Name}`)
                    .addField("Price", `$${numberWithCommas(disccarprice)} with discount`)
                    .addField("New cash balance", `$${numberWithCommas(db.fetch(`cash_${interaction.user.id}`))}`)
                    .addField(`ID`, `${idtoset}`)
         .setColor("#60b0f4")                    
                    .setThumbnail(`${cars.Cars[bought].Image}`)
                    interaction.reply({embeds: [embed]});
                }
                else {
                    if (cash < carprice) return interaction.reply("You don't have enough cash!")

                    db.subtract(`cash_${interaction.user.id}`, carprice)   
                    let idtoset = cars.Cars[bought.toLowerCase()].alias
                    let carindb = cars.Cars[bought.toLowerCase()]
                    let carobj = {
                        ID: carindb.alias,
                        Name: carindb.Name,
                        Speed: carindb.Speed,
                        Acceleration: carindb["0-60"],
                        Handling: carindb.Handling,
                        Parts: [],
                        Emote: carindb.Emote,
                        Livery: carindb.Image
                    }
                    await User.findOneAndUpdate({
                        id: interaction.user.id
                    }, {
                        $push: {
                             cars: carobj
                        }
                    })
                    db.set(`${cars.Cars[bought].Name}speed_${interaction.user.id}`, parseInt(cars.Cars[bought].Speed))
                    db.set(`${cars.Cars[bought].Name}resale_${interaction.user.id}`, sellprice)
                    db.set(`${cars.Cars[bought].Name}060_${interaction.user.id}`, `${cars.Cars[bought]["0-60"]}`)
                    db.set(`${cars.Cars[bought].Name}handling_${interaction.user.id}`, Number(cars.Cars[bought].Handling))
                    db.set(`${cars.Cars[bought].Name}drift_${interaction.user.id}`, parseInt(cars.Cars[bought].Drift))
                    db.add(`carsbought`, 1)
                    db.set(`selected_${idtoset}_${interaction.user.id}`, bought.toLowerCase())
                    db.push(`selectedids_${interaction.user.id}`, `${idtoset} : ${cars.Cars[bought.toLowerCase()].Name}`)
                    db.set(`isselected_${cars.Cars[bought.toLowerCase()].Name}_${interaction.user.id}`, cars.Cars[bought.toLowerCase()].alias)
                    if(cars.Cars[bought.toLowerCase()].Range){
                        db.set(`${cars.Cars[bought].Name}range_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
                        db.set(`${cars.Cars[bought].Name}maxrange_${interaction.user.id}`, parseInt(cars.Cars[bought].Range))
                        
                    }
                    let embed = new MessageEmbed()
                    .setTitle(`✅ Bought ${cars.Cars[bought].Name}`)
                    .addField("Price", `${cashemote} $${numberWithCommas(carprice)}`, true)
                    .addField(`ID`, `\`${idtoset}\``, true)
                    .addField("New cash balance", `${cashemote} $${numberWithCommas(db.fetch(`cash_${interaction.user.id}`))}`)
         .setColor("#60b0f4")                    
         .setThumbnail(`${cars.Cars[bought].Image}`)
                    interaction.reply({embeds: [embed]});
                    
                }
                }
                

            }
            else if(bought.toLowerCase() == "1 garage space"){
                if (gold < 5 ) return interaction.reply("You don't have enough gold!")
                if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                    db.set(`garagelimit_${interaction.user.id}`, 10)
                }
                
                db.add(`garagelimit_${interaction.user.id}`, 1)

                message.reply("Added 1 space to your garage!")

                db.subtract(`gold_${interaction.user.id}`, 5)
            }
            else if (list2[bought.toLowerCase()]) {
             bought = bought.toLowerCase()
                
                let discount = db.fetch(`partdiscount_${interaction.user.id}`)
                if(amount2 > 50) return interaction.reply(`The max amount you can buy in one command is 50!`)
                    if(parts.Parts[bought].Tier == "BM1"){
                        if (gold < parts.Parts[bought].Price) return interaction.reply("You don't have enough gold!")
                        db.subtract(`goldbal_${interaction.user.id}`, parts.Parts[bought].Price);
                        db.push(`parts_${interaction.user.id}`, parts.Parts[bought].Name.toLowerCase())
                        interaction.reply(`You bought a ${parts.Parts[bought].Name} for 🪙 ${numberWithCommas(parts.Parts[bought].Price)}`);
                    }
                    else {
                        if(discount){
                            let priceforpart = parts.Parts[bought].Price - (parts.Parts[bought].Price * parseFloat(discount))
                            if(parts.Parts[bought].Price == 0) return interaction.reply("This part is not purchasable.")
                            if(cash < (priceforpart * amount2)) return interaction.reply("You don't have enough cash!")
                            priceforpart = amount2 * priceforpart
                            db.subtract(`cash_${interaction.user.id}`, priceforpart);
                            let user1newpart = []
                            for (var i = 0; i < amount2; i ++) user1newpart.push(bought.toLowerCase())
                            for(i in user1newpart){
                        
                                db.push(`parts_${interaction.user.id}`, user1newpart[i])
                            }
                            let embed = new MessageEmbed()
                            .setTitle(`✅ Bought x${amount2} ${parts.Parts[bought].Name} Discounted`)
                            .addField(`Price`, `${cashemote} $${numberWithCommas(priceforpart)}`)
                            .addField("New cash balance", `${cashemote} $${numberWithCommas(db.fetch(`cash_${interaction.user.id}`))}`)
                            .setColor(`#60b0f4`)
                            if(parts.Parts[bought].Image){
                                embed.setThumbnail(parts.Parts[bought].Image)
                            }
                            await interaction.reply({embeds: [embed]});
                        }
                        else {
                            
                            if(parts.Parts[bought].Price == 0) return interaction.reply("This part is not purchasable.")
                            let newprice = parts.Parts[bought].Price * amount2
                            if(cash < newprice) return interaction.reply("You don't have enough cash!")
                            db.subtract(`cash_${interaction.user.id}`, newprice);
                            let user1newpart = []

                            for (var i = 0; i < amount2; i ++) user1newpart.push(bought.toLowerCase())
                            for(i in user1newpart){
                        
                                db.push(`parts_${interaction.user.id}`, user1newpart[i])
                            }
                            let embed = new MessageEmbed()
                            .setTitle(`✅ Bought x${amount2} ${parts.Parts[bought].Name}`)
                            .addField(`Price`, `${cashemote} $${numberWithCommas(parts.Parts[bought].Price)}`)
                            .addField("New cash balance", `${cashemote} $${numberWithCommas(db.fetch(`cash_${interaction.user.id}`))}`)
                            .setColor(`#60b0f4`)
                            if(parts.Parts[bought].Image){
                                embed.setThumbnail(parts.Parts[bought].Image)
                            }
                            await interaction.reply({embeds: [embed]});

                        }

                    }

                

         
         
         
        }
        else if (houses[bought.toLowerCase()]) {
            if (cash < houses[bought.toLowerCase()].Price) return interaction.reply("You don't have enough cash!")
            let house = db.fetch(`house_${interaction.user.id}`)
            if(bought.toLowerCase() !== "yacht"){
                
                if(house){
                    if(house.Perks.includes("+2 Garage spaces")){
                        db.subtract(`garagelimit_${interaction.user.id}`, 2)
                    }
                    else if(house.Perks.includes("+3 Garage spaces")){
                        db.subtract(`garagelimit_${interaction.user.id}`, 3)
                    }
                    else if(house.Perks.includes("+4 Garage spaces")){
                        db.subtract(`garagelimit_${interaction.user.id}`, 4)
                    }
                    else if(house.Perks.includes("+6 Garage spaces")){
                        db.subtract(`garagelimit_${interaction.user.id}`, 6)
                    }
                }
                if(houses[bought].Rewards.includes("10% Discount on parts")){
                    db.set(`partdiscount_${interaction.user.id}`, 0.10)
                }
                else if(houses[bought].Rewards.includes("15% Discount on parts")){
                    db.set(`partdiscount_${interaction.user.id}`, 0.15)
                }
                else if(houses[bought].Rewards.includes("20% Discount on parts")){
                    db.set(`partdiscount_${interaction.user.id}`, 0.20)
                }
                 if(houses[bought].Rewards.includes("20% Discount on parts AND cars")){
                    db.set(`partdiscount_${interaction.user.id}`, 0.20)
                    db.set(`cardiscount_${interaction.user.id}`, 0.20)
    
                }
                else if(houses[bought].Rewards.includes("25% Discount on parts AND cars")){
                    db.set(`partdiscount_${interaction.user.id}`, 0.25)
                    db.set(`cardiscount_${interaction.user.id}`, 0.25)
    
                }
    
                 if(houses[bought].Rewards.includes("+2 Garage spaces")){
                    if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                        db.set(`garagelimit_${interaction.user.id}`, 10)
                    }
    
                    let garagel = db.fetch(`garagelimit_${interaction.user.id}`)
    
                    db.add(`garagelimit_${interaction.user.id}`, 2)
                }
                else  if(houses[bought].Rewards.includes("+3 Garage spaces")){
                    if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                        db.set(`garagelimit_${interaction.user.id}`, 10)
                    }
                    let garagel = db.fetch(`garagelimit_${interaction.user.id}`)
    
                  
                    
                    db.add(`garagelimit_${interaction.user.id}`, 3)
                }
                else  if(houses[bought].Rewards.includes("+4 Garage spaces")){
                    if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                        db.set(`garagelimit_${interaction.user.id}`, 10)
                    }
                    
                    db.add(`garagelimit_${interaction.user.id}`, 4)
                }
                else  if(houses[bought].Rewards.includes("+6 Garage spaces")){
                    if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                        db.set(`garagelimit_${interaction.user.id}`, 10)
                    }
                    
                    db.add(`garagelimit_${interaction.user.id}`, 6)
                }
                else  if(houses[bought].Rewards.includes("+15 Garage spaces")){
                    if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
                        db.set(`garagelimit_${interaction.user.id}`, 10)
                    }
                    
                    db.add(`garagelimit_${interaction.user.id}`, 15)
                }
                db.set(`house_${interaction.user.id}`, {name: houses[bought].Name, Perks: houses[bought].Rewards})
            }
            else {
                db.set(`yacht_${interaction.user.id}`, true)
            }
            db.subtract(`cash_${interaction.user.id}`, houses[bought].Price);

            interaction.reply(`You bought ${houses[bought].Name} for $${numberWithCommas(houses[bought].Price)}`)
     
     
     
    }
    else if(warehousedb[bought.toLowerCase()]){
        let warehouses = db.fetch(`warehouses_${interaction.user.id}`) || []
        let prestige = db.fetch(`prestige_${interaction.user.id}`) || 0

        if(prestige < 11) return interaction.reply(`Your prestige needs to be 11 before you can buy warehouses!`)
        if(warehouses.includes(bought.toLowerCase())) return interaction.reply(`You've already purchased this warehouse!`)

        db.push(`warehouses_${interaction.user.id}`, bought.toLowerCase())
        if(!db.fetch(`garagelimit_${interaction.user.id}`)) {
            db.set(`garagelimit_${interaction.user.id}`, 10)
        }
        
        db.add(`garagelimit_${interaction.user.id}`, warehousedb[bought.toLowerCase()].Space)
        

        interaction.reply(`You bought the ${warehousedb[bought.toLowerCase()].Emote} ${warehousedb[bought.toLowerCase()].Name} for $${numberWithCommas(warehousedb[bought.toLowerCase()].Price)}`)

    }
   
    else if (list3.Police[bought] || list3.Other[bought] || list3.Multiplier[bought]) {
        let pricing
        let item
        let itemshop = db.fetch(`itemshop`)
        if(list3.Police[bought]){
            pricing = list3.Police[bought].Price * amount2
            if(itemshop.Police.Name !== list3.Police[bought].Name) return interaction.reply("This item isnt in the shop today! Check back tomorrow.")
            if(cash < pricing) return interaction.reply(`You can't afford this item!`)
            db.subtract(`cash_${interaction.user.id}`, pricing)
            let user1newpart = []

            for (var i = 0; i < amount2; i ++) user1newpart.push(list3.Police[bought].Name.toLowerCase())
            for(i in user1newpart){
        
                db.push(`items_${interaction.user.id}`, user1newpart[i])
            }

            interaction.reply(`Purchased x${amount2} ${list3.Police[bought].Emote} ${list3.Police[bought].Name} for $${numberWithCommas(pricing)}`)

        }
        else if(list3.Other[bought]){
            pricing = list3.Other[bought].Price * amount2
            if(itemshop.Other.Name !== list3.Other[bought].Name && itemshop.Other2.Name !== list3.Other[bought].Name && itemshop.Other3.Name !== list3.Other[bought].Name) return interaction.reply("This item isnt in the shop today! Check back tomorrow.")
            if(list3.Other[bought].Items){
                let boughtb = db.fetch(`bought_${bought}_${interaction.user.id}`)
                if(boughtb == list3.Other[bought].Items) return interaction.reply(`The maximum amount of ${bought}s have been purchased by you today.`)
                db.add(`bought_${bought}_${interaction.user.id}`, 1)

            }
            if(cash < pricing) return interaction.reply(`You can't afford this item!`)

            db.subtract(`cash_${interaction.user.id}`, pricing)
            let user1newpart = []

            for (var i = 0; i < amount2; i ++) user1newpart.push(list3.Other[bought].Name.toLowerCase())
            for(i in user1newpart){
        
                db.push(`items_${interaction.user.id}`, user1newpart[i])
            }

            interaction.reply(`Purchased x${amount2} ${list3.Other[bought].Emote} ${list3.Other[bought].Name} for $${numberWithCommas(pricing)}`)

        }
        else if(list3.Multiplier[bought]){
            pricing = list3.Multiplier[bought].Price * amount2
            if(itemshop.Multi.Name !== list3.Multiplier[bought].Name) return interaction.reply("This item isnt in the shop today! Check back tomorrow.")
            if(cash < pricing) return interaction.reply(`You can't afford this item!`)

            db.subtract(`cash_${interaction.user.id}`, pricing)
            let user1newpart = []

            for (var i = 0; i < amount2; i ++) user1newpart.push(list3.Multiplier[bought].Name.toLowerCase())
            for(i in user1newpart){
        
                db.push(`items_${interaction.user.id}`, user1newpart[i])
            }

            interaction.reply(`Purchased x${amount2} ${list3.Multiplier[bought].Emote} ${list3.Multiplier[bought].Name} for $${numberWithCommas(pricing)}`)

        }
        else {
            interaction.reply(`Thats not a purchasable item, car, house, or part!`)
        }

    
}
        
    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  