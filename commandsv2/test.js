const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lodash = require("lodash");
const colors = require("../common/colors");
const { toCurrency } = require("../common/utils");
const cardb = require("../data/cardb.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("View your daily and weekly tasks"),

  async execute(interaction) {
    let car = cardb.Cars["1995 mazda miata"]
    let car2 = cardb.Cars["2018 koenigsegg agera"]

    let mph = car.Speed
    let weight = car.Weight
    let acceleration = car["0-60"]

    let mph2 = car2.Speed
    let weight2 = car2.Weight
    let acceleration2 = car2["0-60"]


    let tracklength = 400
    let tracklength2 = 400
  

    let speed = 0
    let speed2 = 0
    
    let x = setInterval(() => {
        if(speed < mph){
            speed++

        }
        else {
            clearInterval(x)
        }
    }, 30);
    let x2 = setInterval(() => {
        if(speed2 < mph2){
            speed2++

        }
        else {
            clearInterval(x2)
        }
    }, 30);
    let sec
    let sec2
    let i2 = setInterval(() => {
        console.log(speed)
        let calc = weight * (speed / 234)
        calc = calc / acceleration
        sec = 6.290 * (weight / calc) / acceleration
        calc = calc / sec
        console.log(`calc: ${calc}`)
        console.log(`sec: ${sec}`)
        // car 2
        console.log(speed2)
        let calc2 = weight2 * (speed2 / 234)
        calc2 = calc2 / acceleration2
        sec2 = 6.290 * (weight2 / calc2) / acceleration2
        console.log(`sec2: ${sec2}`)
        
        calc2 = calc2 / sec2
        console.log(`calc2: ${calc2}`)
        tracklength -= calc
        tracklength2 -= calc2

        if(tracklength <= 0){
            console.log("Player 1 Won")
            clearInterval(i2)
        }
        else if(tracklength2 <= 0){
            console.log("Player 2 Won")
            clearInterval(i2)
        }
       
        console.log(`track length ${tracklength}`)
        console.log(`track length 2 ${tracklength2}`)
    }, 1000);


  


  },
};
