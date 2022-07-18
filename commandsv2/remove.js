const discord = require("discord.js");
const db = require("quick.db");
const partdb = require("../partsdb.json");
const cars = require("../cardb.json");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a part from your car")
    .addStringOption((option) =>
      option
        .setName("part")
        .setDescription("The part to remove")
        .addChoice("Exhaust", "exhaust")
        .addChoice("Tires", "tires")
        .addChoice("Intake", "intake")
        .addChoice("Turbo", "turbo")
        .addChoice("Suspension", "suspension")
        .addChoice("Spoiler", "spoiler")
        .addChoice("Body", "body")
        .addChoice("ECU", "ecu")
        .addChoice("Clutch", "clutch")
        .addChoice("Engine", "engine")
        .addChoice("Gearbox", "gearbox")
        .addChoice("Weight", "weight")
        .addChoice("Intercooler", "intercooler")

        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("car")
        .setDescription("The car id to remove the part from")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user1 = interaction.user;
    const parts = db.fetch(`parts_${user1.id}`);
    const user1cars = db.fetch(`cars_${user1.id}`);
    const parttoinstall = interaction.options.getString("part");
    if (!parttoinstall)
      return interaction.reply(
        "Specify a part! Try: Exhaust, Tires, Intake, Turbo, Suspension, Weight, Spoiler, ECU, Clutch or BodyKit"
      );
    let idtoselect =interaction.options.getString("car");
    if (!idtoselect)
      return interaction.reply(
        "Specify an id! Use /ids select [id] [car] to select a car!"
      );
    let car = db.fetch(`selected_${idtoselect}_${user1.id}`);
    if (!car)
      return interaction.reply(
        "That id doesn't have a car! Use /ids select [id] [car] to select it!"
      );

    let list2 = cars.Cars;

    if (!parts) return interaction.reply("You dont have any parts!");
    let list = partdb.Parts;
    let list3 = [
      "exhaust",
      "tires",
      "intake",
      "turbo",
      "suspension",
      "bodykit",
      "engine",
      "spoiler",
      "weight",
      "ecu",
      "clutch",
      "gearbox",
      "body",
      "intercooler"
    ];
    if (!list3.includes(parttoinstall.toLowerCase()))
      return interaction.reply(
        "Thats not an available part! Try: Exhaust, Tires, Intake, Turbo, Suspension, Weight, Spoiler, Body, ECU, Clutch, Gearbox, Intercooler or BodyKit"
      );

    if (!list2[car.toLowerCase()])
      return interaction.reply("Thats not an available car!");
    if (!user1cars.includes(cars.Cars[car.toLowerCase()].Name.toLowerCase()))
      return interaction.reply(
        `You dont own that car! Your cars: ${user1cars.join(", ")}`
      );

    let usercarzerosixty = parseFloat(db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`));

    let usercarspeed = db.fetch(
      `${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`
    );
    let usercardrift = db.fetch(
      `${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`
    );

    parseInt(usercarspeed);
    let partarraylength = parts.length;
    let userparts = [];
    let actpart;
    for (var i = 0; i < partarraylength; i++ && parts !== ["no parts"]) {
      if (!parts || parts.length == 0) {
        actpart = "no parts";
      }
      actpart = parts[i];
      console.log(actpart)
      userparts.push(
        `${partdb.Parts[actpart.toLowerCase()].Emote} ${
          partdb.Parts[actpart.toLowerCase()].Name
        }`
      );
      //Do something
    }

    let carpart = db.fetch(
      `${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${
        user1.id
      }`
    );
    if (!carpart)
      return interaction.reply(
        `This car doesn't have "${parttoinstall}" installed!`
      );

    let partinstall = db
      .fetch(
        `${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${
          user1.id
        }`
      )
      .toLowerCase();
      if(partdb.Parts[partinstall.toLowerCase()].Name == "T2DriftTires" || partdb.Parts[partinstall.toLowerCase()].Name == "T1DriftTires" || partdb.Parts[partinstall.toLowerCase()].Name == "T3DriftTires" || partdb.Parts[partinstall.toLowerCase()].Name == "T4DriftTires"){
        let userparts = db.fetch(`parts_${interaction.user.id}`)

        let resale = partdb.Parts[partinstall.toLowerCase()].Price * 0.35
     
        if(isNaN(resale)) return interaction.reply(`You sold your ${partdb.Parts[partinstall.toLowerCase()].Name}, this is a temporary solution so you cant glitch your car by re-adding the tires.`)
        let finalamount = 1 * resale
        db.delete(
          `${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${
            user1.id
          }`
        );
        interaction.reply(`You sold your ${partdb.Parts[partinstall.toLowerCase()].Name} for $${numberWithCommas(finalamount)}, this is a temporary solution so you cant glitch your car by re-adding the tires.`)
      }
      if(partdb.Parts[partinstall.toLowerCase()].AddedSpeed){
        db.subtract(
          `${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`,
          parseInt(partdb.Parts[partinstall.toLowerCase()].AddedSpeed)
        );

      }
    if(partdb.Parts[partinstall.toLowerCase()].AddedDrift && partdb.Parts[partinstall.toLowerCase()].AddedDrift > 0){
      let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`) || 0
      let newdrift = parseInt(udrift)
      let partdrift = parseInt(partdb.Parts[partinstall.toLowerCase()].AddedDrift)
      let newnew = newdrift -= partdrift
      console.log(`new ${newnew}`)
      
      db.set(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`, newnew)
     

    }
    if(partdb.Parts[partinstall.toLowerCase()].AddedSnow){
      db.subtract(
        `${cars.Cars[car.toLowerCase()].Name}snowscore_${user1.id}`,
        parseInt(partdb.Parts[partinstall.toLowerCase()].AddedSnow)
      );
      

    }
    if(partdb.Parts[partinstall.toLowerCase()].AddedRange){
      db.subtract(
        `${cars.Cars[car.toLowerCase()].Name}maxrange_${user1.id}`,
        parseInt(partdb.Parts[partinstall.toLowerCase()].AddedRange)
      );
      db.subtract(
        `${cars.Cars[car.toLowerCase()].Name}range_${user1.id}`,
        parseInt(partdb.Parts[partinstall.toLowerCase()].AddedRange)
      );

    }
    if(partdb.Parts[partinstall.toLowerCase()].AddedOffRoad){
      db.subtract(
        `${cars.Cars[car.toLowerCase()].Name}offroad_${user1.id}`,
        parseInt(partdb.Parts[partinstall.toLowerCase()].AddedOffRoad)
      );
      
    }
    if(partdb.Parts[partinstall.toLowerCase()].Price){
      let sellprice = partdb.Parts[partinstall.toLowerCase()].Price * 0.35
      db.subtract(
        `${cars.Cars[car.toLowerCase()].Name}resale_${user1.id}`,
        sellprice
      );
      
    }

    let userhandling = parseInt(db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`))
    if(partdb.Parts[partinstall.toLowerCase()].AddHandling){
      let newnewhandle = parseInt(userhandling)
      console.log(userhandling)
      console.log(newnewhandle)
      let newotherhandle = parseInt(partdb.Parts[partinstall.toLowerCase()].AddHandling)

      let newhandling = newnewhandle -= newotherhandle
      console.log(newhandling)

      db.set(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`, newhandling)  

  }
  if(partdb.Parts[partinstall.toLowerCase()].DecreaseHandling){
      let newnewhandle = parseInt(userhandling)
      console.log(userhandling)
      console.log(newnewhandle)
      let newotherhandle = parseInt(partdb.Parts[partinstall.toLowerCase()].DecreaseHandling)

      let newhandling = newnewhandle += newotherhandle
      console.log(newhandling)

      db.set(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`, newhandling)  

  }
  if(partdb.Parts[partinstall.toLowerCase()].Name !== "T2DriftTires" && partdb.Parts[partinstall.toLowerCase()].Name !== "T1DriftTires" && partdb.Parts[partinstall.toLowerCase()].Name !== "T3DriftTires" && partdb.Parts[partinstall.toLowerCase()].Name !== "T4DriftTires"){

    db.push(`parts_${user1.id}`,`${db.fetch(`${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${user1.id}`).toLowerCase()}`);
  }
        let restore = db.fetch(`${cars.Cars[car.toLowerCase()].Name}restoration_${user1.id}`)
        if(restore){
          db.set(`${cars.Cars[car.toLowerCase()].Name}restoration_${user1.id}`, parseFloat(restore - 12.5))
        }
    db.delete(
      `${cars.Cars[car.toLowerCase()].Name}${parttoinstall}_${
        user1.id
      }`
    );
    if(partdb.Parts[partinstall.toLowerCase()].DecreasedDrift && partdb.Parts[partinstall.toLowerCase()].DecreasedDrift> 0){
      let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`) || 0
      let newdrift = parseInt(udrift)
      let partdrift = parseInt(partdb.Parts[partinstall.toLowerCase()].DecreasedDrift)
      let newnew = newdrift += partdrift
      console.log(`new ${newnew}`)
      
      db.set(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`, newnew)

    }
    if(partdb.Parts[partinstall.toLowerCase()].DecreasedSpeed){
      db.add(
        `${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`,
        parseInt(partdb.Parts[partinstall.toLowerCase()].DecreasedSpeed)
      );

    }
    if(parseFloat(partdb.Parts[partinstall.toLowerCase()].AddedSixty) > 0){
      let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`) || 0
      let newdrift = parseFloat(udrift)
      let partdrift = parseFloat(partdb.Parts[partinstall.toLowerCase()].AddedSixty)
      let newnew = newdrift += partdrift
      console.log(`new ${newnew}`)
      
      db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, newnew)

    }
    if(parseFloat(partdb.Parts[partinstall.toLowerCase()].DecreasedSixty) > 0){
      let udrift = db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`) || 0
      let newdrift = parseFloat(udrift)
      let partdrift = parseFloat(partdb.Parts[partinstall.toLowerCase()].DecreasedSixty)
      let newnew = newdrift -= partdrift
      console.log(`new ${newnew}`)
      
      db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, newnew)

    }

    
    if(parseFloat(db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`)) <= 2){
      db.set(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`, 2)   

  }
    let embed = new discord.MessageEmbed()
      .setTitle(
        `Removed ${parttoinstall} on your ${cars.Cars[car.toLowerCase()].Name}`
      )
      .setColor("#60b0f4")
      .addField(
        "Old stats",
        `Speed: ${usercarspeed}
        \n0-60: ${parseFloat(usercarzerosixty)}
        \nDrift Rating: ${usercardrift}
        \nHandling: ${userhandling}`
      )
      .addField(
        "New stats",
        `Speed: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}speed_${user1.id}`)}
        \n0-60: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}060_${user1.id}`)}
        \nDrift: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}drift_${user1.id}`)}
        \nHandling: ${db.fetch(`${cars.Cars[car.toLowerCase()].Name}handling_${user1.id}`)}

        
        `
      )
      .setThumbnail("https://i.ibb.co/JRvV8LM/checkmark1.png");
    interaction.reply({ embeds: [embed] });
  },
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}