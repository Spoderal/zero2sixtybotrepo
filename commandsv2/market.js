const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");
const colors = require("../common/colors");
const { emotes } = require("../common/emotes");
const { toCurrency } = require("../common/utils");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const Global = require("../schema/global-schema");
const partdb = require("../data/partsdb.json").Parts
const cardb = require("../data/cardb.json").Cars
const itemdb = require("../data/items.json")
const currencydb = require('../data/currencydb.json')


module.exports = {
  data: new SlashCommandBuilder()
    .setName("market")
    .setDescription("The user market")
    .addSubcommand((cmd) => cmd
    .setName("list")
    .setDescription("List an item")
    .addStringOption((option) => option
    .setName("item")
    .setDescription("The item to list")
    .setRequired(true)
    
    )
    .addBooleanOption((option) => option
    .setName("anonymous")
    .setDescription("If you don't want your username to show in your listing")
    .setRequired(true)
    
    )
    .addNumberOption((option) => option
    .setName("price")
    .setDescription("The price to set")
    .setRequired(true)
    )
    )
    .addSubcommand((cmd) => cmd
    .setName("unlist")
    .setDescription("Remove an item from the market")
    .addStringOption((option) => option
    .setName("id")
    .setDescription("The id to unlist")
    .setRequired(true)
    
    )
    )
    .addSubcommand((cmd) => cmd
    .setName("buy")
    .setDescription("Buy an item")
    .addStringOption((option) => option
    .setName("id")
    .setDescription("The item id to buy")
    .setRequired(true)
    )
    )
    .addSubcommand((cmd) => cmd
    .setName("view")
    .setDescription("View the market")
    .addStringOption((option) => option
    .setName("filter")
    .setDescription("Filter the market")
    .setRequired(false)
    .addChoices(
        {name: `🚗 Cars`, value: `cars`},
        {name: `⚙️ Parts`, value: `parts`},
        {name: `🪛 Items`, value: `items`}
    )
    )
    .addNumberOption((option) => option
    .setName("maxprice")
    .setDescription("Filter the market by max price")
    .setRequired(false)
    )
    .addNumberOption((option) => option
    .setName("minprice")
    .setDescription("Filter the market by min price")
    .setRequired(false)
    )
    )
    .addSubcommand((cmd) => cmd
    .setName("stats")
    .setDescription("View stats of an item on the market")
    .addStringOption((option) => option
    .setName("id")
    .setDescription("The item id to check")
    .setRequired(true)
    )
    ),
  async execute(interaction) {

    let globals = (await Global.findOne())
    let market = globals.umarket
    let command = interaction.options.getSubcommand();
    let userdata = await User.findOne({id: interaction.user.id})


    if(command == "view"){
        let displaypage = 1
        let filter = interaction.options.getString("filter")
        let minfilter = interaction.options.getNumber("maxprice")
        let maxfilter = interaction.options.getNumber("minprice")

        if(filter){
            if(filter == "cars"){
                market = market.filter((it) => cardb[it.Item.toLowerCase()])
            }
            if(filter == "parts"){
                market = market.filter((it) => partdb[it.Item.toLowerCase()])
            }
            if(filter == "items"){
                market = market.filter((it) => itemdb[it.Item.toLowerCase()])
            }
        }

        if(minfilter){
            market = market.filter((it) => it.Price < minfilter)
        }

        if(maxfilter){
            market = market.filter((it) => it.Price > maxfilter)
        }

        if(minfilter && maxfilter){
            market = market.filter((it) => it.Price < maxfilter && it.Price > minfilter)
        }

        market = lodash.chunk(
            market.map((a) => a),
            6
          );
        let embed = new EmbedBuilder()
        .setTitle(`User Market Page ${displaypage}/${market.length}`)
        .setColor(colors.blue)
        let row = []
        if(market.length <= 0){
    embed.setDescription("Nothing yet!")
        }
        else {
            for(let i in market[0]){
                let itemname
                let user
                let currency = currencydb[market[0][i].Item.split(" ")[1]]

                if(market[0][i].User == "Anonymous"){
                    user = "Anonymous"
                }
                else {
                    user = market[0][i].User.username
                }
                
                if(cardb[market[0][i].Item.toLowerCase()]){
                    itemname = `${cardb[market[0][i].Item.toLowerCase()].Emote} ${cardb[market[0][i].Item.toLowerCase()].Name}`
                }

                else if(itemdb[market[0][i].Item.toLowerCase()]){
                    itemname = `${itemdb[market[0][i].Item.toLowerCase()].Emote} ${itemdb[market[0][i].Item.toLowerCase()].Name}`
                }
               else if(partdb[market[0][i].Item.toLowerCase()]){
                    itemname = `${partdb[market[0][i].Item.toLowerCase()].Emote} ${partdb[market[0][i].Item.toLowerCase()].Name}`
                }
                else if(market[0][i].Item.toLowerCase().includes("wheelspins") || market[0][i].Item.toLowerCase().includes("barnmaps")){
                    let amount = Number(market[0][i].Item.split(" ")[0]);
                    console.log(currency)
                    itemname = `${amount}x ${currency.Emote} ${currency.Name}`
                }

                embed.addFields({name: `${itemname}`, value: `\`${market[0][i].ID}\`\n${toCurrency(market[0][i].Price)}\nListed by: ${user}`, inline: true})
            }

        
             row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("⬅️")
                .setStyle("Secondary"),
                new ButtonBuilder()
                .setCustomId("next")
                .setLabel("➡️")
                .setStyle("Secondary")
            )

            
            
        }
        let msg
        try {
         msg = await interaction.reply({embeds: [embed], components: [row]})

        }
        catch(err){
            interaction.reply("There's nothing on the market at the moment!")
        }
        


       let filter2 = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector2 = msg.createMessageComponentCollector({
        filter: filter2,
      });

      let page = 0

      collector2.on('collect', async (i) => {

     

        if(i.customId == "next"){
            page++
            if(market[page] == undefined) {
                page--
                embed.setDescription("No more pages!")

            }
            else {

            
             displaypage++
            embed.data.fields = []
            for(let i in market[page]){
                let itemname
                let user
                if(market[page][i].User == "Anonymous"){
                    user = "Anonymous"
                }
                else {
                    user = market[page][i].User.username
                }
                
                if(cardb[market[page][i].Item.toLowerCase()]){
                    itemname = `${cardb[market[page][i].Item.toLowerCase()].Emote} ${cardb[market[page][i].Item.toLowerCase()].Name}`
                }

                else if(itemdb[market[page][i].Item.toLowerCase()]){
                    itemname = `${itemdb[market[page][i].Item.toLowerCase()].Emote} ${itemdb[market[page][i].Item.toLowerCase()].Name}`
                }
               else if(partdb[market[page][i].Item.toLowerCase()]){
                    itemname = `${partdb[market[page][i].Item.toLowerCase()].Emote} ${partdb[market[page][i].Item.toLowerCase()].Name}`
                }

                embed.addFields({name: `${itemname}`, value: `\`${market[page][i].ID}\`\n${toCurrency(market[page][i].Price)}\nListed by: ${user}`, inline: true})
            }

            embed.setTitle(`User Market Page ${displaypage}/${market.length}`)
        }
            await interaction.editReply({embeds: [embed], components: [row]})
        }
        else if(i.customId == "previous"){
            page--
          if(market[page] == undefined) {
            page++
                embed.setDescription("No more pages!")

            }
            else {

            
            displaypage--
            embed.data.fields = []
            for(let i in market[page]){
                let itemname
                let user
                if(market[page][i].User == "Anonymous"){
                    user = "Anonymous"
                }
                else {
                    user = market[page][i].User.username
                }
                
                if(cardb[market[page][i].Item.toLowerCase()]){
                    itemname = `${cardb[market[page][i].Item.toLowerCase()].Emote} ${cardb[market[page][i].Item.toLowerCase()].Name}`
                }

                else if(itemdb[market[page][i].Item.toLowerCase()]){
                    itemname = `${itemdb[market[page][i].Item.toLowerCase()].Emote} ${itemdb[market[page][i].Item.toLowerCase()].Name}`
                }
               else if(partdb[market[page][i].Item.toLowerCase()]){
                    itemname = `${partdb[market[page][i].Item.toLowerCase()].Emote} ${partdb[market[page][i].Item.toLowerCase()].Name}`
                }

                embed.addFields({name: `${itemname}`, value: `\`${market[page][i].ID}\`\n${toCurrency(market[page][i].Price)}\nListed by: ${user}`, inline: true})
            }

            embed.setTitle(`User Market Page ${displaypage}/${market.length}`)
        }
            await interaction.editReply({embeds: [embed], components: [row]})
        }
      })
        
    }
    else if(command == "list"){
        let itemtolist = interaction.options.getString("item")
        let price = interaction.options.getNumber("price")
        if(price <= 1) return interaction.reply("Your items price needs to be more than 0!")
        let itemto = itemtolist.split(" ")[1]
        console.log(itemto)
        if(!cardb[itemtolist.toLowerCase()] && !itemdb[itemtolist.toLowerCase()] && !partdb[itemtolist.toLowerCase()] && !currencydb[itemto.toLowerCase()]) return interaction.reply("Thats not a marketable item!\nIf you're trying to list a car, make sure its the cars name, **NOT** the id\nIf the currency includes a space, make sure to remove the space, so barn maps would be barnmaps")

        let minprice
        let maxprice
        let car = cardb[itemtolist.toLowerCase()]
        let item = itemdb[itemtolist.toLowerCase()]
        let part = partdb[itemtolist.toLowerCase()]

        if(car && car.Price > 0){
            minprice = car.Price * 0.55
            maxprice = 20000000
        }
        else if(car && car.Price == 0) {
            minprice = car.Speed * 100
            maxprice = 200000000
        }

        if(item && item.Price > 0){
            minprice = item.Price * 0.65
            maxprice = 20000000
        }
        else if(item) {
            if(item.Tier){
                minprice = item.Tier * 10000
                maxprice = 200000000
            }
        }

        if(part && part.Price > 0){
            minprice = part.Price * 0.45
            maxprice = 20000000
        }
        else if(part) {
            if(part.Tier){
                minprice = part.Tier * 10000
                maxprice = 200000000
            }
        }
        else if(itemtolist.includes("wheelspins") || itemtolist.includes("wheelspin")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 10000
                maxprice = 200000000

                if(userdata.wheelspins < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.wheelspins -= amount
        }
        else if(itemtolist.includes("superwheelspins") || itemtolist.includes("superwheelspin")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 20000
                maxprice = 200000000

                if(userdata.swheelspins < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.swheelspins -= amount
        }
        else if(itemtolist.includes("lockpicks") || itemtolist.includes("lockpicks")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 5000
                maxprice = 200000000

                if(userdata.lockpicks < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.lockpicks -= amount
        }
        else if(itemtolist.includes("exotickeys") || itemtolist.includes("exotickey")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 5000
                maxprice = 200000000

                if(userdata.ekeys < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.ekeys -= amount
        }
        else if(itemtolist.includes("rarekeys") || itemtolist.includes("rarekey")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 3000
                maxprice = 200000000

                if(userdata.rkeys < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.rkeys -= amount
        }
        else if(itemtolist.includes("commonkeys") || itemtolist.includes("commonkey")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)

            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            minprice = amount * 1000
                maxprice = 200000000

                if(userdata.ckeys < amount) return interaction.reply("You don't have this many wheelspins!")

                userdata.ckeys -= amount
        }
        else if(itemtolist.includes("barnmaps")){
            let amount = Math.round(Number(itemtolist.split(" ")[0]))
            console.log(amount)
            if(amount < 0) return interaction.reply("Your amount needs to be more than 0!")
            if(!Number.isInteger(amount) ) return interaction.reply("You can't use decimals in your pricing!")
            
            minprice = amount * 1000
                maxprice = 200000000

                if(userdata.barnmaps < amount) return interaction.reply("You don't have this many barn maps!")

                userdata.barnmaps -= amount
        }

        console.log(maxprice)
        console.log(minprice)

        if(price > maxprice) return interaction.reply(`Your items price needs to be under ${toCurrency(maxprice)}!`)
        if(price < minprice) return interaction.reply(`Your items price needs to be over ${toCurrency(minprice)}!`)


        let marketid1 = globals.marketId

        
        let anon = interaction.options.getBoolean("anonymous")
        
        
        let uname
        if(anon == true){
            uname = "Anonymous"
        }
        else {
            uname = interaction.user
        }

        let listing = {
            User:uname,
            UserID:interaction.user.id,

            Price: price,
            Item: itemtolist,
            ID: marketid1
        }

        
        if(cardb[itemtolist.toLowerCase()]){
            let carindb = userdata.cars.filter((car) => car.Name.toLowerCase() == itemtolist.toLowerCase())
            if(!carindb) return interaction.reply("You dont have this car!")
            listing = {
                User:uname,
                UserID:interaction.user.id,
                Price: price,
                Item: itemtolist,
                ID: marketid1,
                CarOBJ: carindb[0]
            }

            
                console.log("car")
                 car = cardb[itemtolist.toLowerCase()]
                if(car.Price > 0){
                    minprice = car.Price * 0.55
                    maxprice = 20000000
                }
                else {
                    minprice = car.Speed * 100
                    maxprice = 200000000
                }
                let usercars = userdata.cars
                for (var b = 0; b < usercars.length; b++){
                    if (usercars[b].Name.toLowerCase() === itemtolist.toLowerCase()) {
                      usercars.splice(b, 1);
                      break;
                    }
                }
                userdata.cars = usercars
    
            
        }

       else if(item){
            let useritems = userdata.items
            if(!useritems.includes(itemtolist.toLowerCase())) return interaction.reply("You dont have this item!")

            for (var c = 0; c < useritems.length; c++){
                console.log(useritems[c])
                if (useritems[c].toLowerCase() === itemtolist.toLowerCase()) {
                    useritems.splice(c, 1);
                  break;
                }
            }
            userdata.items = useritems
        }

        else  if(part){
            
            let userparts = userdata.parts
        if(!userparts.includes(itemtolist.toLowerCase())) return interaction.reply("You dont have this part!")
            for (var d = 0; d < userparts.length; d++){
                console.log(userparts[d])
                if (userparts[d].toLowerCase() === itemtolist.toLowerCase()) {
                    userparts.splice(d, 1);
                  break;
                }
            }
            userdata.parts = userparts
        }

        globals.umarket.push(listing)

        globals.marketId += 1

        await   userdata.save()

        await  globals.save()

        return await interaction.reply(`Listed ${itemtolist}`)

    }
    else if(command == "buy"){
        let itemtolist = interaction.options.getString("id")
        let itemindb = market.filter((item) => item.ID == itemtolist)[0]

        if(!itemindb) return interaction.reply(`Thats not an ID for an item! Try using the number you see \`in this format\``)

        if(userdata.cash < itemindb.Price) return interaction.reply(`You cant afford this item! You need ${toCurrency(itemindb.Price)}`)

        if(itemindb.UserID == interaction.user.id) return interaction.reply("You're the owner of this listing you cant buy it")
        
        if(cardb[itemindb.Item.toLowerCase()]){

            
            userdata.cars.push(itemindb.CarOBJ)
        
        }

     
        if(itemdb[itemindb.Item.toLowerCase()]){

            
            userdata.items.push(itemindb.Item.toLowerCase())
        
        }

        if(partdb[itemindb.Item.toLowerCase()]){

            
            userdata.parts.push(itemindb.Item.toLowerCase())
        
        }
        if(itemindb.Item.toLowerCase().includes("wheelspins") || itemindb.Item.toLowerCase().includes("wheelspin") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.wheelspins += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("barnmaps") || itemindb.Item.toLowerCase().includes("barnmap") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.barnmaps += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("lockpicks") || itemindb.Item.toLowerCase().includes("lockpick") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.lockpicks += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("commonkeys") || itemindb.Item.toLowerCase().includes("commonkey") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.ckeys += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("rarekeys") || itemindb.Item.toLowerCase().includes("rarekey") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.rkeys += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("exotickeys") || itemindb.Item.toLowerCase().includes("exotickey") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.ekeys += amount
        
        }
        if(itemindb.Item.toLowerCase().includes("superwheelspins") || itemindb.Item.toLowerCase().includes("superwheelspin") ){

            let amount = Number(itemindb.Item.split(" ")[0]);
            userdata.swheelspins += amount
        
        }
        
        let userdata2 = await User.findOne({id: itemindb.UserID})
        
        userdata.cash -= itemindb.Price
        
        userdata2.cash += itemindb.Price
        
        let umarket = globals.umarket
        for (var e = 0; e < umarket.length; e++){
            if (umarket[e].ID === itemindb.ID) {
                umarket.splice(e, 1);
              break;
            }
        }
        globals.umarket = umarket
        globals.updateOne(`umarket`)
        globals.save()

        await userdata.save()
        await userdata2.save()

        try{
            let usertodm = await interaction.client.users.fetch(itemindb.UserID);

            usertodm.send(`Your item ${itemindb.Item} has been bought! for ${itemindb.Price}`)
        }
        catch(err) {
            console.log(err)
        }

        await interaction.reply(`Bought ${itemindb.Item}`)

    }
    else if(command == "unlist"){
        let itemtolist = interaction.options.getString("id")
        let itemindb = market.filter((item) => item.ID == itemtolist)[0]

        if(!itemindb) return interaction.reply(`Thats not an ID for an item! Try using the number you see \`in this format\``)

        if(!itemindb.UserID == interaction.user.id) return interaction.reply(`Nice try, but that item isn't yours!`)


        if(cardb[itemindb.Item.toLowerCase()]){

            
            userdata.cars.push(itemindb.CarOBJ)
        
        }

     
        if(itemdb[itemindb.Item.toLowerCase()]){

            
            userdata.items.push(itemindb.Item.toLowerCase())
        
        }

        if(partdb[itemindb.Item.toLowerCase()]){

            
            userdata.parts.push(itemindb.Item.toLowerCase())
        
        }
        let umarket = globals.umarket
        for (var e2 = 0; e2 < umarket.length; e2++){
            if (umarket[e2].ID === itemindb.ID) {
                umarket.splice(e2, 1);
              break;
            }
        }
        globals.umarket = umarket
        globals.updateOne(`umarket`)
        globals.save()

        userdata.save()

        await interaction.reply(`Unlisted ${itemindb.Item}`)

    }
    else if(command == "stats"){
        let itemtolist = interaction.options.getString("id")
        let itemindb = market.filter((item) => item.ID == itemtolist)[0]

        if(!itemindb) return interaction.reply(`Thats not an ID for an item! Try using the number you see \`in this format\``)
        if(!itemindb.CarOBJ) return interaction.reply('Thats not a car!')
        let carindb = itemindb.CarOBJ
        let exhaust = carindb.exhaust || "stock exhaust"
        let intake = carindb.intake || "stock intake"
        let tires = carindb.tires || "stock tires"
        let turbo = carindb.turbo || "no turbo"
        let suspension = carindb.suspension || "stock suspension"
        let engine = carindb.engine || cardb[carindb.Name.toLowerCase()].Engine
        let gearbox = carindb.gearbox || "stock gearbox"
        let clutch = carindb.clutch || "stock clutch"
        let ecu = carindb.ecu || "stock ecu"
        let intercooler = carindb.intercooler || "no intercooler"
        let image = carindb.Image || cardb[carindb.Name.toLowerCase()].Image
        
        let embed = new EmbedBuilder()
        .setTitle(`Stats for ${carindb.Name}`)
        .setDescription(`${emotes.speed} Power: ${carindb.Speed}\n${emotes.zero2sixty} Acceleration: ${carindb.Acceleration}\n${emotes.handling} Handling: ${carindb.Handling}\n${emotes.weight} Weight: ${carindb.WeightStat}`)
        .addFields(
            {name: `Exhaust`, value: `${partdb[exhaust.toLowerCase()].Emote} ${partdb[exhaust.toLowerCase()].Name}`, inline: true},
            {name: `Turbo`, value: `${partdb[turbo.toLowerCase()].Emote} ${partdb[turbo.toLowerCase()].Name}`, inline: true},
            {name: `Intake`, value: `${partdb[intake.toLowerCase()].Emote} ${partdb[intake.toLowerCase()].Name}`, inline: true},
            {name: `Engine`, value: `${partdb[engine.toLowerCase()].Emote} ${partdb[engine.toLowerCase()].Name}`, inline: true},
            {name: `Tires`, value: `${partdb[tires.toLowerCase()].Emote} ${partdb[tires.toLowerCase()].Name}`, inline: true},
            {name: `Suspension`, value: `${partdb[suspension.toLowerCase()].Emote} ${partdb[suspension.toLowerCase()].Name}`, inline: true},
            {name: `Gearbox`, value: `${partdb[gearbox.toLowerCase()].Emote} ${partdb[gearbox.toLowerCase()].Name}`, inline: true},
            {name: `Clutch`, value: `${partdb[clutch.toLowerCase()].Emote} ${partdb[clutch.toLowerCase()].Name}`, inline: true},
            {name: `Intercooler`, value: `${partdb[intercooler.toLowerCase()].Emote} ${partdb[intercooler.toLowerCase()].Name}`, inline: true},
            {name: `ECU`, value: `${partdb[ecu.toLowerCase()].Emote} ${partdb[ecu.toLowerCase()].Name}`, inline: true}
            )
            .setColor(colors.blue)
            .setThumbnail(image)
        await interaction.reply({embeds: [embed]})
    }

  },
};
