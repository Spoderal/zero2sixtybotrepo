const cars = require("../data/cardb.json");
const partdb = require("../data/partsdb.json").Parts
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const garagedb = require("../data/garages.json")
const {toCurrency} = require("../common/utils")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('lockpick')
    .setDescription("Lockpick a random garage for rewards"),
    async execute(interaction) {

let udata = await User.findOne({ id: interaction.user.id })
let lockpicks = udata.lockpicks
console.log(udata)
console.log(lockpicks)
if(lockpicks == 0) return interaction.reply(`You're out of lockpicks!`)
let trypick = lodash.sample([true, false])
udata.lockpicks -= 1
udata.update()
if(trypick == false) {
    interaction.reply("Your lockpick broke!")
    udata.save()
    return;
} 

let garages = []
for(let g in garagedb){
    let garage = garagedb[g]

    garages.push({chance: garage.Rarity, type: garage.Name.toLowerCase()})
}

let rarity


function pickRandom(rarities) {

    // Calculate chances for common
    var filler = 80 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
  
    if (filler <= 0) {
      console.log("chances sum is higher than 80!");
      return;
    }
  
    // Create an array of 100 elements, based on the chances field
    var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);
  
    // Pick one
    var pIndex = Math.floor(Math.random() * 80);
     rarity = rarities[probability[pIndex]];
  
    console.log(rarity.type);
  }
  pickRandom(garages)

  let garagepicked = rarity.type


  let garageindb = garagedb[garagepicked]
  let rand1 = lodash.sample(garageindb.Contents)
  let rand2 = lodash.sample(garageindb.Contents)
  let rand3 = lodash.sample(garageindb.Contents)
  let randcash = lodash.random(garageindb.MaxCash)
  let randomarray = [rand1, rand2, rand3]
  let rand2arr = []

  for(let r in randomarray){
    let it = randomarray[r]
    if(cars.Cars[it.toLowerCase()]){
        let carobj = {
            ID: cars.Cars[it.toLowerCase()].alias,
            Name: cars.Cars[it.toLowerCase()].Name,
            Speed: cars.Cars[it.toLowerCase()].Speed,
            Acceleration: cars.Cars[it.toLowerCase()]["0-60"],
            Handling: cars.Cars[it.toLowerCase()].Handling,
            Parts: [],
            Emote: cars.Cars[it.toLowerCase()].Emote,
            Livery: cars.Cars[it.toLowerCase()].Image,
            Miles: 0,
          };
        rand2arr.push(`${cars.Cars[it.toLowerCase()].Emote} ${cars.Cars[it.toLowerCase()].Name}`)
        udata.cars.push(carobj)
    }
   else if(partdb[it.toLowerCase()]){
    rand2arr.push(`${partdb[it.toLowerCase()].Emote} ${partdb[it.toLowerCase()].Name}`)
    udata.parts.push(it.toLowerCase())
    }
  }
  let embed = new Discord.EmbedBuilder()
  .setTitle(`Found ${garagepicked}`)
  .addFields(
    {
        name:`Items found`,
        value: `${rand2arr.join('\n')}\n${toCurrency(randcash)}`,
        inline: true
    }
  
  )
  .setThumbnail(garagedb[garagepicked].Image)
  .setColor(colors.blue)


  udata.cash += randcash

  udata.save()


  interaction.reply({embeds: [embed]})



}

}