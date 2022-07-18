const discord = require("discord.js")
const db = require('quick.db')
const {SlashCommandBuilder} = require('@discordjs/builders')
const lodash = require('lodash')
const partdb = require("../partsdb.json")
const cars = require("../cardb.json")
const ms = require("pretty-ms")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('upgrade')
    .setDescription("Upgrade a part on your car")
    .addStringOption((option) => option
    .setName("part")
    .setDescription("The part to upgrade")
    .addChoice("Exhaust", "exhaust")
    .addChoice("Tires", "tires")
    .addChoice("Intake", "intake")
    .addChoice("Turbo", "turbo")
    .addChoice("Suspension", "suspension")
    .addChoice("ECU", "ecu")
    .addChoice("Clutch", "clutch")
    .addChoice("Engine", "engine")
    .addChoice("Gearbox", "gearbox")
    .addChoice("Nitro", "nitro")
    .addChoice("Body", "body")
    .addChoice("Spoiler", "spoiler")
    .addChoice("Weight", "weight")
    .addChoice("Intercooler", "intercooler")
    .addChoice("Range Boost", "rangeboost")
    .addChoice("Ludicrous", "ludicrous")

    .setRequired(true)
    )

    
    .addStringOption((option) => option
    .setName("car")
    .setDescription("The car id to upgrade, if its a pet just type pet.")
    .setRequired(true)
    
    )
    .addStringOption((option) => option
    .setName("partname")
    .setDescription("The part to install")
    .setRequired(true)
    
    )
    .addStringOption((option) => option
    .setName("options")
    .setDescription("Options to preview upgrades")
    .setRequired(false)
    .addChoice("Preview", "preview")

    ),
    
    async execute(interaction) {
        
        const user1 = interaction.user
        const parts = db.fetch(`parts_${user1.id}`)
        let newplayer = db.fetch(`newplayer_${interaction.user.id}`)
        let newplayerstage = db.fetch(`newplayerstage_${interaction.user.id}`)
        let user1cars = db.fetch(`cars_${user1.id}`)
        let parttoinstall = interaction.options.getString("part");
        let preview =  interaction.options.getString("options");
        let partinstall = interaction.options.getString("partname")

        
        if(!parttoinstall) return interaction.reply("Specify a part! Try: Exhaust, Tires, Intake, Turbo, Suspension, Weight, Spoiler, Engine, ECU, Clutch, Nitro, Gearbox, Intercooler or Body")
        let idtoselect = interaction.options.getString("car");
        if(idtoselect == "pet"){

            let pet = db.fetch(`pet_${user1.id}`)
            if(!pet) return interaction.reply(`You don't have a pet!`)
            let partusers = db.fetch(`parts_${user1.id}`)

            if(!partusers.includes(partinstall)) return interaction.reply(`You don't have a ${partinstall}!`)

            db.set(`pet_${user1.id}.Spoiler`, true)

            interaction.reply(`✅`)
            return;
        }
        if(!idtoselect) {
            let errembed = new discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("DARK_RED")
            .setDescription(`You need to specify an id! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
            return  interaction.reply({embeds: [errembed]})
        }
        let car = db.fetch(`selected_${idtoselect}_${user1.id}`)
        if(!car) {
            let errembed = new discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("DARK_RED")
            .setDescription(`That car/id isn't selected! Use \`/ids Select [id] [car to select] to select a car to your specified id!\n\n**Example: /ids Select 1 1995 mazda miata**`)
            return  interaction.reply({embeds: [errembed]})
        }
        let dailytask1 = db.fetch(`dailytask_${user1.id}`)
        let list2 = cars.Cars
        if(!parts || parts == null) return interaction.reply("You don't have any parts!")

        
        if(!parts) return  interaction.reply("You dont have any parts!")
        let list = partdb.Parts
        let list3 = ["exhaust", "tires", "intake", "turbo", "suspension", "engine", "spoiler", "weight", "ecu", "clutch", "nitro", "rangeboost", "gearbox", "ludicrous", "body", "spoiler", "intercooler"]
        
        if(!list3.includes(parttoinstall.toLowerCase())) return interaction.reply("Thats not an available part! Try: Exhaust, Tires, Intake, Turbo, Suspension, Weight, Spoiler, ECU, Clutch, Nitro, Range Boost, Gearbox, Intercooler or Body")
        if(!list2[car.toLowerCase()]) return  interaction.reply("Thats not an available car!")
        if(!user1cars.includes(cars.Cars[car.toLowerCase()].Name.toLowerCase())) return  interaction.reply(`You dont own that car! Your cars: ${user1cars.join(', ')}`)
        let userparts = parts

        
        let usercarzerosixty = parseFloat(db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`))
        
        let usercarspeed = db.fetch(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`)
        let usercardrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`)
        
        parseInt(usercarspeed)
     
        let carpart = db.fetch(`${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${user1.id}`)
        if(carpart) return  interaction.reply(`This car already has "${parttoinstall}" installed!`)

        if(parttoinstall == "engine" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have engines!")
        if(parttoinstall == "intake" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have intakes!")
        if(parttoinstall == "clutch" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have clutches!")
        if(parttoinstall == "turbo" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have turbos!")
        if(parttoinstall =="exhaust" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have exhausts!")
        if(parttoinstall =="intercooler" && cars.Cars[car.toLowerCase()].Electric) return interaction.reply("EV's cant have intercoolers!")
        if(parttoinstall =="ludicrous" && !cars.Cars[car.toLowerCase()].Electric) return interaction.reply("Only EV's can have ludicrous!")
        if(parttoinstall =="engine" && cars.Cars[car.toLowerCase()].Bike) return interaction.reply("Car engines cant fit on bikes!")
        if(parttoinstall =="spoiler" && cars.Cars[car.toLowerCase()].Bike) return interaction.reply("Bikes cant have spoilers!")
        if(parttoinstall =="intercooler" && cars.Cars[car.toLowerCase()].Bike) return interaction.reply("Bikes cant have intercoolers!")


        if(!userparts || userparts == null || userparts.length == 0) return interaction.reply("You don't have any parts!")

            if(!partdb.Parts[partinstall.toLowerCase()]) return  interaction.reply("Thats not a part!")
            if(!parts.includes(partinstall.toLowerCase())) return interaction.reply(`You don't own a ${partdb.Parts[parttoinstall.toLowerCase()].Emote} ${partdb.Parts[parttoinstall.toLowerCase()].Name}!`)
            if(partdb.Parts[partinstall.toLowerCase()].Type != parttoinstall.toLowerCase()) return interaction.reply(`Thats not a "${parttoinstall}"!`)
            if(preview == "preview"){
                let previewspeed = db.fetch(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`)
                let newspeed = parseInt(partdb.Parts[partinstall.toLowerCase()].AddedSpeed)
                let newzero = partdb.Parts[partinstall.toLowerCase()].AddedSixty
                let previewspeed2 = previewspeed += newspeed
                let previewembed = new discord.MessageEmbed()
                .setTitle("Preview for your new upgrade")
                .addField("Old stats", `Speed: ${usercarspeed}\n0-60: ${usercarzerosixty}s`)
                .addField("New stats", `Speed: ${previewspeed}\n0-60: ${usercarzerosixty -= newzero}s`)
                .setColor("#60b0f4")
                .setThumbnail("https://i.ibb.co/JRvV8LM/checkmark1.png")

                interaction.reply({embeds: [previewembed]})
                return;
    
            }
            if(parseInt(partdb.Parts[partinstall.toLowerCase()].AddedSpeed)){
                Number(usercarspeed)
                
            db.add(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`, Number(partdb.Parts[partinstall.toLowerCase()].AddedSpeed))
            }
            if(partdb.Parts[partinstall.toLowerCase()].AddedDrift && partdb.Parts[partinstall.toLowerCase()].AddedDrift > 0){
                let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`) || 0
                let newdrift = parseInt(udrift)
                let partdrift = parseInt(partdb.Parts[partinstall.toLowerCase()].AddedDrift)
                let newnew = newdrift += partdrift
                console.log(`new ${newnew}`)
                
                db.set(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`, newnew)
            }
            if(partdb.Parts[partinstall.toLowerCase()].AddedSnow){
                db.add(`${cars.Cars[car.toLowerCase()].Name}snowscore_${user1.id}`, parseInt(partdb.Parts[partinstall.toLowerCase()].AddedSnow))
            }
            if(partdb.Parts[partinstall.toLowerCase()].AddedOffRoad){
                db.add(`${cars.Cars[car.toLowerCase()].Name}offroad_${user1.id}`, parseInt(partdb.Parts[partinstall.toLowerCase()].AddedOffRoad))

            }
            if(partdb.Parts[partinstall.toLowerCase()].AddedRange){
                if(!cars.Cars[car.toLowerCase()].Electric) return interaction.reply("This car isn't an EV!")
                db.add(`${cars.Cars[car.toLowerCase()].Name}range_${user1.id}`, parseInt(partdb.Parts[partinstall.toLowerCase()].AddedRange))
                db.add(`${cars.Cars[car.toLowerCase()].Name}maxrange_${user1.id}`, parseInt(partdb.Parts[partinstall.toLowerCase()].AddedRange))

            }

            if(partdb.Parts[partinstall.toLowerCase()].AddedDrift && partdb.Parts[partinstall.toLowerCase()].Type == "tires" && partdb.Parts[partinstall.toLowerCase()].AddedDrift > 0){
                let numb = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${partdb.Parts[partinstall.toLowerCase()].Name}tread_${interaction.user.id}_number`) || 0
                db.add(`${cars.Cars[car.toLowerCase()].Name}_${partdb.Parts[partinstall.toLowerCase()].Name}tread_${interaction.user.id}_number`, numb + 1)
                let newnumb = db.fetch(`${cars.Cars[car.toLowerCase()].Name}_${partdb.Parts[partinstall.toLowerCase()].Name}tread_${interaction.user.id}_number`)
               db.set(`${cars.Cars[car.toLowerCase()].Name}_${partdb.Parts[partinstall.toLowerCase()].Name}tread_${interaction.user.id}_${newnumb}`, partdb.Parts[partinstall.toLowerCase()].Tread) 
            }
            
        
            db.set(`${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${user1.id}`, `${partdb.Parts[partinstall.toLowerCase()].Name}`)
            if(partdb.Parts[partinstall.toLowerCase()].DecreasedDrift && partdb.Parts[partinstall.toLowerCase()].DecreasedDrift > 0){
                let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`) || 0
                let newdrift = parseInt(udrift)
                let partdrift = parseInt(partdb.Parts[partinstall.toLowerCase()].DecreasedDrift)
                let newnew = newdrift -= partdrift
                console.log(`new ${newnew}`)
                
                db.set(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`, newnew)

            }
            if(partdb.Parts[partinstall.toLowerCase()].AddedSixty){
                let newfloat = parseFloat(db.get(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`))
                let newnewpart = parseFloat(partdb.Parts[partinstall.toLowerCase()].AddedSixty)
                let totalnew = newfloat - newnewpart
                console.log(totalnew)
                db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, totalnew)   

            }
            if(partdb.Parts[partinstall.toLowerCase()].DecreasedSixty){
                let newfloat2 = parseFloat(db.get(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`))
                let newnewpart2 = parseFloat(partdb.Parts[partinstall.toLowerCase()].DecreasedSixty)
                let totalnew2 = newfloat2 += newnewpart2
                console.log(totalnew2)
                db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, totalnew2)   

            }
            if(partdb.Parts[partinstall.toLowerCase()].DecreasedSpeed){
                db.subtract(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`, parseInt(partdb.Parts[partinstall.toLowerCase()].DecreasedSpeed))

            }
           
            if(parseFloat(db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`)) <= 2){
                db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, 2)   
        
            }
            if(partdb.Parts[partinstall.toLowerCase()].Type == "nitro"){
                db.set(`${cars.Cars[car.toLowerCase()].Name}boost_${user1.id}`, partdb.Parts[partinstall.toLowerCase()].AddedBoost)   
                db.set(`${cars.Cars[car.toLowerCase()].Name}nitro_${user1.id}`, partdb.Parts[partinstall.toLowerCase()].Name)   

            }
         
            if(!db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`)){
                db.set(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`, 500)
            }
            let olduserhandling = parseInt(db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`)) || 500

            if(partdb.Parts[partinstall.toLowerCase()].AddHandling){
                let userhandling = parseInt(db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`))
                let newnewhandle = parseInt(userhandling)
                console.log(userhandling)
                console.log(newnewhandle)
                let newotherhandle = parseInt(partdb.Parts[partinstall.toLowerCase()].AddHandling)

                let newhandling = newnewhandle += newotherhandle
                console.log(newhandling)

                db.set(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`, newhandling)  

            }
            if(partdb.Parts[partinstall.toLowerCase()].DecreaseHandling){
                let userhandling = parseInt(db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`))
                let newnewhandle = parseInt(userhandling)
                console.log(userhandling)
                console.log(newnewhandle)
                let newotherhandle = parseInt(partdb.Parts[partinstall.toLowerCase()].DecreaseHandling)

                let newhandling = newnewhandle -= newotherhandle
                console.log(newhandling)

                db.set(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`, newhandling)  

            }
            
            if(partdb.Parts[partinstall.toLowerCase()].Price > 0) {
                let sellprice = partdb.Parts[partinstall.toLowerCase()].Price * 0.35
                db.add(`${cars.Cars[car.toLowerCase()].Name}resale_${user1.id}`, sellprice)
                console.log(sellprice)
            }
            for (var i = 0; i < 1; i ++) parts.splice(parts.indexOf(partinstall.toLowerCase()), 1)
            db.set(`parts_${user1.id}`, parts)
            let embed = new discord.MessageEmbed()
            .setTitle(`Upgraded ${parttoinstall} on your ${cars.Cars[car.toLowerCase()].Name}`)
            .setColor("#60b0f4")
            .addField("Old stats", `Speed: ${usercarspeed}\n\n0-60: ${usercarzerosixty}\n\nDrift Rating: ${usercardrift}\n\nHandling: ${olduserhandling}`)
            .addField("New stats", `Speed: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`)}\n\n0-60: ${parseFloat(db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`))}\n\nDrift Rating: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`)}\n\nHandling: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`)}`)
            .setThumbnail("https://i.ibb.co/JRvV8LM/checkmark1.png")
            if(newplayer && newplayerstage == 4){
                embed.setDescription("Sweet! Your car is now even better, now you know the basics about the bot! There are a ton of other features to unlock, if you need any help don't hesitate to join our wonderful community server!")
                db.delete(`newplayer_${user1.id}`)
                db.delete(`newplayerstage_${user1.id}`)
            }
            interaction.reply({embeds: [embed]})
            if(dailytask1 && dailytask1.task == "Install a dualturbo on a car" && !dailytask1.completed && partinstall.toLowerCase() == "dualturbo") {
                db.set(`dailytask_${user1.id}.completed`, true)
                db.add(`cash_${user1.id}`, dailytask1.reward)
                interaction.reply(`${user1}, you've completed your daily task "${dailytask1.task}"!`)
            }

        
        
          
        
          function removeA(partsitem) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && partsitem.length) {
                what = a[--L];
                while ((ax= partsitem.indexOf(what)) !== -1) {
                    partsitem.splice(ax, 1);
                }
            }
            return partsitem;
        }
    }
}